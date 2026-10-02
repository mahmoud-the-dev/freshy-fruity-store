import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import { notFoundMeta, useDocumentMeta } from "../../utils/documentMeta";

const ErrorPage = () => {
  useDocumentMeta(notFoundMeta.title, notFoundMeta.description, { robots: "noindex,nofollow" });

  return (
    <div className={styles.errorPage}>
      <img src="/images/optimized/logo.webp" alt="Freshy Fruity" className={styles.logo} width="192" height="48" />
      <h1>This aisle doesn’t exist.</h1>
      <div className={styles.errorBody}>
        <h2>404 — we looked behind the citrus crates and found nothing.</h2>
        <Link to="/" className={styles.homeLink}>
          Walk back to the stall
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
