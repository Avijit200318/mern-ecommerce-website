import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUserSuccess, updateUserFailure, updateUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import Footer from '../components/Footer';

export default function Order() {

  const [orders, setOrders] = useState(null);
  // console.log(orders);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

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

  const handleOrderItemDelete = async(orderId) => {
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/order/removeOrder/${orderId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setOrders((prev)=> prev.filter((order)=> order._id !== orderId));
    }catch(error){
      console.log(error.message);
      dispatch(updateUserFailure(error.message));
    }
  }

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
        <div className="flex py-4 px-8 gap-4 items-start bg-[#f1f3f6] min-h-[90vh]">
          <div className="left bg-white w-full flex flex-col gap-4 p-4 shadow-xl">
            {orders.map((product, index) =>
              <div key={index} className="product p-4 flex gap-4 bg-white ">
                <div className="">
                  <Link to={`/orderDetails/${product._id}`}>
                    <div className="img w-36 h-36">
                      <img src={product.image} alt="" className="w-full h-full object-contain" />
                    </div>
                  </Link>
                </div>
                <div className="info py-2 px-4">
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
                  <div className="flex items-center justify-between w-60">
                    {product.step === 4 && (
                      <h1 className="font-semibold text-[#fbd616]">Completed</h1>
                    )}
                    {(product.step !==4 && product.step !== -1) && (
                      <h1 className="font-semibold text-green-500">Pending</h1>
                    )}
                    {product.step === -1 && (
                      <h1 className="font-semibold text-red-700">Cancled</h1>
                    )}
                    {(product.step === -1 || product.step === 4) && (
                      <button onClick={() => handleOrderItemDelete(product._id)} className='bg-blue-300 text-white py-1 px-2 rounded transition-all duration-300 hover:bg-blue-500'>REMOVE</button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
      {(orders && orders.length !== 0) && (
        <Footer />
      )}
    </div>
  )
}
