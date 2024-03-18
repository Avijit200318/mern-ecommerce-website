import cartModel from "../models/cart.model.js"
import userModel from "../models/user.model.js";
import { errorHandle } from "../utils/error.js";

export const addToCart = async (req, res, next) => {
    try{
        const user = await userModel.findById(req.body.userRef);
        if(user.cart.indexOf(req.body.productId !== -1)) {
            return next(errorHandle(401, "Item is already present in the cart"));
        }
        const cartItem = await cartModel.create(req.body);
        user.cart.push(req.body.productId);
        await user.save();
        return res.status(200).json(cartItem);
    }catch(error){
        next(error);
    }
};

export const getCartItems = async (req, res, next) => {
    if(req.user.id === req.params.id){
        try{
            const cartItems = await cartModel.find({userRef: req.params.id});
            return res.status(200).json(cartItems);
        }catch(error){
            next(error);
        }
    }else{
        return next(errorHandle(401, "You can check only your cart items"));
    }
}