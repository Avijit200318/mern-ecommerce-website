import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Order() {

  const [orders, setOrders] = useState(null);
  console.log(orders);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/order/getUserOrders/${currentUser._id}`);
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
    }

    fetchOrderData();
  }, []);

  return (
    <div>
      {loading && (
        <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
          <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
        </div>
      )}
      {(!loading && orders) && (
        <div className="flex py-4 px-8 gap-4 items-start bg-[#f1f3f6] min-h-[90vh]">
          <div className="left bg-white w-[60%] flex flex-col gap-4 p-4 shadow-xl">
            {orders.map((product, index) =>
              <div key={index} className="product p-4 flex gap-4 bg-white ">
                <div className="">
                  <Link to="">
                    <div className="img w-36 h-36">
                      <img src={product.image} alt="" className="w-full h-full object-contain" />
                    </div>
                  </Link>
                  {/* <div className="flex justify-center gap-2 items-center">
                    <button onClick={() => handleQuantityDecrease(product.price, product.discount, product._id, product.quantity)} className='text-3xl'><CiSquareMinus /></button>
                    <h1 id='quantity' className="border border-black w-8 text-center my-2">{product.quantity}</h1>
                    <button onClick={() => handleQuantityIncrease(product.price, product.discount, product._id)} className='text-3xl'><CiSquarePlus /></button>
                  </div> */}
                  {/* {decreaseError && <p className='absolute text-red-600 font-semibold'>{decreaseError}</p>} */}
                </div>
                <div className="info py-2 px-4">
                  <Link to="">
                    <h1 className="text-xl">{product.name}</h1>
                    <h1 className="text-lg font-semibold"><span className='text-sm line-through text-gray-400 mr-2'>&#8377;{product.price}</span> &#8377; <span className='text-sm text-orange-500 mx-2'>{product.discount}% off</span></h1>
                    <h1 className="text-sm">Delivery by  | <span className="">{product.delivaryFee ? 'Delivery Charge ₹40' : 'FREE Delivery'}</span></h1>
                  </Link>

                  <button onClick={() => handleCartItemDelete(product._id)} className='bg-red-600 text-white py-1 px-2 rounded mt-4 transition-all duration-300 hover:bg-red-500'>REMOVE</button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  )
}
