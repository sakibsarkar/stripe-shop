import catchAsyncError from "../middlewares/catchAsyncErrors";
import Seller from "../models/seller.model";

// Example function
export const createSeller = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;
  const newSeller = new Seller({ name, email, password });
  await newSeller.save();
  res
    .status(201)
    .json({ message: "Seller created successfully", seller: newSeller });
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
