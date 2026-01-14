import { checkoutBag } from "../api/client";
import { Fruits } from "../data/types";

async function showCheckoutMessage(fruitsInBag: Fruits): Promise<void> {
  if (fruitsInBag.length === 0) {
    alert("Your bag is empty. Add something ripe from the stall before checking out.");
    return;
  }

  try {
    const result = await checkoutBag(fruitsInBag);
    alert(result.message);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout didn’t go through. Try again in a moment.";
    alert(message);
  }
}

export default showCheckoutMessage;
