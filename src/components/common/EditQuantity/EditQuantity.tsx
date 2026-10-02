import { useStoreContext } from "../../../Context";
import styles from "./EditQuantity.module.css";
import MinusIcon from "../../../icons/MinusIcon";
import PlusIcon from "../../../icons/PlusIcon";

const EditQuantity = ({ fruit }) => {
  const { setFruits } = useStoreContext();
  const { quantity, id } = fruit;

  const handleMinusClick = () => {
    const newQuantity = Math.max(quantity - 1, 1);

    setFruits((prevFruits) =>
      prevFruits.map((f) => (f.id === id ? { ...f, quantity: newQuantity } : f))
    );
  };

  const handlePlusClick = () => {
    const newQuantity = quantity + 1;

    setFruits((prevFruits) =>
      prevFruits.map((f) => (f.id === id ? { ...f, quantity: newQuantity } : f))
    );
  };

  return (
    <div className={styles.editQuantity}>
      <button type="button" className={styles.editButton} aria-label="Decrease quantity" onClick={handleMinusClick}>
        <MinusIcon className={styles.icon} />
      </button>
      <div className={styles.number}>{quantity}</div>
      <button type="button" className={styles.editButton} aria-label="Increase quantity" onClick={handlePlusClick}>
        <PlusIcon className={styles.icon} />
      </button>
    </div>
  );
};

export default EditQuantity;
