import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getAuth } from "firebase/auth";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY_LIVE);

function CheckoutForm({ amount }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: amount, userId: user.uid }),
        }
      );
      const data = await response.json();

      console.log("Frontend received:", data);

      if (!data.session.id) {
        console.error("Unexpected API response:", data);
        return;
      }

      const sessionId = data.session.id;

      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
    } catch (e) {
      console.error("Stripe error", e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={!stripe}
        style={{
          padding: " 10px 20px",
          borderRadius: "50px",
          background: "#007BFF",
          color: "#FFF",
          border: "none",
          fontSize: "28px",
        }}
      >
        Go to Checkout
      </button>
    </form>
  );
}

export default function Checkout({ amount }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
}
