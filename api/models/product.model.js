import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
        require: true,
    },
    offer: {
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
    warranty: {
        type: String,
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
    },
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;