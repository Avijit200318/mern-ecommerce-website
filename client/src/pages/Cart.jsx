import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { CiSquareMinus } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";

export default function Cart() {
  const { currentUser } = useSelector((state) => state.user);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(cartData);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [totalPrice, setTotalPrice]  = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalDelivaryCharge, setTotalDelivaryCharge] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/cart/getItems/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          setLoading(false);
          return;
        }
        setCartData(data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  useState(() => {
    const handleDelivaryDate = () => {
      const today = new Date();

      // Create a new date object for 7 days from today
      const after7Days = new Date(today);
      after7Days.setDate(after7Days.getDate() + 7);

      // Format the date
      const formattedDate = after7Days.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
      setDeliveryDate(formattedDate);
    };

    handleDelivaryDate();
  }, []);


useEffect(() => {
  const calculateTotals = () => {
    let sum = 0, discount = 0, delivary = 0;
    for (let i = 0; i < cartData.length; i++) {
      sum += cartData[i].price;
      discount += cartData[i].price * cartData[i].discount / 100;
      if(cartData[i].deliveryFee){
        delivary += 1;
      }
    }
    setTotalPrice(sum);
    setTotalDiscount(Math.round(discount));
    setTotalDelivaryCharge(delivary * 40);
  };

  calculateTotals(); // Call the function initially to set totals

  // Dependency array: Re-run the effect whenever cartData changes
  return () => calculateTotals();
}, [cartData]);




  return (
    <main>
      {loading && (
        <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
          <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
        </div>
      )}
      {(cartData && !loading) && (
        <div className="flex py-4 px-8 gap-4 items-start bg-[#f1f3f6]">
          <div className="left bg-white border border-black w-[60%] flex flex-col gap-4 p-4">
            {cartData.map((product, index) =>
              <div key={index} className="product p-4 flex gap-4 bg-white border border-black">
                <div className="">
                  <div className="img w-36 h-36 border border-black">
                    <img src={product.image} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <button className='text-3xl'><CiSquareMinus /></button>
                    <h1 className="border border-black w-8 text-center my-2">1</h1>
                    <button className='text-3xl'><CiSquarePlus /></button>
                  </div>
                </div>
                <div className="info py-2 px-4 border border-black">
                  <h1 className="text-xl">{product.name}</h1>
                  <h1 className="text-lg font-semibold"><span className='text-sm line-through text-gray-400 mr-2'>&#8377;{product.price}</span> &#8377;{Math.round((product.price - (product.price * product.discount / 100))).toLocaleString('en-US')} <span className='text-sm text-orange-500 mx-2'>{product.discount}% off</span></h1>
                  <h1 className="text-sm">Delivery by {deliveryDate} | <span className="">{product.deliveryFee ? 'Delivery Charge ₹40' : 'FREE Delivery'}</span></h1>

                  <button className='bg-red-600 text-white py-1 px-2 rounded mt-4'>REMOVE</button>
                </div>
              </div>
            )}
          </div>
          <div className="right py-4 w-[25%] border bg-white border-black flex flex-col fixed right-[14%]">
            <h1 className="text-xl font-semibold border-b-2 py-3 text-center">Product Details</h1>
            <div className="p-4 text-lg flex flex-col gap-4 border">
              <div className="flex justify-between"><h1>Price ({cartData.length} itmes)</h1> <h1>&#8377;{(totalPrice.toLocaleString('en-US'))}</h1></div>
              <div className="flex justify-between"><h1>Discount</h1> <h1 className='text-orange-400 font-semibold'>- &#8377;{(totalDiscount).toLocaleString('en-US')}</h1></div>
              <div className="flex justify-between"><h1>Delivery Charge</h1> <h1>{totalDelivaryCharge === 0 ? <span className='uppercase text-orange-400'>free</span> : <span>{totalDelivaryCharge}</span>}</h1></div>
            </div>
            <h1 className="p-4 text-lg font-semibold border-b-2 flex justify-between"> <h1>Totoal Amount</h1> <h1>&#8377;{(totalPrice - totalDiscount).toLocaleString('en-US')}</h1></h1>
            <div className="p-4 text-base font-semibold text-orange-400 flex justify-between"><h1>Total amount you save</h1> <h1>&#8377;{(totalDiscount).toLocaleString('en-US')}</h1></div>
            <button className="w-[80%] mx-auto mt-2 py-2 text-base font-semibold text-white bg-orange-400 transition-all duration-300 hover:bg-orange-500">Place Order</button>
          </div>
        </div>
      )}
    </main>
  )
}
