import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHome, HomePage } from "../../api/client";
import { homepageMeta, useDocumentMeta } from "../../utils/documentMeta";
import styles from "./Home.module.css";
import HomeCarousel from "./HomeCarousel/HomeCarousel";

const HomeSkeleton = () => {
  return (
    <>
      <section className={`${styles.hero} ${styles.heroSkeleton}`} aria-busy="true" aria-label="Loading stall intro">
        <div className={styles.heroCopy}>
          <span className={`${styles.bone} ${styles.heroBoneEyebrow}`} />
          <span className={`${styles.bone} ${styles.heroBoneTitle}`} />
          <span className={`${styles.bone} ${styles.heroBoneLine}`} />
          <span className={`${styles.bone} ${styles.heroBoneLineShort}`} />
          <div className={styles.heroActions}>
            <span className={`${styles.bone} ${styles.heroBoneButton}`} />
            <span className={`${styles.bone} ${styles.heroBoneButtonGhost}`} />
          </div>
        </div>
        <div className={styles.heroArt}>
          <span className={`${styles.bone} ${styles.heroBoneLogo}`} />
        </div>
      </section>
    </>
  );
};

const Home = () => {
  const [page, setPage] = useState<HomePage | null>(null);
  const [loading, setLoading] = useState(true);
  useDocumentMeta(homepageMeta.title, homepageMeta.description, { canonicalPath: "/" });

  useEffect(() => {
    let cancelled = false;

    fetchHome().then((data) => {
      if (cancelled) return;
      setPage(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const hero = page?.hero;
  const values = page?.values ?? [];

  return (
    <div className={styles.home}>
      {loading ? <HomeSkeleton /> : null}

      {!loading && hero ? (
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
            <h1 className={styles.title}>{hero.title}</h1>
            <p className={styles.description}>{hero.description}</p>
            <div className={styles.heroActions}>
              <Link to={hero.primaryCta.to} className={styles.storeButton}>
                {hero.primaryCta.label}
              </Link>
              <Link to={hero.secondaryCta.to} className={styles.ghostButton}>
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>
          <div className={styles.heroArt}>
            <img src={hero.logoUrl} alt={hero.logoAlt} className={styles.heroLogo} sizes="100vw" />
            <p className={styles.heroStamp}>{hero.stamp}</p>
          </div>
        </section>
      ) : null}

      {!loading && values.length > 0 ? (
        <section className={styles.values}>
          {values.map((value) => (
            <article key={value.mark} className={styles.value}>
              <span className={styles.valueMark}>{value.mark}</span>
              <h2>{value.title}</h2>
              <p>{value.description}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className={styles.featured}>
        <div className={styles.featuredHead}>
          <p className={styles.eyebrow}>This week on the table</p>
          <h2>Featured produce</h2>
        </div>
        <HomeCarousel fruits={page?.featured ?? []} />
      </section>
    </div>
  );
};

export default Home;
