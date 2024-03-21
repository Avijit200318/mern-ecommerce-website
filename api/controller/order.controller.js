import orderModel from "../models/order.model.js";

export const createOrder = async (req, res, next) => {
    try{
        const orderItem = await orderModel.create(req.body);
        return res.status(200).json(orderItem);
    }catch(error){
        next(error);
    }
}