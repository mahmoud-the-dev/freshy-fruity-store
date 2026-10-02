import { useStoreContext } from "../../Context";
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
        <div className={styles.fruitGrid}>
          {filteredFruits.map((fruit) => (
            <FruitItem key={fruit.id} fruit={fruit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FruitSection;
