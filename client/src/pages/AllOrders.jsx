import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';


export default function AllOrders() {
    const [orders, setOrders] = useState(null);
    console.log(orders);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        window.scroll(0, 0);
        const fetchAllOrders = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/order/allOrders");
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message);
                    setLoading(false);
                    return;
                }
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
                setLoading(false);
            }
        };

        fetchAllOrders();
    }, [])

    return (
        <div>
            {loading && (
                <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
                    <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
                </div>
            )}
            {(orders && orders.length === 0) && (
                <h1 className="text-2xl font-semibold my-4 pl-16">No order has been found</h1>
            )}
            {(!loading && orders) && (
                <div className="">
                    <h1 className="my-4 text-2xl font-semibold text-center">Orders from All Users</h1>
                    <div className="flex py-4 gap-4 items-start bg-[#f1f3f6] min-h-[90vh]  sm:px-8 md:px-4 lg:px-8">
                        <div className="left bg-white w-full flex flex-col gap-1 py-4 shadow-xl sm:px-4 sm:gap-4">
                            {orders.map((product, index) =>
                                <div key={index} className="product px-2 py-4 flex gap-4 bg-white sm:px-4">
                                    <div className="">
                                        <Link to={`/orderDetails/${product._id}`}>
                                            <div className="img w-24 h-24 sm:w-36 sm:h-36">
                                                <img src={product.image} alt="" className="w-full h-full object-contain" />
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="info py-2 px-2 sm:px-4">
                                        <Link to={`/orderDetails/${product._id}`}>
                                            <h1 className="text-xl">{product.name}</h1>
                                            <h1 className="text-lg font-semibold">&#8377;{(product.price).toLocaleString('US-en')} <span className='text-sm text-orange-500 mx-2'>{product.discount}% off</span></h1>
                                            <ul className='text-sm flex flex-col gap-1'>
                                                <li className="">{product.address}</li>
                                                <li className="">{product.state} | {product.city}</li>
                                                <li className="">Pincode : {product.pincode}</li>
                                            </ul>
                                            <h1 className="text-sm my-2">Delivery by <span className="font-semibold">{product.delivaryDate}</span></h1>
                                        </Link>
                                        <div className="fflex items-center justify-between w-48 sm:w-60">
                                            {product.step === 4 && (
                                                <h1 className="font-semibold text-[#fbd616]">Completed</h1>
                                            )}
                                            {(product.step !== 4 && product.step !== -1) && (
                                                <h1 className="font-semibold text-green-500">Pending</h1>
                                            )}
                                            {product.step === -1 && (
                                                <h1 className="font-semibold text-red-700">Cancled</h1>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                    <Footer />
                </div>
            )}
        </div>
    )
}
