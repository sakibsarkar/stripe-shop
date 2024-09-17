import { stripe } from "../app";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Seller from "../models/seller.model";

export const createSeller = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;
  const newSeller = new Seller({ name, email, password });
  await newSeller.save();

  // Create Stripe Connect account for the seller
  const stripeAccount = await stripe.accounts.create({ type: "express" });
  newSeller.stripeAccountId = stripeAccount.id;
  await newSeller.save();

  res
    .status(201)
    .json({ message: "Seller created successfully", seller: newSeller });
});

// get seller total earnings
export const getSellerEarnings = catchAsyncError(async (req, res) => {
  const { id } = req.params; // Seller ID
  const seller = await Seller.findById(id);

  if (!seller || !seller.stripeAccountId) {
    return res.status(404).json({ message: "Seller not found" });
  }

  const balance = await stripe.balance.retrieve({
    stripeAccount: seller.stripeAccountId,
  });

  res.status(200).json({ earnings: balance });
});

// widraw money
export const withdrawFunds = catchAsyncError(async (req, res) => {
  const { amount } = req.body;
  const { id: sellerId } = req.params;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  // Find the seller by their ID
  const seller = await Seller.findById(sellerId);

  if (!seller || !seller.stripeAccountId) {
    return res.status(404).json({
      message: "Seller not found or no Stripe account linked",
      seller,
    });
  }

  // Create a payout to the seller's bank account
  const payout = await stripe.payouts.create(
    {
      amount: amount * 100, // Amount in cents
      currency: "usd",
    },
    {
      stripeAccount: seller.stripeAccountId, // Seller's connected Stripe account
    }
  );

  res.status(200).json({ message: "Payout initiated successfully", payout });
});

// Add payment method
export const addPaymentMethod = catchAsyncError(async (req, res) => {
  const { sellerId, bankAccount } = req.body;

  const seller = await Seller.findById(sellerId);

  if (!seller || !seller.stripeAccountId) {
    return res.status(404).json({ message: "Seller not found" });
  }

  const bankAccountAdded = await stripe.accounts.createExternalAccount(
    seller.stripeAccountId,
    { external_account: bankAccount }
  );

  res.status(201).json({ message: "Payment method added", bankAccountAdded });
});

// Delete payment method
export const deletePaymentMethod = catchAsyncError(async (req, res) => {
  const { sellerId, bankAccountId } = req.body;

  const seller = await Seller.findById(sellerId);

  if (!seller || !seller.stripeAccountId) {
    return res.status(404).json({ message: "Seller not found" });
  }

  await stripe.accounts.deleteExternalAccount(
    seller.stripeAccountId,
    bankAccountId
  );

  res.status(200).json({ message: "Payment method deleted" });
});

// Get all sellers
export const getAllSellers = catchAsyncError(async (req, res) => {
  const sellers = await Seller.find();
  res.status(200).json(sellers);
});

// Get a seller by ID
export const getSellerById = catchAsyncError(async (req, res) => {
  const { id } = req.params;

  const seller = await Seller.findById(id);
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }
  res.status(200).json(seller);
});

// Update a seller by ID
export const updateSeller = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const seller = await Seller.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }
  res.status(200).json(seller);
});

// Delete a seller by ID
export const deleteSeller = catchAsyncError(async (req, res) => {
  const { id } = req.params;

  const seller = await Seller.findByIdAndDelete(id);
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }
  res.status(200).json({ message: "Seller deleted successfully" });
});
