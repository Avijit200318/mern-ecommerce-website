import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    buyerName: {
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
    image: {
        type: String,
    },
    rating: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 1,
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
    },
    pincode: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    }
},{timestamps: true});

const Order = mongoose.model("Order", orderSchema);

export default Order;