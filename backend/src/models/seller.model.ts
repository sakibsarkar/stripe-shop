import { Schema, model } from "mongoose";

const sellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: "seller",
    },
    stripeAccountId: {
      type: String,
      default: "",
    },

    shopInfo: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Seller = model("Seller", sellerSchema);

export default Seller;
