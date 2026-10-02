import { useEffect, useState } from "react";
import { useStoreContext } from "../../../Context";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./FruitView.module.css";
import { formatMoney, formatUnitPrice } from "../../../utils/formatPrice";
import EditQuantity from "../../common/EditQuantity/EditQuantity";
import InStock from "../../common/InStock/InStock";
import ExpressDelivery from "../../common/ExpressDelivery/ExpressDelivery";
import ButtonBlue from "../../common/ButtonBlue/ButtonBlue";
import ButtonWhite from "../../common/ButtonWhite/ButtonWhite";
import ButtonBack from "../../common/ButtonBack/ButtonBack";
import FavoriteIcon from "../../../icons/FavoriteIcon";
import FruitItem from "../FruitItem/FruitItem";
import { ApiError, fetchProduct, fetchRecommendations, mapProduct, ProductSeo } from "../../../api/client";
import { Fruit, Fruits } from "../../../data/types";
import { siteUrl, useDocumentMeta, useJsonLd } from "../../../utils/documentMeta";

type PageStatus = "loading" | "ready" | "missing" | "error";

function withBagState(fruit: Fruit, catalog: Fruits): Fruit {
  const stored = catalog.find((item) => item.id === fruit.id);
  if (!stored) return fruit;

  return {
    ...fruit,
    quantity: stored.quantity,
    isFavorite: stored.isFavorite,
    inBag: stored.inBag,
  };
}

const FruitViewSkeleton = () => {
  return (
    <div className={styles.page} aria-busy="true" aria-label="Loading this fruit">
      <div className={styles.fruitView}>
        <div className={styles.leftContainer}>
          <div className={`${styles.imageContainer} ${styles.imageBone}`} />
        </div>

        <div className={styles.rightContainer}>
          <span className={styles.bone} />
          <span className={styles.bone} />
          <span className={styles.bone} />
          <span className={styles.bone} />
          <span className={styles.bone} />
        </div>
      </div>

      <section className={styles.recommendations}>
        <span className={`${styles.bone} ${styles.titleBone}`} />
        <div className={styles.recommendGrid}>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className={`${styles.bone} ${styles.cardBone}`} />
          ))}
        </div>
      </section>
    </div>
  );
};

