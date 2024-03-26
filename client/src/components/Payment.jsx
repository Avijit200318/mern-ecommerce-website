import React, { useState } from 'react'
import { CiCreditCard1 } from "react-icons/ci";

export default function Payment({ price, name }) {
  // const [productName , setProductName] = useState(name);
  // const [productPrice, setProductPrice] = useState(price);

  // console.log("name and price is ", data);

  const handlePayment = async () => {
    try {
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
      console.log(data);
      window.location.href = data.data.instrumentResponse.redirectInfo.url;
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='w-[60%]'>
      <button onClick={handlePayment} className='w-full bg-blue-500 text-white px-4 py-2 text-lg font-semibold'><CiCreditCard1 className='text-3xl inline-block' /> Check Out</button>
    </div>
  )
}
