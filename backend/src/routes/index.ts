import { Router } from "express";
import sellerRoutes from "./seller.route";
import stripeRoutes from "./stripe.route";

const router = Router();

const routes = [
  {
    path: "/seller",
    route: sellerRoutes,
  },
  {
    path: "/stripe",
    route: stripeRoutes,
  },
];

routes.forEach(({ path, route }) => router.use(path, route));
export default router;
