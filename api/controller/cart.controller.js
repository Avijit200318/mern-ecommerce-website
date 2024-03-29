import cartModel from "../models/cart.model.js"
import userModel from "../models/user.model.js";
import { errorHandle } from "../utils/error.js";

export const addToCart = async (req, res, next) => {
    try{
        const user = await userModel.findById(req.body.userRef);
        if(user.cart.indexOf(req.body.productId) !== -1) {
            return next(errorHandle(401, "Item is already present in the cart"));
        }
        const cartItem = await cartModel.create(req.body);
        user.cart.push(req.body.productId);
        await user.save();
        // return res.status(200).json(cartItem);
        // at first I saw the created item data. but to initalize cart I send user updated data.
        return res.status(200).json(user);
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
};

export const deleteCartItem = async (req, res, next) => {
    const cartItem = await cartModel.findById(req.params.id);
    if(!cartItem) return next(errorHandle(401, "cart Item not found"));
    
    if(req.user.id !== cartItem.userRef) return next(errorHandle(401, "You can only delete your own cart items"));

    const user = await userModel.findById(cartItem.userRef);

    try{
        await cartModel.findByIdAndDelete(req.params.id);
        user.cart.splice(user.cart.indexOf(cartItem.productId), 1);
        await user.save();
        // return res.status(200).json("cart Item delete successfully");
        return res.status(200).json(user);
    }catch(error){
        next(error);
    }
};

export const increaseQuantity = async(req, res, next) => {
    const cartItem = await cartModel.findById(req.params.id);
    if(!cartItem) return next(errorHandle(401, "cart Item not found"));
    
    if(req.user.id !== cartItem.userRef) return next(errorHandle(401, "You can only update your own cart items"));

    try{
        const updateCartItem = await cartModel.findByIdAndUpdate(
            req.params.id,
            { $inc: { quantity: 1 } },
            {new: true}
        );
        const updatedCartData = await cartModel.find({userRef: cartItem.userRef})
        res.status(200).json(updatedCartData);
    }catch(error){
        next(error);
    }
};

export const decreaseQuantity = async(req, res, next) => {
    const cartItem = await cartModel.findById(req.params.id);
    if(!cartItem) return next(errorHandle(401, "cart Item not found"));
    
    if(req.user.id !== cartItem.userRef) return next(errorHandle(401, "You can only update your own cart items"));

    try{
        if(cartItem.quantity === 1){
            return next(errorHandle(401, "The quantity of the item always greater than 0"));
        }else{
            const updateCartItem = await cartModel.findByIdAndUpdate(
                req.params.id,
                { $inc: { quantity: -1 } },
                {new: true}
            );
            const updatedCartData = await cartModel.find({userRef: cartItem.userRef})
            res.status(200).json(updatedCartData);
        };
    }catch(error){
        next(error);
    }
}