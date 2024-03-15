import productModel from "../models/product.model.js";
import { errorHandle } from "../utils/error.js";

export const createProduct = async (req, res, next) => {
    try {
        const product = await productModel.create(req.body);
        return res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) return next(errorHandle(404, "Product not found"));

    if (req.user.id !== product.userRef) {
        return next(errorHandle(401, "You can only delete your own porducts"));
    }

    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json("product has been deleted");
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return next(errorHandle(404, 'Product not found!'));
    }
    if (req.user.id !== product.userRef) {
        return next(errorHandle(401, 'You can only update your own Product!'));
    }

    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (req, res, next) => {
    try{
        const product = await productModel.findById(req.params.id);
        if(!product) {
            return next(errorHandle(404, "Product not fonund"));
        }
        res.status(200).json(product);
    }catch(error){
        next(error);
    }
}