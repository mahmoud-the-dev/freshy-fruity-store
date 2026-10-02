import { useState } from "react";
import { useStoreContext } from "../../../Context";
import styles from "./SidebarColor.module.css";
import CheckIcon from "../../../icons/CheckIcon";
import ExpandIcon from "../../../icons/ExpandIcon";

const SidebarColor = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { filters, setFilters } = useStoreContext();
  const { colors } = filters;

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCheckboxClick = (index) => {
    const updatedColors = [...colors];
    updatedColors[index].isChecked = !updatedColors[index].isChecked;

    setFilters({ ...filters, colors: updatedColors });
  };

  const checkedCount = colors.filter((color) => color.isChecked).length;

  return (
    <div className={styles.sidebarColor}>
      <button type="button" className={styles.title} onClick={toggleNavbar} aria-expanded={isExpanded}>
        <h2>Color {checkedCount ? `(${checkedCount})` : ""}</h2>
        <ExpandIcon className={styles.expandIcon} isExpanded={isExpanded} />
      </button>

      <div className={`${styles.grid} ${isExpanded && styles.expanded}`}>
        {colors.map((color, index) => (
          <button
            type="button"
            key={color.name}
            className={`${styles.gridItem} ${color.isChecked ? styles.clicked : ""}`}
            aria-pressed={color.isChecked}
            onClick={() => handleCheckboxClick(index)}>
            <div className={`${styles.checkbox} ${styles[color.name]}`}>
              {color.isChecked && <CheckIcon className={styles.checkIcon} />}
            </div>
            <span className={styles.itemName}>{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarColor;