const FruitView = () => {
  const navigate = useNavigate();
  const { fruits, setFruits } = useStoreContext();
  const { slug } = useParams<{ slug: string }>();
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
  const [pageError, setPageError] = useState<string | null>(null);
  const [detail, setDetail] = useState<Fruit | null>(null);
  const [seo, setSeo] = useState<ProductSeo | null>(null);
  const [recommended, setRecommended] = useState<Fruit[]>([]);
  const [attempt, setAttempt] = useState(0);
  const productMeta = detail
    ? {
        title: seo?.title ?? `${detail.name} | Freshy Fruity`,
        description:
          seo?.description ?? detail.description ?? `Buy ${detail.name} from Freshy Fruity in Charleston.`,
        path: `/store/${detail.slug}`,
        image: detail.imageUrl,
      }
    : {
        title: "Freshy Fruity | Sun-ripened fruit market in Charleston",
        description: "Freshy Fruity is a neighborhood fruit market in Charleston for sun-ripened produce.",
        robots: "noindex,follow",
      };
  useDocumentMeta(productMeta);
  useJsonLd(
    "product-schema",
    detail
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: detail.name,
          description: detail.description,
          image: detail.imageUrl,
          url: `${siteUrl}/store/${detail.slug}`,
          offers: {
            "@type": "Offer",
            price: detail.price.toFixed(2),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/store/${detail.slug}`,
          },
        }
      : null
  );

  useEffect(() => {
    if (!slug) {
      setPageStatus("missing");
      setDetail(null);
      setSeo(null);
      setRecommended([]);
      return;
    }

    let cancelled = false;
    setPageStatus("loading");
    setPageError(null);
    setDetail(null);
    setSeo(null);
    setRecommended([]);

    Promise.all([fetchProduct(slug), fetchRecommendations(slug)])
      .then(([product, recommendations]) => {
        if (cancelled) return;
        const fruit = mapProduct(product);
        setDetail(fruit);
        setFruits((current) =>
          current.some((item) => item.id === fruit.id) ? current : [...current, fruit]
        );
        setSeo(product.seo ?? null);
        setRecommended(recommendations.map(mapProduct));
        setPageStatus("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 404) {
          setPageStatus("missing");
          return;
        }
        setPageError(error instanceof Error ? error.message : "Could not load this fruit.");
        setPageStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug, attempt, setFruits]);

  if (pageStatus === "loading") {
    return <FruitViewSkeleton />;
  }

  if (pageStatus === "error" || !detail) {
    if (pageStatus === "error") {
      return (
        <div className={styles.missing}>
          <h1>The stall didn’t answer.</h1>
          <p>{pageError || "We couldn’t load this fruit. Try again in a moment."}</p>
          <ButtonBlue text="Try again" onClick={() => setAttempt((value) => value + 1)} />
        </div>
      );
    }

    return (
      <div className={styles.missing}>
        <h1>That crate isn’t on the stall.</h1>
        <p>We couldn’t find this fruit. It may have sold through — browse what’s ripe today.</p>
        <ButtonBlue text="Back to the store" onClick={() => navigate("/store")} />
      </div>
    );
  }

  const fruit = withBagState(detail, fruits);
  const recommendations = recommended.map((item) => withBagState(item, fruits));
  const { id, name, price, unit, quantity, family, colors, vitamins, isFavorite, inBag, description, expressDelivery } =
    fruit;

  const handleFavoriteClick = () => {
    setFruits((prevFruits) =>
      prevFruits.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  const handleBagClick = () => {
    setFruits((prevFruits) => prevFruits.map((f) => (f.id === id ? { ...f, inBag: !f.inBag } : f)));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBuyNow = () => {
    setFruits((prevFruits) => prevFruits.map((f) => (f.id === id ? { ...f, inBag: true } : f)));

    navigate("/bag");
  };

  return (
    <div className={styles.page}>
      <div className={styles.fruitView}>
        <ButtonBack className={styles.buttonBack} onClick={handleGoBack} />

        <div className={styles.leftContainer}>
          <div className={styles.imageContainer}>
            <FavoriteIcon
              className={`${styles.favorite} ${isFavorite ? styles.clicked : ""}`}
              isFilled={isFavorite}
              onClick={() => handleFavoriteClick()}
            />
            <img className={styles.image} src={fruit.imageUrl} alt={name} />
            {expressDelivery ? <ExpressDelivery variant="stamp" /> : null}
          </div>

          <div className={styles.categories}>
            {colors.map((color) => (
              <div key={color} className={`${styles.color} ${styles[color]}`}>
                {color}
              </div>
            ))}

            {vitamins.map((vitamin) => (
              <div key={vitamin} className={styles.vitamin}>
                {vitamin}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightContainer}>
          <h1>{name}</h1>
          <h4 className={styles.family}>{family} Family</h4>
          <InStock />
          {expressDelivery ? <ExpressDelivery /> : null}
          <h5 className={styles.price}>
            {formatMoney(price * quantity)}
            <span className={styles.unitHint}>{formatUnitPrice(price, unit)}</span>
          </h5>
          <EditQuantity fruit={fruit} />
          <div className={styles.description}>
            {description || "A stall favorite — ask us for tasting notes at the counter."}
          </div>
          <ButtonBlue text="Buy Now" className={styles.checkoutButton} onClick={handleBuyNow} />
          <ButtonWhite
            text={inBag ? "Remove from Bag" : "Add to Bag"}
            className={styles.bagButton}
            onClick={handleBagClick}
          />
        </div>
      </div>

      {recommendations.length > 0 ? (
        <section className={styles.recommendations} aria-label="Recommended products">
          <h2 className={styles.recommendationsTitle}>Also on the stall</h2>
          <div className={styles.recommendGrid}>
            {recommendations.map((item) => (
              <FruitItem key={item.id} fruit={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default FruitView;
