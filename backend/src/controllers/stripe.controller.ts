import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import StripeAccount from "../models/stripe.model";
const { STRIPE_KEY } = process.env;
const stripe = new Stripe(STRIPE_KEY!, {
  apiVersion: "2024-06-20",
});

export const createStripeConnectAccount = catchAsyncError(async (req, res) => {
  const { id } = req.body;
  console.log("Seller ID:", id);

  if (!id) {
    return res.status(400).json({ message: "Seller ID is required" });
  }

  const uid = uuidv4();

  const stripeInfo = await StripeAccount.findOne({ sellerId: id });

  if (stripeInfo) {
    console.log("Stripe info found, deleting...");
    await StripeAccount.deleteOne({ sellerId: id });
  }

  const account = await stripe.accounts.create({ type: "express" });
  console.log("Stripe account created:", account.id);

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "http://localhost:5173/refresh",
    return_url: `http://localhost:5173/success?activeCode=${uid}`,
    type: "account_onboarding",
  });
  console.log("Stripe account link created:", accountLink.url);

  await StripeAccount.create({
    sellerId: id,
    connectId: account.id,
    code: uid,
  });

  res.status(201).json({ url: accountLink.url });
});

export const createPayment = catchAsyncError(async (req, res) => {
  const price = 500;
  console.log("price", price);

  if (price <= 0) {
    return res
      .status(400)
      .json({ message: "Price must be greater than zero." });
  }

  const payment = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.status(200).json({ clientSecret: payment.client_secret });
});

export const paymentRequestConfirm = catchAsyncError(async (req, res) => {
  const { connectId, amount } = req.body;

  try {
    await stripe.transfers.create({
      amount: amount * 100,
      currency: "usd",
      destination: connectId,
    });

    res.status(200).json({ message: "Request confirmed successfully" });
  } catch (error) {
    console.error("Error confirming payment request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
