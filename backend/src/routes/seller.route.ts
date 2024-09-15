import express from "express";
import {
  createSeller,
  deleteSeller,
  getAllSellers,
  getSellerById,
  updateSeller,
} from "../controllers/seller.controller";

const router = express.Router();

router.post("/sellers", createSeller);

router.get("/sellers", getAllSellers);

router.get("/sellers/:id", getSellerById);

router.put("/sellers/:id", updateSeller);

router.delete("/sellers/:id", deleteSeller);

const sellerRoutes = router

export default sellerRoutes;
