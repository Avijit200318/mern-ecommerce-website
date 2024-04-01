import express from "express";
import { createOrder, getOrder, addStep, decStep, getUserOrders, cancleOrder, removeOrder, allOrders} from "../controller/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, createOrder);
router.get("/getOrder/:id", verifyToken, getOrder);
router.post("/increaseStep/:id", verifyToken, addStep);
router.post("/decreaseStep/:id", verifyToken, decStep);
router.post("/cancleOrder/:id", verifyToken, cancleOrder);
router.get("/getUserOrders/:id", verifyToken, getUserOrders);
router.delete("/removeOrder/:id", verifyToken, removeOrder);
router.get("/allOrders", verifyToken, allOrders);

export default router;