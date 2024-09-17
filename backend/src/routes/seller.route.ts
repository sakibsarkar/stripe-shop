import express from "express";
import {
  addPaymentMethod,
  createSeller,
  deletePaymentMethod,
  deleteSeller,
  getAllSellers,
  getSellerById,
  getSellerEarnings,
  updateSeller,
  withdrawFunds,
} from "../controllers/seller.controller";

const router = express.Router();

router.post("/sellers", createSeller);

router.get("/sellers", getAllSellers);

router.get("/sellers/:id", getSellerById);

router.put("/sellers/:id", updateSeller);

router.delete("/sellers/:id", deleteSeller);

router.post("/sellers/:id/earnings", getSellerEarnings);

router.post("/sellers/:id/withdraw", withdrawFunds);

router.post("/sellers/:id/payment-method", addPaymentMethod);

router.delete("/sellers/:id/payment-method", deletePaymentMethod);
const sellerRoutes = router;

export default sellerRoutes;
