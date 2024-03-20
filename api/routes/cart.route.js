import express from "express";
import { addToCart, getCartItems, deleteCartItem } from "../controller/cart.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/getItems/:id", verifyToken, getCartItems);
router.delete("/delete/:id", verifyToken, deleteCartItem);

export default router;