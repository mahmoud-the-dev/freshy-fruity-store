import { Link } from "react-router-dom";
import styles from "./HomeCarousel.module.css";
import { ApiProduct } from "../../../api/client";

interface CarouselFruitProps {
  fruit: ApiProduct;
}

interface HomeCarouselProps {
  fruits: ApiProduct[];
}

const CarouselFruit = ({ fruit }: CarouselFruitProps) => {
  const { name, slug } = fruit;

  return (
    <Link to={`/store/${slug}`}>
      <div className={styles.carouselFruit}>
        <img
          className={styles.image}
          src={fruit.imageUrl}
          alt={name}
          width="512"
          height="512"
          loading="lazy"
          decoding="async"
        />
        <div className={styles.info}>
          <h3>{name}</h3>
        </div>
      </div>
    </Link>
  );
};

const HomeCarousel = ({ fruits }: HomeCarouselProps) => {
  if (fruits.length === 0) {
    return null;
  }

  return (
    <div className={styles.homeCarousel}>
      <div className={styles.track}>
        {fruits.map((fruit) => (
          <div key={fruit.id} className={styles.carouselItem}>
            <CarouselFruit fruit={fruit} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel;
