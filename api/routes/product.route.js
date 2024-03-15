import express from "express";
import { createProduct, deleteProduct } from "../controller/product.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createProduct);
router.delete("/delete/:id", verifyToken, deleteProduct);

export default router;