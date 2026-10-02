import { useStoreContext } from "../../Context";
import { Flipper } from "react-flip-toolkit";
import styles from "./FruitSection.module.css";
import filterFruits from "../../utils/filterFruits";
import FruitItem from "./FruitItem/FruitItem";
import ActiveFilters from "./ActiveFilters/ActiveFilters";

const FruitSection = () => {
  const { fruits, filters, catalogStatus } = useStoreContext();
  const filteredFruits = filterFruits(fruits, filters);

  return (
    <div className={styles.fruitSection}>
      <h2 className={styles.title}>
        On the stall{catalogStatus === "ready" ? ` (${filteredFruits.length})` : ""}
        {filters.favorite && (
          <span className={styles.favoritesTitle}>
            <span className={styles.emDash}>—</span>Favorites
          </span>
        )}
      </h2>

      <ActiveFilters />

      {catalogStatus === "loading" ? (
        <div className={styles.fruitGrid} aria-busy="true" aria-label="Loading fruit catalog">
          {Array.from({ length: 25 }, (_, index) => (
            <div key={index} className={styles.skeletonCard} />
          ))}
        </div>
      ) : filteredFruits.length === 0 ? (
        <p className={styles.noMatch}>
          Nothing on the stall matches those filters. Loosen a color, family, or search and try again.
        </p>
      ) : (
        <Flipper
          flipKey={filteredFruits.map((item) => item.id).join("-")}
          spring={{
            stiffness: 700,
            damping: 70,
          }}>
          <div className={styles.fruitGrid}>
            {filteredFruits.map((fruit) => (
              <FruitItem key={fruit.id} fruit={fruit} />
            ))}
          </div>
        </Flipper>
      )}
    </div>
  );
};

export default FruitSection;
