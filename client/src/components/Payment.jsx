import React, { useState } from 'react'
import { CiCreditCard1 } from "react-icons/ci";

export default function Payment({ price, name, handleCardPayOrder, orderData }) {
  // const [productName , setProductName] = useState(name);
  // const [productPrice, setProductPrice] = useState(price);
  const [error, setError] = useState(null);

  // console.log("name and price is ", data);

  const handlePayment = async () => {
    if (orderData.buyerName === '' || orderData.pincode === '' || orderData.state === '' || orderData.city === '') {
      setError("Invalid User Info | check user address");
      return;
    }else{
      try {
        setError(null);
        const res = await fetch("/api/payment/pay", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name, price: price })
        });
        const data = await res.json();
        if (data.success !== true) {
          console.log(data.message);
          return;
        }
        // console.log(data);
        await handleCardPayOrder();
        window.location.href = data.data.instrumentResponse.redirectInfo.url;
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className='w-[60%]'>
      <button onClick={handlePayment} className='w-full bg-blue-500 text-white px-4 py-2 text-lg font-semibold rounded-md'><CiCreditCard1 className='text-3xl inline-block' /> Check Out</button>
      {error && <p className='my-2 text-red-600 font-semibold text-base'>{error}</p>}
    </div>
  )
}
