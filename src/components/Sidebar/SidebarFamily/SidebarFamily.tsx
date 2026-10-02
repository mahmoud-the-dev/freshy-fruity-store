import { useState } from "react";
import { useStoreContext } from "../../../Context";
import styles from "./SidebarFamily.module.css";
import CheckIcon from "../../../icons/CheckIcon";
import ExpandIcon from "../../../icons/ExpandIcon";

const SidebarFamily = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { filters, setFilters } = useStoreContext();
  const { families } = filters;

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCheckboxClick = (index) => {
    const updatedFamilies = families.map((family, i) => ({
      ...family,
      isChecked: i === index ? !family.isChecked : false,
    }));

    setFilters({ ...filters, families: updatedFamilies });
  };

  const checkedCount = families.filter((family) => family.isChecked).length;

  return (
    <div className={styles.sidebarFamily}>
      <button type="button" className={styles.title} onClick={toggleNavbar} aria-expanded={isExpanded}>
        <h2>Family {checkedCount ? `(${checkedCount})` : ""}</h2>
        <ExpandIcon className={styles.expandIcon} isExpanded={isExpanded} />
      </button>
      <div className={`${styles.list} ${isExpanded ? styles.expanded : ""}`}>
        {families.map((family, index) => (
          <button
            type="button"
            key={family.name}
            className={styles.listItem}
            aria-pressed={family.isChecked}
            onClick={() => handleCheckboxClick(index)}>
            <span className={`${styles.checkbox} ${family.isChecked ? styles.checked : ""}`}>
              {family.isChecked && <CheckIcon className={styles.checkIcon} />}
            </span>
            <span className={styles.itemName}>{family.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarFamily;
