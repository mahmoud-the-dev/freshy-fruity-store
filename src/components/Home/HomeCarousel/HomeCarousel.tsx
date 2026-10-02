import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (fruits.length === 0) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: !prefersReducedMotion,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.homeCarousel}>
      <Slider {...settings}>
        {fruits.map((fruit) => (
          <div key={fruit.id} className={styles.carouselItem}>
            <CarouselFruit fruit={fruit} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeCarousel;
