import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { updateUserSuccess, updateUserFailure, updateUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

import { CiSquareMinus } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";

export default function Cart() {
  const { currentUser } = useSelector((state) => state.user);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(cartData);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalDelivaryCharge, setTotalDelivaryCharge] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [decreaseError, setDecreaseError] = useState(null);

  const dispatch = useDispatch();

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
        sum += cartData[i].price * cartData[i].quantity;
        discount += cartData[i].price * cartData[i].discount * cartData[i].quantity / 100;
        cartData[i].delivaryFee ? delivary += 40 : delivary += 0;
      }
      setTotalPrice(sum);
      setTotalDiscount(Math.round(discount));
      setTotalDelivaryCharge(delivary);
    };

    calculateTotals(); // Call the function initially to set totals

    // Dependency array: Re-run the effect whenever cartData changes
    return () => calculateTotals();
  }, [cartData]);

  const handleQuantityIncrease = async (productPrice, productDiscount, productId) => {
    const discount = Math.round(productDiscount * productPrice / 100);
    setTotalPrice(totalPrice + productPrice);
    setTotalDiscount(totalDiscount + discount);

    try {
      const res = await fetch(`/api/cart/increaseQuantity/${productId}`, {
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
      setCartData(data);
      console.log("increased quantity");
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleQuantityDecrease = async (productPrice, productDiscount, productId, productQuantity) => {

    if(productQuantity === 1){
      return handleCartItemDelete(productId);
    }
      const discount = Math.round(productDiscount * productPrice / 100);
      setTotalPrice(totalPrice - productPrice);
      setTotalDiscount(totalDiscount - discount);

    try {
      setDecreaseError(null);
      const res = await fetch(`/api/cart/decreaseQuantity/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setDecreaseError(data.message);
        return;
      }
      setCartData(data);
      console.log("decrease quantity");
    } catch (error) {
      setDecreaseError(error.message);
    }
  }

  const handleCartItemDelete = async (cartItemId) => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/cart/delete/${cartItemId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        dispatch(updateUserFailure(data.message));
        return;
      }
      // console.log("this is the data ",data);
      dispatch(updateUserSuccess(data));
      setCartData((prev) => prev.filter((product) => product._id !== cartItemId));
    } catch (error) {
      console.log(error.message);
      dispatch(updateUserFailure(error.message));
    }
  };

  // useEffect for the right side box position fixed after some scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 40); // 1rem = 16px
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (decreaseError) {
      const timer = setTimeout(() => {
        setDecreaseError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [decreaseError]);

  return (
    <main>
      {loading && (
        <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
          <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
        </div>
      )}
      {cartData.length === 0 && (
        <h1 className="text-2xl font-semibold my-4 pl-16">Your Cart is Empty...</h1>
      )}
      {(cartData.length > 0 && !loading) && (
        <div className="flex py-4 px-8 gap-4 items-start bg-[#f1f3f6] min-h-[90vh]">
          <div className="left bg-white w-[60%] flex flex-col gap-4 p-4 shadow-xl">
            {cartData.map((product, index) =>
              <div key={index} className="product p-4 flex gap-4 bg-white ">
                <div className="">
                  <div className="img w-36 h-36">
                    <img src={product.image} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex justify-center gap-2 items-center">
                    <button onClick={() => handleQuantityDecrease(product.price, product.discount, product._id, product.quantity)} className='text-3xl'><CiSquareMinus /></button>
                    <h1 id='quantity' className="border border-black w-8 text-center my-2">{product.quantity}</h1>
                    <button onClick={() => handleQuantityIncrease(product.price, product.discount, product._id)} className='text-3xl'><CiSquarePlus /></button>
                  </div>
                  {decreaseError && <p className='absolute text-red-600 font-semibold'>{decreaseError}</p>}
                </div>
                <div className="info py-2 px-4">
                  <h1 className="text-xl">{product.name}</h1>
                  <h1 className="text-lg font-semibold"><span className='text-sm line-through text-gray-400 mr-2'>&#8377;{product.price}</span> &#8377;{Math.round((product.price - (product.price * product.discount / 100))).toLocaleString('en-US')} <span className='text-sm text-orange-500 mx-2'>{product.discount}% off</span></h1>
                  <h1 className="text-sm">Delivery by {deliveryDate} | <span className="">{product.deliveryFee ? 'Delivery Charge ₹40' : 'FREE Delivery'}</span></h1>

                  <button onClick={() => handleCartItemDelete(product._id)} className='bg-red-600 text-white py-1 px-2 rounded mt-4 transition-all duration-300 hover:bg-red-500'>REMOVE</button>
                </div>
              </div>
            )}
          </div>
          <div className={`right py-4 w-[25%] bg-white flex flex-col  shadow-md transition-all duration-400 ${isScrolled ? 'top-[15px] fixed right-[14.5%]' : ''}`}>
            <h1 className="text-xl font-semibold border-b-2 py-3 text-center">Product Details</h1>
            <div className="p-4 text-lg flex flex-col gap-4 border">
              <div className="flex justify-between"><h1>Price ({cartData.length} itmes)</h1> <h1>&#8377;{(totalPrice.toLocaleString('en-US'))}</h1></div>
              <div className="flex justify-between"><h1>Discount</h1> <h1 className='text-orange-400 font-semibold'>- &#8377;{(totalDiscount).toLocaleString('en-US')}</h1></div>
              <div className="flex justify-between"><h1>Delivery Charge</h1> <h1>{totalDelivaryCharge === 0 ? <span className='uppercase text-orange-400'>free</span> : <span className=''>&#8377;{totalDelivaryCharge}</span>}</h1></div>
            </div>
            <div className="p-4 text-lg font-semibold border-b-2 flex justify-between"> <h1>Totoal Amount</h1> <h1>&#8377;{(totalPrice - totalDiscount + totalDelivaryCharge).toLocaleString('en-US')}</h1></div>
            <div className="p-4 text-base font-semibold text-orange-400 flex justify-between"><h1>Total amount you save</h1> <h1>&#8377;{(totalDiscount).toLocaleString('en-US')}</h1></div>
            <button className="w-[80%] mx-auto mt-2 py-2 text-base font-semibold text-white bg-orange-400 transition-all duration-300 hover:bg-orange-500">Place Order</button>
          </div>
        </div>
      )}
    </main>
  )
}
