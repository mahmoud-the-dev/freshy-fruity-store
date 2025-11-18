import { useEffect, useState } from "react";
import { useStoreContext } from "../../../Context";
import { useNavigate } from "react-router-dom";
import styles from "./NavbarSearch.module.css";
import SearchIcon from "../../../icons/SearchIcon";

const NavbarSearch = () => {
  const { filters, setFilters } = useStoreContext();
  const { query } = filters;
  const navigate = useNavigate();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 540px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const handleChange = (event) => {
    const newQuery = event.target.value;
    setFilters({ ...filters, query: newQuery });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/store");
  };

  return (
    <form className={styles.navbarSearch} onSubmit={handleSubmit}>
      <SearchIcon className={styles.searchIcon} />
      <input
        className={styles.searchInput}
        type="text"
        size={1}
        placeholder={compact ? "Search" : "Search produce"}
        aria-label="Search produce"
        value={query}
        onChange={handleChange}
      />
    </form>
  );
};

export default NavbarSearch;
