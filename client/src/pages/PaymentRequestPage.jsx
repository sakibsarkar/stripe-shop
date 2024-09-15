import { useState } from 'react';
import axios from 'axios';

const PaymentRequestPage = () => {
    const [amount, setAmount] = useState('');
    const [connectId, setConnectId] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/stripe/payment-request-confirm', {
                connectId,
                amount
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error: ' + error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center mb-6">Payment Request</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount (USD):</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="connectId" className="block text-sm font-medium text-gray-700 mb-2">Stripe Connect ID:</label>
                    <input
                        type="text"
                        id="connectId"
                        value={connectId}
                        onChange={(e) => setConnectId(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 rounded-md text-white ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} transition`}
                >
                    {isLoading ? 'Processing...' : 'Submit Request'}
                </button>
                {message && <div className="text-center text-red-500 mt-4">{message}</div>}
            </form>
        </div>
    );
};

export default PaymentRequestPage;
