import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    quantity: {
        type: Number,
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
    }
},{timestamps: true});

const Order = mongoose.model("Order", orderSchema);

export default Order;