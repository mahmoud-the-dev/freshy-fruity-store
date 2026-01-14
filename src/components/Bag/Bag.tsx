import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStoreContext } from "../../Context";
import styles from "./Bag.module.css";
import { checkoutBag } from "../../api/client";
import { formatMoney } from "../../utils/formatPrice";
import BagFruit from "./BagFruit/BagFruit";
import ButtonBlue from "../common/ButtonBlue/ButtonBlue";
import ButtonBack from "../common/ButtonBack/ButtonBack";

type CheckoutState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; orderId: string; message: string }
  | { status: "error"; message: string };

const Bag = () => {
  const navigate = useNavigate();
  const { fruits, setFruits } = useStoreContext();
  const [checkout, setCheckout] = useState<CheckoutState>({ status: "idle" });

  const fruitsInBag = fruits.filter((fruit) => fruit.inBag);
  const itemCount = fruitsInBag.reduce((total, fruit) => total + fruit.quantity, 0);
  const subtotal = fruitsInBag.reduce((total, fruit) => total + fruit.price * fruit.quantity, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  useEffect(() => {
    if (checkout.status === "success" && fruitsInBag.length > 0) {
      setCheckout({ status: "idle" });
    }
  }, [checkout.status, fruitsInBag.length]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCheckoutClick = async () => {
    if (fruitsInBag.length === 0 || checkout.status === "submitting") {
      return;
    }

    setCheckout({ status: "submitting" });

    try {
      const result = await checkoutBag(fruitsInBag);
      setFruits((prev) => prev.map((fruit) => ({ ...fruit, inBag: false, quantity: 1 })));
      setCheckout({
        status: "success",
        orderId: result.orderId ?? "",
        message: result.message,
      });
    } catch (error) {
      setCheckout({
        status: "error",
        message: error instanceof Error ? error.message : "Checkout didn't go through. Try again in a moment.",
      });
    }
  };

  const buttonText =
    checkout.status === "submitting" ? "Placing order..." : fruitsInBag.length === 0 ? "Bag is empty" : "Place market order";

  return (
    <div className={styles.bag}>
      <ButtonBack className={styles.buttonBack} onClick={handleGoBack} />

      <h2>Your market bag</h2>

      <div className={styles.main}>
        <ul className={styles.leftContainer}>
          {fruitsInBag.length > 0 ? (
            fruitsInBag.map((fruit) => <BagFruit key={fruit.id} fruit={fruit} />)
          ) : (
            <li className={styles.emptyBag}>
              <strong>Your bag is empty.</strong>
              <span>Fill it with what's ripe on the stall — berries, citrus, and today's avocados.</span>
              <Link to="/store" className={styles.browseLink}>
                Browse the stall
              </Link>
            </li>
          )}
        </ul>

        <div className={styles.rightContainer}>
          <div className={styles.checkout}>
            <h2>Order summary</h2>
            <div className={styles.subtotal}>
              <div className={styles.subtotalName}>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
              </div>
              <div className={styles.subtotalPrice}>{formatMoney(subtotal)}</div>
            </div>
            <div className={styles.vat}>
              <div className={styles.vatName}>VAT (20%)</div>
              <div className={styles.vatPrice}>{formatMoney(vat)}</div>
            </div>
            <hr />
            <div className={styles.total}>
              <h2>Total</h2>
              <h2>{formatMoney(total)}</h2>
            </div>

            {checkout.status === "success" && (
              <div className={`${styles.status} ${styles.success}`} role="status">
                <strong>Checkout will be coming soon.</strong>
              </div>
            )}

            {checkout.status === "error" && (
              <div className={`${styles.status} ${styles.error}`} role="alert">
                {checkout.message}
              </div>
            )}

            <ButtonBlue
              className={styles.checkoutButton}
              text={buttonText}
              disabled={fruitsInBag.length === 0 || checkout.status === "submitting"}
              onClick={() => {
                void handleCheckoutClick();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bag;