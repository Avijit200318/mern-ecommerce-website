import express from "express";
import { addToCart, getCartItems } from "../controller/cart.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/getItems/:id", verifyToken, getCartItems);

export default router;