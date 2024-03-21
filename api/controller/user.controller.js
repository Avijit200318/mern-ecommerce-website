import bcryptjs from "bcryptjs";
import { errorHandle } from "../utils/error.js";
import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandle(401, 'You can only update your own account!'));

    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await userModel.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
                address: req.body.address,
                contact: req.body.contact,
            }
        }, {new: true});

        const {password: pass, ...rest} = updateUser._doc;
        res.status(200).json(rest);

    }catch(error){
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandle(401, "You can only delete your own account"));
    try{
        await productModel.deleteMany({userRef: req.params.id});
        await userModel.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("user has been deleted");
    }catch(error){
        next(error);
    }
};

export const userProducts = async(req, res, next) => {
    if(req.user.id === req.params.id){
        try{
            const products = await productModel.find({userRef: req.params.id});
            res.status(200).json(products);
        }catch(error){
            next(error);
        }
    }else{
        return next(errorHandle(401, "You can only see your own products!"));
    }
}