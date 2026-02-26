import styles from "./ExpressDelivery.module.css";
import TimerIcon from "../../../icons/TimerIcon";

interface Props {
  variant?: "ticket" | "chip" | "stamp";
}

const ExpressDelivery = ({ variant = "ticket" }: Props) => {
  if (variant === "chip") {
    return (
      <span className={styles.chip}>
        <TimerIcon className={styles.chipIcon} />
        15 min
      </span>
    );
  }

  if (variant === "stamp") {
    return (
      <span className={styles.stamp} aria-hidden="true">
        <span className={styles.stampEyebrow}>Rush</span>
        <span className={styles.stampTime}>15 min</span>
      </span>
    );
  }

  return (
    <aside className={styles.ticket} aria-label="15-minute delivery">
      <div className={styles.dial} aria-hidden="true">
        <span className={styles.ring} />
        <span className={styles.minutes}>15</span>
        <span className={styles.minLabel}>min</span>
      </div>
      <div className={styles.copy}>
        <p className={styles.headline}>15-minute delivery</p>
        <p className={styles.detail}>At your door before the kettle boils.</p>
      </div>
    </aside>
  );
};

export default ExpressDelivery;
