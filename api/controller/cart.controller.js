import cartModel from "../models/cart.model.js"

export const addToCart = async (req, res, next) => {
    try{
        const cartItem = await cartModel.create(req.body);
        return res.status(200).json(cartItem);
    }catch(error){
        next(error);
    }
};