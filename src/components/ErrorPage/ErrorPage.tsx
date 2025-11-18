import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  return (
    <div className={styles.errorPage}>
      <img src="/images/logo.png" alt="Freshy Fruity" className={styles.logo} />
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
