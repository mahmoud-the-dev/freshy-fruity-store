import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/images/logo-transparent.png" alt="Freshy Fruity" className={styles.logo} />
          <p className={styles.tagline}>
            Sun-ripened produce from nearby farms, packed like a neighborhood stall — not a warehouse aisle.
          </p>
        </div>

        <div className={styles.column}>
          <h2>Market</h2>
          <p>412 Orchard Lane</p>
          <p>Riverside District</p>
          <p>Mon–Sat 7:00–19:00</p>
          <p>Sunday 8:00–15:00</p>
        </div>

        <div className={styles.column}>
          <h2>Visit &amp; order</h2>
          <p>
            <a href="mailto:hello@freshyfruity.market">hello@freshyfruity.market</a>
          </p>
          <p>
            <a href="tel:+15550148820">(555) 014-8820</a>
          </p>
          <Link to="/store">Shop the stall</Link>
          <Link to="/bag">Your bag</Link>
        </div>

        <div className={styles.column}>
          <h2>Socials</h2>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer">
            Pinterest
          </a>
        </div>
      </div>

      <p className={styles.copy}>© {new Date().getFullYear()} Freshy Fruity. Picked today, packed with care.</p>
    </footer>
  );
};

export default Footer;
