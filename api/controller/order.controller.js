import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import { errorHandle } from "../utils/error.js";

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
};

export const getOrder = async(req, res, next) => {
    try{
        const orderData = await orderModel.findById(req.params.id);
        if(!orderData) return next(errorHandle(401, "Order not found"));
        return res.status(200).json(orderData);
    }catch(error){
        next(error);
    }
};

export const addStep = async(req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if(!order) return next(errorHandle(401, "Order not found"));

    try{
        const updateOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            {$inc: {step: 1}},
            {new: true}
        );
        return res.status(200).json(updateOrder);
    }catch(error){
        next(error);
    }
};

export const decStep = async(req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if(!order) return next(errorHandle(401, "Order not found"));

    try{
        const updateOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            {$inc: {step: -1}},
            {new: true}
        );
        return res.status(200).json(updateOrder);
    }catch(error){
        next(error);
    }
};

export const cancleOrder = async(req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if(!order) return next(errorHandle(401, "Order not found"));
    try{
        const updateOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            {step: -1, status: "cancle"},
            {new: true}
        );
        return res.status(200).json(updateOrder);
    }catch(error){
        next(error);
    }
}

export const getUserOrders= async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandle(401, "You can only check your own orders"));
    try{
        const allOrders = await orderModel.find({userRef: req.params.id});
        return res.status(200).json(allOrders);
    }catch(error){
        next(error);
    }
}