import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    discount: {
        type: Number,
        require: true
    },
    rating: {
        type: String,
    },
    quantity: {
        type: Number,
        require: true
    },
    paymentMethod: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending'
    },
    address: {
        type: String,
    },
    delivaryDate: {
        type: String,
    },
    userRef: {
        type: String,
    },
    productId: {
        type: String,
    }
},{timestamps: true});

const Order = mongoose.model("Order", orderSchema);

export default Order;