import styles from "./CatalogSplash.module.css";

interface CatalogSplashProps {
  error?: string | null;
  onRetry?: () => void;
}

const CatalogSplash = ({ error, onRetry }: CatalogSplashProps) => {
  return (
    <div className={styles.splash}>
      <img src="/images/logo.png" alt="Freshy Fruity" className={styles.logo} />
      <h1>The stall couldn’t open.</h1>
      <p>{error}</p>
      {onRetry ? (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
};

export default CatalogSplash;
