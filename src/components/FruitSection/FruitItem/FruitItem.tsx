import { useStoreContext } from "../../../Context";
import { Link } from "react-router-dom";
import { Flipped } from "react-flip-toolkit";
import styles from "./FruitItem.module.css";
import { formatUnitPrice } from "../../../utils/formatPrice";
import { Fruit } from "../../../data/types";
import FavoriteIcon from "../../../icons/FavoriteIcon";
import BagIcon from "../../../icons/BagIcon";
import ExpressDelivery from "../../common/ExpressDelivery/ExpressDelivery";

interface FruitItemProps {
  fruit: Fruit;
}

const FruitItem = ({ fruit }: FruitItemProps) => {
  const { setFruits } = useStoreContext();
  const { id, name, slug, price, unit, family, isFavorite, inBag, expressDelivery } = fruit;

  const handleFavoriteClick = () => {
    setFruits((prevFruits) =>
      prevFruits.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  const handleBagClick = () => {
    setFruits((prevFruits) => prevFruits.map((f) => (f.id === id ? { ...f, inBag: !f.inBag } : f)));
  };

  return (
    <Flipped key={id} flipId={id}>
      <div className={styles.fruitItem}>
        <Link to={`/store/${slug}`} className={styles.cardLink} aria-label={`View ${name}`}>
          {expressDelivery ? (
            <span className={styles.express}>
              <ExpressDelivery variant="chip" />
            </span>
          ) : null}
          <img
            className={styles.image}
            src={fruit.imageUrl}
            alt={name}
            width="88"
            height="88"
            loading="lazy"
            decoding="async"
          />

          <div className={styles.info}>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.family}>{family} Family</p>
            <p className={styles.price}>{formatUnitPrice(price, unit)}</p>
          </div>
        </Link>
        <button
          type="button"
          className={`${styles.favorite} ${isFavorite ? styles.clicked : ""}`}
          aria-label={`${isFavorite ? "Remove" : "Add"} ${name} ${isFavorite ? "from" : "to"} favorites`}
          aria-pressed={isFavorite}
          onClick={handleFavoriteClick}>
          <FavoriteIcon isFilled={isFavorite} />
        </button>
        <button
          type="button"
          className={styles.bag}
          aria-label={`${inBag ? "Remove" : "Add"} ${name} ${inBag ? "from" : "to"} bag`}
          aria-pressed={inBag}
          onClick={handleBagClick}>
          <BagIcon isFilled={inBag} />
        </button>
      </div>
    </Flipped>
  );
};

export default FruitItem;
