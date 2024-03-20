import express from "express";
import { addToCart, getCartItems, deleteCartItem, increaseQuantity, decreaseQuantity } from "../controller/cart.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/getItems/:id", verifyToken, getCartItems);
router.delete("/delete/:id", verifyToken, deleteCartItem);
router.post("/increaseQuantity/:id", verifyToken, increaseQuantity);
router.post("/decreaseQuantity/:id", verifyToken, decreaseQuantity);

export default router;