import  express from 'express';
import {payment} from "../controller/phonePay.controller.js";

const router = express.Router();


// Handle requests from the React frontend
router.post('/pay', payment);


export default router;
