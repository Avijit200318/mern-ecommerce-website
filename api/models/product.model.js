import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
        require: true,
    },
    discount: {
        type: Number,
    },
    price: {
        type: Number,
        require: true,
    },
    image: {
        type: Array,
        require: true,
    },
    color: {
        type: Array,
        require: true,
    },
    userRef: {
        type: String,
        required: true,
    },
    ram: {
        type: String,
    },
    storage: {
        type: String,
    },
    camera: {
        type: String,
    },
    battery: {
        type: String,
    },
    processor: {
        type: String,
    },
    waranty: {
        type: String,
        require: true,
    },
    delivaryFee: {
        type: Boolean,
    },
    seller: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    rating: {
        type: String,
        default: 0.0
    }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;