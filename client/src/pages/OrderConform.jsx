import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Payment from '../components/Payment';
import CardImg from '../../public/images/card.png';

export default function OrderConform() {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // console.log(productData);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // console.log(currentUser);
  const [orderData, setOrederData] = useState({
    buyerName: '',
    pincode: '',
    state: '',
    city: '',
    paymentStatus: 'COD',
    address: currentUser.address,
    contact: currentUser.contact,
    delivaryDate: '',
  });
  console.log(orderData);
  const [error, setError] = useState(null);
  const [orderLoading, setOrderLoading] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  // console.log("delivery charge ", deliveryCharge);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/getProduct/${params.productId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.success);
          setLoading(false);
          return;
        }
        setProductData(data);
        if (data.delivaryFee) {
          setDeliveryCharge(40);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(true);
      }
    };

    fetchProductData();
  }, []);

  const handleChange = (e) => {
    setOrederData({ ...orderData, [e.target.id]: e.target.value })
  }

  // add delivery date.
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
      setOrederData({ ...orderData, delivaryDate: formattedDate });
    };

    handleDelivaryDate();
  }, []);

  const handleOrderSubmit = async () => {
    if (orderData.buyerName === '' || orderData.pincode === '' || orderData.state === '' || orderData.city === '') {
      setError("Invalid user details");
      return;
    }
    try {
      setOrderLoading(true);
      setError(null);
      const res = await fetch("/api/order/add", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          price: Math.round(productData.price - (productData.price * productData.discount / 100)) + deliveryCharge,
          discount: productData.discount,
          name: productData.name,
          userRef: currentUser._id,
          productId: params.productId,
          image: productData.image[0],
        })
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setOrderLoading(false);
        return;
      }
      console.log("order is added");
      navigate(`/orderDetails/${data._id}`);
      setOrderLoading(false);
    } catch (error) {
      setError(error.message);
      setOrderLoading(false);
    }
  }

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

  const handleCardPayOrder = async () => {
    if (orderData.buyerName === '' || orderData.pincode === '' || orderData.state === '' || orderData.city === '') {
      setError("Invalid user details");
      return;
    }
    try {
      setOrderLoading(true);
      setError(null);
      const res = await fetch("/api/order/add", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          price: Math.round(productData.price - Math.round(productData.price * productData.discount / 100)) + deliveryCharge,
          discount: productData.discount,
          name: productData.name,
          userRef: currentUser._id,
          productId: params.productId,
          image: productData.image[0],
        })
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setOrderLoading(false);
        return;
      }
      console.log("order is added");
      setOrderLoading(false);
    } catch (error) {
      setError(error.message);
      setOrderLoading(false);
    }
  };

  const handlePaymentChange = (e) => {
    setOrederData({...orderData, paymentStatus: e.target.id})
  }

  return (
    <main>
      {loading && (
        <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
          <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
        </div>
      )}
      {productData && (
        <div className="flex py-4 px-8 gap-4 items-start bg-[#f1f3f6] min-h-[90vh]">
          <div className="left bg-white w-[60%] flex flex-col gap-4 py-6 px-4 shadow-xl">
            <h1 className="text-center text-2xl font-semibold">Check Details</h1>
            <div className="box flex justify-center">
              <form className='flex flex-col gap-2 border-gray-400 border-2 p-8 w-[70%] rounded-lg'>
                <div className="flex flex-col gap-2">
                  <label className='text-lg font-semibold'>Shipping Address</label>
                  <textarea name="" id="address" cols="30" placeholder='Address' defaultValue={orderData.address} onChange={handleChange} required className='border border-black rounded-lg px-4 py-2' autoComplete='off'></textarea>
                </div>
                <div className="">
                  <h1 className="mb-2 font-semibold mx-1">Name</h1>
                  <input type="text" placeholder='Name' id='buyerName' defaultValue={orderData.name} onChange={handleChange} className='border border-black px-4 py-3 rounded-lg w-full' autoComplete='off' />
                </div>
                <div className="">
                  <h1 className="mb-2 font-semibold mx-1">Contact</h1>
                  <input type="number" placeholder='Contact' id='contact' defaultValue={orderData.contact} onChange={handleChange} className='border border-black px-4 py-3 rounded-lg w-full' autoComplete='off' />
                </div>
                <div className="">
                  <h1 className="mb-2 font-semibold mx-1">Pincode</h1>
                  <input type="text" placeholder='pincode' id='pincode' defaultValue={orderData.pincode} onChange={handleChange} className='border border-black px-4 py-3 rounded-lg w-full' autoComplete='off' />
                </div>
                <div className="">
                  <h1 className="mb-2 font-semibold mx-1">City</h1>
                  <input type="text" placeholder='City' id='city' defaultValue={orderData.city} onChange={handleChange} className="border border-black px-4 py-3 rounded-lg w-full" autoComplete='off' />
                </div>
                <div className="">
                  <h1 className="mb-2 font-semibold mx-1">State</h1>
                  <input type="text" placeholder='State' id="state" defaultValue={orderData.state} onChange={handleChange} className="border border-black px-4 py-3 rounded-lg w-full" autoComplete='off' />
                </div>
              </form>
            </div>
            <div className="">
              <h1 className="text-2xl text-center border-t-2 border-b-2 border-gray-500 font-semibold py-2 my-4">Payment Method</h1>
              <div className="w-[70%] mx-auto flex flex-col gap-4 items-center my-8 border border-gray-600 py-6 rounded-lg">
                <h3 className="w-[60%] px-2 font-semibold">Select your payment method*</h3>
                <div className='border border-gray-500 px-4 py-3 text-lg font-semibold w-[60%] rounded-md'>
                  <label htmlFor='COD' className="w-full flex gap-4">
                    <input onChange={handlePaymentChange} type="radio" checked={orderData.paymentStatus === 'COD'} name="method" id='COD' value="cod" />
                    <span>Cash On Delivary</span>
                  </label>
                </div>
                <div className='border border-gray-500 px-4 py-3 text-lg font-semibold w-[60%] rounded-md flex'>
                  <label htmlFor='complete' className="w-full flex gap-4">
                    <input onChange={handlePaymentChange} type="radio" checked={orderData.paymentStatus === 'complete'} name="method" id='complete' value="cod" />
                    <span>Credit Card / Debit Card</span>
                  </label>
                  <img src={CardImg} alt="" className="h-6" />
                </div>
                
                {orderData.paymentStatus === 'complete' && (
                  <Payment price={Math.round((productData.price - Math.round(productData.price * productData.discount / 100)) + deliveryCharge)} name={productData.name} handleCardPayOrder={handleCardPayOrder} orderData={orderData} />
                )}
              </div>
            </div>
          </div>
          <div className={`right py-4 w-[25%] bg-white flex flex-col  shadow-md transition-all duration-400 ${isScrolled ? 'top-[15px] fixed right-[14.5%]' : ''}`}>
            <h1 className="text-xl font-semibold border-b-2 py-3 text-center">Order Details</h1>
            <div className="p-4 text-lg flex flex-col gap-4 border">
              <div className="flex justify-between"><h1>Price </h1> <h1>&#8377;{productData.price.toLocaleString('en-US')}</h1></div>
              <div className="flex justify-between"><h1>Discount</h1> <h1 className='text-orange-400 font-semibold'>- &#8377;{Math.round(productData.price * productData.discount / 100).toLocaleString('en-US')}</h1></div>
              <div className="flex justify-between">
                <h1 className="">Delivery Charge</h1>
                {productData.delivaryFee ? <h1>&#8377;40</h1> : <h1 className='text-orange-400 uppercase'>free</h1>}
              </div>
            </div>
            <div className="p-4 text-lg font-semibold border-b-2 flex justify-between"> <h1>Totoal Amount</h1> <h1>&#8377;{Math.round((productData.price - Math.round(productData.price * productData.discount / 100)) + deliveryCharge).toLocaleString('en-US')}</h1></div>
            <div className="p-4 text-base font-semibold text-orange-400 flex justify-between"><h1>Total amount you save</h1> <h1>&#8377;{Math.round(productData.price * productData.discount / 100).toLocaleString('en-US')}</h1></div>
            <button onClick={handleOrderSubmit} className="w-[80%] mx-auto mt-2 py-2 text-base font-semibold text-white bg-orange-400 transition-all duration-300 hover:bg-orange-500">{orderLoading ? 'loading...' : 'Place Order'}</button>
            {error && <p className='text-red-600 text-md font-semibold text-center relative top-1'>{error}</p>}
          </div>
        </div>
      )}
    </main>
  )
}
