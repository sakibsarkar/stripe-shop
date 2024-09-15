import axios from "axios";
import { useEffect, useState } from "react";

function SellerOnboarding() {
  const [sellers, setSellers] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState("");
  const [onboardingUrl, setOnboardingUrl] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/seller/sellers"
        );
        setSellers(response.data);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    fetchSellers();
  }, []);

  // Handle creating the Stripe Connect account
  const handleOnboard = async (e) => {
    e.preventDefault();
    if (!selectedSellerId) {
      console.log("Please select a seller.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/stripe/create-stripe-connect-account",
        { id: selectedSellerId }
      );
      setOnboardingUrl(response.data.url);
    } catch (error) {
      console.error("Error during seller onboarding:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Seller Onboarding
      </h2>
      <form onSubmit={handleOnboard} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Select Seller</label>
          <select
            value={selectedSellerId}
            onChange={(e) => setSelectedSellerId(e.target.value)} // Set the selected seller ID
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Select Seller --</option>
            {sellers.map((seller) => (
              <option key={seller._id} value={seller._id}>
                {seller._id} - {seller.name || "Unnamed Seller"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Onboard Seller
        </button>
      </form>

      {onboardingUrl && (
        <div className="mt-4">
          <a
            href={onboardingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Complete Onboarding
          </a>
        </div>
      )}
    </div>
  );
}

export default SellerOnboarding;
