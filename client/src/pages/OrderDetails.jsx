import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

export default function OrderDetails() {
  const [orderData, setOrderData] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [step, setStep] = useState(null);
  const [orderDate, setOrderDate] = useState(null);
  const [progressHeight, setProgressHeight] = useState(0);
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/order/getOrder/${params.OrderId}`);
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
          return;
        }
        setOrderData(data);
        showDate(data.createdAt);
        setStep(data.step);
        setProgressHeight((data.step - 1) * 33.3);
        setLoading(false);
      } catch (error) {
        console.log(error.data);
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const handleSteps = async () => {
    if (step === 4) {
      setStep(4);
      setProgressHeight(100);
    } else {
      setStep(step + 1);
      setProgressHeight(step * 33.3);

      try {
        const res = await fetch(`/api/order/increaseStep/${params.OrderId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json();
        if (data.success === false) {
          console.log(data.error);
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  const handlePrevSteps = async () => {
    if (step === 1) {
      setStep(1);
      setProgressHeight(0);
    } else {
      setStep(step - 1);
      setProgressHeight(progressHeight - 33.3);

      try {
        const res = await fetch(`/api/order/decreaseStep/${params.OrderId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  const showDate = (date) => {
    const timestamp = new Date(date);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Kolkata'
    };
    setOrderDate(new Intl.DateTimeFormat('en-US', options).format(timestamp));
  };

  function addDaysToDate(dateString, daysToAdd) {
    const date = new Date(dateString);
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + daysToAdd);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    };
    return (new Intl.DateTimeFormat('en-US', options).format(newDate));
  };

  const handleCancleOrder = async () => {
    setStep(-1);
    setProgressHeight(100);
    try {
      const res = await fetch(`/api/order/cancleOrder/${params.OrderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setOrderData(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <main>
      {loading && (
        <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
          <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
        </div>
      )}
      {orderData && (
        <div className="px-16">
          <h1 className="text-2xl text-center font-semibold my-6">Order Details</h1>
          <Link to={`/product/${orderData.productId}`}>
            <div className="flex p-8">
              <div className="left w-[60%] py-4 px-10 border">
                <h1 className="text-2xl">{orderData.name}</h1>
                <h1 className="text-xl my-4 flex items-center gap-4 font-semibold">	&#8377;{(orderData.price).toLocaleString('US-en')} <span className="text-base font-semibold text-orange-500">%{orderData.discount} off</span></h1>
                <h1 className="font-semibold my-4">Payment : {orderData.paymentStatus}</h1>
                <ul>
                  <li>{orderData.address}</li>
                  <li>{orderData.city}, {orderData.state}</li>
                  <li>pincode: {orderData.pincode}</li>
                </ul>
                <h1 className="font-semibold my-3 text-red-700">Deliveried by : {orderData.delivaryDate}</h1>
              </div>
              <div className="right w-[40%] flex items-center border justify-center">
                <div className="w-52 h-52">
                  <img src={orderData.image} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </Link>

          <div className={`progress px-10 ${step === -1 ? 'h-40' : 'h-80'} flex flex-col justify-between relative z-10 mx-8`}>
            <div className={`absolute border ${step === -1 ? 'h-40 bg-red-600' : 'h-80 bg-gray-200'} w-[8px] top-0 left-[55px] `}>
              <div style={{ height: `${progressHeight}%` }} className={`progress w-full ${step === -1 ? 'bg-red-600' : 'bg-[#fbd616]'} transition-all duration-500`}></div>
            </div>
            <div className="flex gap-8 items-center relative z-20">
              <p id={1} className={`w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ${step === 1 || step > 1 ? 'bg-[#fbd616]' : 'bg-gray-300'}`}><FaRegCheckCircle className='text-2xl text-white' /></p>
              <div>
                <p className="font-semibold">Ordered</p>
                <p className="text-sm leading-3"> {orderDate}</p>
              </div>
            </div>
            {step !== -1 && (
              <div className="flex gap-8 items-center relative z-20">
                <p id={2} className={`w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ${step === 2 || step > 2 ? 'bg-[#fbd616]' : 'bg-gray-300'}`}><FaRegCheckCircle className='text-2xl text-white' /></p>
                <div>
                  <p className="font-semibold">Packed</p>
                  <p className="text-sm leading-3">Export by {addDaysToDate(orderData.createdAt, 2)}</p>
                </div>
              </div>
            )}
            {step !== -1 && (
              <div className="flex gap-8 items-center relative z-20">
                <p id={3} className={`w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ${step === 3 || step > 3 ? 'bg-[#fbd616]' : 'bg-gray-300'}`}><FaRegCheckCircle className='text-2xl text-white' /></p>
                <div>
                  <p className="font-semibold">Shipped</p>
                  <p className="text-sm leading-3">Export by {addDaysToDate(orderData.createdAt, 4)}</p>
                </div>
              </div>
            )}
            {step !== -1 && (
              <div className="flex gap-8 items-center relative z-20">
                <p id={4} className={`w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ${step === 4 ? 'bg-[#fbd616]' : 'bg-gray-300'}`}><FaRegCheckCircle className='text-2xl text-white' /></p>
                <div>
                  <p className="font-semibold">Delivery</p>
                  <p className="text-sm leading-3">Export by {orderData.delivaryDate}</p>
                </div>
              </div>
            )}
            {step === -1 && (
              <div className="flex gap-8 items-center relative z-20">
                <p id={4} className={`w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 bg-red-600`}><RxCrossCircled className='text-2xl text-white' /></p>
                <div>
                  <p className="font-semibold text-red-700">Cancle Order</p>
                  <p className="text-sm leading-3">Order was cancelled by the buyer</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-8 mt-10 ml-20 mb-6">
            <button onClick={handleCancleOrder} className="px-4 py-2 bg-[#52D3D8] rounded-md w-32">Cancel</button>
            <button className="px-4 py-2 bg-[#52D3D8] rounded-md w-32">Need help?</button>
          </div>
          {currentUser.admin === 'yes' && (
            <div className="flex justify-center gap-10 my-8 py-4">
              <button onClick={handleSteps} className="px-3 w-20 py-2 bg-orange-400 text-white rounded-md uppercase">next</button>
              <button onClick={handlePrevSteps} className="px-3 w-24 py-2 bg-red-500 text-white rounded-md uppercase">Previous</button>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
