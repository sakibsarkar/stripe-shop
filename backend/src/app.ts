import cors from "cors";
import express, { Application } from "express";
import http from "http";
// import morgan from "morgan";
import connectDB from "./config/db";

import Stripe from "stripe";
import errorMiddleware from "./middlewares/error";
import { notFound } from "./middlewares/not-found";
import router from "./routes";
export const stripe = new Stripe(process.env.STRIPE_KEY as string);
const app: Application = express();

app.use(
  cors({
    origin: "*",
  })
);
// app.use(morgan("dev"));

connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.use("/api/v1/", router);

// Middleware for Errors
app.use(errorMiddleware);

//handle not found
app.use(notFound);

const port: any = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(
    `App is running on port: ${port}. Run with http://localhost:${port}`
  );
});
