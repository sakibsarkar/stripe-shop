/* eslint-disable no-unused-vars */
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useState } from "react";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51M6dkEJWinS7Eh9sq689UH5gTFlymxnICtZNkQkhsBVt1RCCgZLdZERSgLl5rZCcDZcDBBz14p3bbVRTaw6EBIyo00j3Q1cBpn"
);

const OrderPlace = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [price, setPrice] = useState(500); // Ensure this is the correct price
  const [orderId] = useState(""); // Set this as needed

  const createPayment = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/stripe/create-payment", // Ensure the URL is correct
        { price }
        // { withCredentials: true }
      );
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(
        "Error creating payment:",
        error.response?.data || error.message
      );
    }
  };

  const options = {
    clientSecret,
  };

  return (
    <div className="mx-[200px]">
      <h2 className="text-violet-400 font-bold text-2xl">Order Page</h2>
      <div className="mt-4">
        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        ) : (
          <button
            onClick={createPayment}
            className="px-10 py-2 rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-green-500 text-white"
          >
            Start Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderPlace;
