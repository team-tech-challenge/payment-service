import express from "express";
import { paymentRoute } from "@routes/PaymentRoute";

export const apiRoutes = express.Router();

apiRoutes.use("/payment", paymentRoute);

