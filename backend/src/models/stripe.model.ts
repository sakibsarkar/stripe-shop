import { Schema, model } from "mongoose";

const stripeSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    connectId: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StripeAccount = model("StripeAccount", stripeSchema);

export default StripeAccount;
