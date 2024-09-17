import express from "express";
import {
  createPayment,
  createStripeConnectAccount,
  paymentRequestConfirm,
  transferAmmount,
} from "../controllers/stripe.controller";
const router = express.Router();

router.post("/create-stripe-connect-account", createStripeConnectAccount);
router.post("/create-payment", createPayment);

router.post("/payment-request-confirm", paymentRequestConfirm);
router.post("/transfer-ammount", transferAmmount);
const stripeRoutes = router;
export default stripeRoutes;
