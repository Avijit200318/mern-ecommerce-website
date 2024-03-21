import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";

export const createOrder = async (req, res, next) => {
    try{
        const orderItem = await orderModel.create(req.body);
        const user = await userModel.findById(req.body.userRef);
        user.order.push(orderItem._id);
        await user.save();
        return res.status(200).json(orderItem);
    }catch(error){
        next(error);
    }
}