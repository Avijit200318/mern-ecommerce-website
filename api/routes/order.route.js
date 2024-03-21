import express from "express";
import { createOrder } from "../controller/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, createOrder);

export default router;