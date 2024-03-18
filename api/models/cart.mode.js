import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    image: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 1
    }
},{timestamps: true});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;