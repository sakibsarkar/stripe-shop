import { v4 as uuidv4 } from "uuid";
import { stripe } from "../app";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Seller from "../models/seller.model";
import StripeAccount from "../models/stripe.model";

export const createStripeConnectAccount = catchAsyncError(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Seller ID is required" });
  }

  const uid = uuidv4();

  // Check if the seller already has a Stripe account
  const stripeInfo = await StripeAccount.findOne({ sellerId: id });

  if (stripeInfo) {
    await StripeAccount.deleteOne({ sellerId: id });
  }

  // Create a new Stripe Connect account with necessary capabilities
  const account = await stripe.accounts.create({
    type: "express",
    capabilities: {
      transfers: { requested: true }, // Request the transfers capability
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "http://localhost:5173/refresh",
    return_url: `http://localhost:5173/success?activeCode=${uid}`,
    type: "account_onboarding",
  });

  // Save Stripe account info in the database
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

// transfer ammmount to the sller account
export const transferAmmount = catchAsyncError(async (req, res) => {
  const { sellerId, amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  // Find the seller by their ID
  const seller = await Seller.findById(sellerId);

  if (!seller || !seller.stripeAccountId) {
    return res
      .status(404)
      .json({ message: "Seller not found or no Stripe account linked" });
  }

  // Create a transfer to the seller's Stripe Connect account
  const transfer = await stripe.transfers.create({
    amount: amount * 100, // Amount in cents
    currency: "usd",
    destination: seller.stripeAccountId, // Seller's connected Stripe account
  });

  res
    .status(200)
    .json({ message: "Amount added to seller's Stripe account", transfer });
});
