import express from "express";
import { addToCart } from "../controller/cart.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);

export default router;