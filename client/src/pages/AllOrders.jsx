import React, { useState } from 'react'

export default function AllOrders() {
    const [orders, setOrders] = useState(null);
    // console.log(orders);
    const [loading, setLoading] = useState(false);

    return (
        <div>this is all orders page for admin </div>
    )
}
