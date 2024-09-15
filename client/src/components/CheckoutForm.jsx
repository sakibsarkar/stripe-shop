/* eslint-disable react/prop-types */
import { PaymentElement, LinkAuthenticationElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

const CheckoutForm = ({ orderId }) => {
    // Save orderId to localStorage
    localStorage.setItem('orderId', orderId);

    const stripe = useStripe(); // Hook to access Stripe object
    const elements = useElements(); // Hook to access Elements wrapper
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const paymentElementOptions = {
        loyout: 'tabs', // Options for displaying payment options
    };

    const submit = async (e) => {
        e.preventDefault();

        // Ensure Stripe and Elements are loaded
        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true); // Disable button while processing payment

        // Confirm payment using Stripe
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:5173/order-success',
            },
        });

        // Handle errors
        if (error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message);
        } else {
            setMessage('An unexpected error occurred'); 
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={submit} id="payment-form">
            <LinkAuthenticationElement id="link-authentication-element" />
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit" className="px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white">
                <span id="button-text">
                    {isLoading ? <div>Loading.....</div> : 'Pay now'}
                </span>
            </button>
            {message && <div>{message}</div>} {/* Display error or success message */}
        </form>
    );
};

export default CheckoutForm;
