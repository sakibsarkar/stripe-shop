import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";
import { stripe } from "../app";
import User from "../models/user.model";

export const validSubscriptionHolder = (
  requiredPlan: string
): RequestHandler => {
  return async (req: any, res, next) => {
    const authId = (req.user as JwtPayload).id;

    try {
      const user = await User.findOne({ auth: authId }).populate({
        path: "subscription",
        populate: {
          path: "plan",
          model: "Plan",
        },
      });

      if (!user || !user.subscription) {
        return res.status(403).json({ message: "Subscription required" });
      }
      const userSubscription: any = user.subscription;

      if (user.isTrial && userSubscription.currentCredit >= 1) {
        req.subscription = userSubscription;
        console.log("heasfdas");

        return next();
      }

      const subscriptionId = userSubscription.stripeSubscriptionId || "";

      // Check if subscription is active and matches the required plan
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (
        subscription.status === "active" &&
        userSubscription.plan.name === requiredPlan &&
        userSubscription.currentCredit >= 1
      ) {
        console.log("hello");

        req.subscription = userSubscription;
        return next();
      }

      return res
        .status(403)
        .json({ message: "Access denied. Upgrade your subscription." });
    } catch (error) {
      console.error("Error checking subscription:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
