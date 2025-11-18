import { MouseEvent } from "react";
import styles from "./ButtonBlue.module.css";

interface Props {
  className?: string;
  text?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const ButtonBlue = ({ className = "", text = "Checkout", onClick, disabled = false }: Props) => {
  return (
    <button type="button" className={`${styles.buttonBlue} ${className}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default ButtonBlue;