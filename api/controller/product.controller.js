import productModel from "../models/product.model.js";
export const createProduct = async (req, res, next) => {
    try{
        const product = await productModel.create(req.body);
        return res.status(201).json(product);
    }catch(error){
        next(error);
    }
}
