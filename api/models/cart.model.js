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
    },
    userRef: {
        type: String,
    },
    productId: {
        type: String,
        require: true
    },
    discount: {
        type: String,
    },
    delivaryFee: {
        type: Boolean,
    }
},{timestamps: true});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;