import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import NavbarLinks from "./NavbarLinks/NavbarLinks";
import NavbarSearch from "./NavbarSearch/NavbarSearch";
import NavbarFavorite from "./NavbarFavorite/NavbarFavorite";
import NavbarBag from "./NavbarBag/NavbarBag";

const Navbar = () => {
  const { pathname } = useLocation();
  const storeNav = pathname === "/store";

  return (
    <nav className={`${styles.navbar} ${storeNav ? styles.storeNav : ""}`}>
      <div className={styles.navbarLeft}>
        <Link to="/" className={styles.logo} aria-label="Freshy Fruity home">
          <img src="/images/logo-transparent.png" alt="" className={styles.logoMark} sizes="100vw" />
        </Link>
        <NavbarLinks />
      </div>
      <div className={styles.navbarRight}>
        <NavbarSearch />
        <div className={styles.rightIcons}>
          <NavbarFavorite />
          <NavbarBag />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
