import express from "express";
import { createProduct, deleteProduct, updateProduct, getProduct } from "../controller/product.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createProduct);
router.delete("/delete/:id", verifyToken, deleteProduct);
router.post("/update/:id", verifyToken, updateProduct);
router.get("/getProduct/:id", getProduct);

export default router;