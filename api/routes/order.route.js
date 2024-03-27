import express from "express";
import { createOrder, getOrder, addStep, decStep} from "../controller/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, createOrder);
router.get("/getOrder/:id", verifyToken, getOrder);
router.post("/increaseStep/:id", verifyToken, addStep);
router.post("/decreaseStep/:id", verifyToken, decStep);

export default router;