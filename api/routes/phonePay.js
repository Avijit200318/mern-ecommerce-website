import  express from 'express';
import {payment, payRedirect} from "../controller/phonePay.controller.js";

const router = express.Router();


// Handle requests from the React frontend
router.post('/pay', payment);
router.post("/redirect", payRedirect);


export default router;
