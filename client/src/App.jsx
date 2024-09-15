import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SellerOnboarding from './pages/SellerOnboarding';
import OrderPlace from './pages/OrderPlace';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentRequestPage from './pages/PaymentRequestPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Stripe Connect App</h1>
        <div className="px-[40px] py-[20px] flex gap-[20px]">
            <a className='px-[20px] py-[10px] bg-red-300' href="/order">Order Page</a>
            <a className='px-[20px] py-[10px] bg-red-300' href="/onboard-seller">Seller Onboarding</a>
            <a className='px-[20px] py-[10px] bg-red-300' href="/payment-request">Payout</a>
        </div>
        <Routes>
          <Route path="/order" element={<OrderPlace />} />
          <Route path="/onboard-seller" element={<SellerOnboarding />} />
          <Route path="/order-success" element={<PaymentSuccess />} />
          <Route path="/payment-request" element={<PaymentRequestPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
