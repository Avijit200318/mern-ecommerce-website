import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaRegCheckCircle } from "react-icons/fa";

export default function OrderDetails() {
  const [orderData, setOrderData] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  console.log(orderData);
  // console.log(currentUser);
  const params = useParams();
  const [step, setStep] = useState(null);
  const [orderDate, setOrderDate] = useState(null);
  const [progressHeight, setProgressHeight] = useState(0);
  console.log(step);
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const res = await fetch(`/api/order/getOrder/${params.OrderId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setOrderData(data);
        showDate(data.createdAt);
        setStep(data.step);
        setProgressHeight((data.step -1)* 33.3);
      } catch (error) {
        console.log(error.data);
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

  const handlePrevSteps = async() => {
    if (step === 1) {
      setStep(1);
      setProgressHeight(0);
    } else {
      setStep(step - 1);
      setProgressHeight(progressHeight - 33.3);

      try{
        const res = await fetch(`/api/order/decreaseStep/${params.OrderId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if(data.success === false){
          console.log(data.message);
          return;
        }
      }catch(error){
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
      timeZone: 'UTC'
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
      timeZone: 'UTC'
    };
    return (new Intl.DateTimeFormat('en-US', options).format(newDate));
  }

  return (
    <main>
      {orderData && (
        <div className="px-16">
          <h1 className="text-2xl text-center font-semibold my-6">Order Details</h1>
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
              <div className="w-44 h-44">
                <img src={orderData.image} alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          <div className="progress px-10 h-80 flex flex-col justify-between relative z-10 mx-8">
            <div className="absolute border h-80 w-[8px] top-0 left-[55px] bg-gray-200">
              <div style={{ height: `${progressHeight}%` }} className="progress w-full bg-[#fbd616] transition-all duration-500"></div>
            </div>
            <div className="flex gap-8 items-center relative z-20">
              <p id={1} className={`w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ${step === 1 || step > 1 ? 'bg-[#fbd616]' : 'bg-gray-300'}`}><FaRegCheckCircle className='text-2xl text-white' /></p>
              <div>
                <p className="font-semibold">Ordered</p>
                <p className="text-sm leading-3"> {orderDate}</p>
              </div>
            </div>
            <div className="flex gap-8 items-center relative z-20">
              <p id={2} className={`w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ${step === 2 || step > 2 ? 'bg-[#fbd616]' : 'bg-gray-300'}`}><FaRegCheckCircle className='text-2xl text-white' /></p>
              <div>
                <p className="font-semibold">Packed</p>
                <p className="text-sm leading-3">Export by {addDaysToDate(orderData.createdAt, 2)}</p>
              </div>
            </div>
            <div className="flex gap-8 items-center relative z-20">
              <p id={3} className={`w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ${step === 3 || step > 3 ? 'bg-[#fbd616]' : 'bg-gray-300'}`}><FaRegCheckCircle className='text-2xl text-white' /></p>
              <div>
                <p className="font-semibold">Shipped</p>
                <p className="text-sm leading-3">Export by {addDaysToDate(orderData.createdAt, 4)}</p>
              </div>
            </div>
            <div className="flex gap-8 items-center relative z-20">
              <p id={4} className={`w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ${step === 4 ? 'bg-[#fbd616]' : 'bg-gray-300'}`}><FaRegCheckCircle className='text-2xl text-white' /></p>
              <div>
                <p className="font-semibold">Delivery</p>
                <p className="text-sm leading-3">Export by {orderData.delivaryDate}</p>
              </div>
            </div>
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
