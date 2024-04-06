import React, { useEffect, useState, useSyncExternalStore } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { updateUserStart, updateUserFailure, updateUserSuccess } from '../redux/user/userSlice';
import Footer from '../components/Footer';

// icons
import { IoCart } from "react-icons/io5";
import { IoIosGift } from "react-icons/io";
import { FiTag } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import CircularProgressBar from '../components/CircularProgressBar';
import LineProgressBar from '../components/LineProgressBar';
import StarRating from '../components/StarRating';
import { FaTruckFast } from "react-icons/fa6";


export default function Product() {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [delivaryDate, setDeliveryDate] = useState(null);
  // console.log(product);
  // console.log(delivaryDate);
  const [showImage, setShowImage] = useState(null);
  // console.log(showImage);
  const [imageIndex, setImageIndex] = useState(0);
  const [colorImageIndex, setColorImageIndex] = useState(0);
  const [cartItemError, setCartItemError] = useState(null);
  const [cartBtnLoading, setCartBtnLoading] = useState(false);
  const [similarProduct, setSimilarProduct] = useState(null);
  console.log(similarProduct);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/product/getProduct/${params.productId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setProduct(data);
        setShowImage(data.image[0]);
        fetchSimilarProduct(data.type);
      } catch (error) {
        setError(true);
        setLoading(true);
      }
    };

    fetchProductData();

    const fetchSimilarProduct = async (type) => {
        try {
          const res = await fetch(`/api/product/search?type=${type}&limit=8`);
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            setLoading(false);
            return;
          }
          setSimilarProduct(data);
          setLoading(false);
        } catch (error) {
          console.log(error.message);
          setLoading(false);
        }
    };

  }, [params.productId]);

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

  const handelMouseEnter = (url, index) => {
    setShowImage(url);
    if (index === 0) {
      setImageIndex(0);
      setColorImageIndex(0);
    }
    setImageIndex(index);
  };

  const handleImageClick = (url, index) => {
    setShowImage(url);
    setColorImageIndex(index + 1);
    setImageIndex(0);
  };

  const handleaddToCart = async () => {
    if (!currentUser) {
      navigate("/sign-up");
    }
    try {
      dispatch(updateUserStart());
      setCartBtnLoading(true);
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          discount: product.discount,
          image: product.image[0],
          userRef: currentUser._id,
          productId: params.productId,
          delivaryFee: product.delivaryFee,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setCartItemError(data.message);
        setCartBtnLoading(false);
        return;
      }
      console.log("item is added to the cart");
      // console.log(data);
      dispatch(updateUserSuccess(data));
      setCartBtnLoading(false);
    } catch (error) {
      setCartItemError(error);
      setCartBtnLoading(false);
    }
  };

  useEffect(() => {
    if (cartItemError) {
      const timer = setTimeout(() => {
        setCartItemError(null);
      }, 3000); // 5000 milliseconds = 5 seconds

      return () => clearTimeout(timer);
    }
  }, [cartItemError]);

  return (
    <main>
      {loading && (
        <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff] z-50">
          <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
        </div>
      )}
      {(!loading && product) && (
        <div className="w-full py-10 px-16 flex gap-4">
          <div className="left w-[35%] relative">
            <div id='left' className="flex gap-2">
              <div className="colum flex flex-col  bg-white ">
                {product.image.length > 0 && product.image.map((url, index) =>
                  <div key={url} className={`w-20 h-20 border-2 ${imageIndex === index ? 'border-blue-600' : ''} hover:border-2 hover:border-blue-500`}>
                    <img key={index} src={url} onMouseEnter={() => handelMouseEnter(url, index)} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
              <div className="">
                <div className="img border border-black p-4 w-[25rem] h-[25rem] ">
                  <img src={showImage} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="btn w-full flex justify-between my-4">
                  <button disabled={cartBtnLoading} onClick={() => handleaddToCart()} className='flex justify-center items-center font-semibold uppercase gap-4 bg-[#ff9f00] text-white py-3 px-4 w-48 disabled:bg-[#e8b35e]'><IoCart className='text-xl' />{cartBtnLoading ? 'Added...' : 'Add to Cart'}</button>
                  <Link to={`/orderCon/${product._id}`}>
                    <button className="flex justify-center items-center font-semibold uppercase gap-4 bg-[#fb641b] text-white py-3 px-4 w-48"><IoIosGift /> Buy Now</button>
                  </Link>
                </div>
                {cartItemError && (
                  <p className="absolute text-red-600 font-semibold">{cartItemError}</p>
                )}
              </div>

            </div>
          </div>
          <div className="right border border-black w-[60%] bg-white p-4">
            <h1 className="text-xl">{product.name}</h1>
            <div className='text-sm font-semibold mt-2 text-gray-400 flex items-center gap-2'><StarRating stars={product.rating} /> 134 Ratings & 9 Reviews</div>
            <h1 className="text-3xl font-semibold mt-2">&#8377;{Math.round((product.price - (product.price * product.discount / 100))).toLocaleString('en-US')} <span className="line-through text-lg text-gray-400">&#8377;{product.price.toLocaleString('en-US')}</span> <span className="text-base font-semibold text-orange-500">{product.discount}% off</span></h1>
            <ul className='mt-4 list-none text-sm flex flex-col gap-2'>
              <li className="flex gap-2"><FiTag className='text-base text-orange-400' /> <span className='font-semibold'>Bank Offer</span> 10% instant discount on SBI Credit Card EMI Transactions, up to ₹1000 on orders of ₹5,000 and above T&C</li>
              <li className="flex gap-2"><FiTag className='text-base text-orange-400' /> <span className='font-semibold'>Bank Offer</span> Get ₹25* instant discount for the 1st Flipkart Order using Flipkart UPI T&C</li>
              <li className="flex gap-2"><FiTag className='text-base text-orange-400' /> <span className='font-semibold'>Bank Offer</span> Extra ₹2,000 off on SBI Credit Card EMI Transactions on a Net Cart Value of ₹50,000 and above T&C</li>
              <li className="flex gap-2"><FiTag className='text-base text-orange-400' /> Special PriceGet extra ₹10901 off (price inclusive of cashback/coupon) T&C</li>
            </ul>

            <div className="info flex gap-8 mt-4">
              {(product.type === 'phone' || product.type === 'computer' || product.type === 'camera') && (
                <div className="one">
                  <h1 className="font-semibold text-gray-500">Highlights </h1>
                </div>
              )}
              <div className="two">
                {(product.type === 'phone' || product.type === 'computer') && (
                  <ul className="text-sm flex flex-col gap-2">
                    <li className="">{product.ram} RAM | {product.storage} ROM</li>
                    <li className="">{product.processor}</li>
                  </ul>
                )}
                {(product.type === 'phone' || product.type === 'computer' || product.type === 'camera') && (
                  <ul className='text-sm flex flex-col gap-2 mt-2'>
                    <li className="">{product.camera}</li>
                    <li className="">{product.battery} Battery</li>
                  </ul>
                )}
              </div>
            </div>
            {product.color.length > 0 && (
              <div className="my-4">
                <h2 className="font-semibold text-gray-500 my-4">Colors:</h2>
                <div className="flex gap-2 flex-wrap">
                  <div className={`w-16 p-1 border-2 ${colorImageIndex === 0 ? 'border-blue-600' : ''} cursor-pointer `}>
                    <img onClick={() => handleImageClick(product.image[0], -1)} src={product.image[0]} alt="" className="w-full object-contain" />
                  </div>
                  {product.color.map((url, index) =>
                    <div key={index} className={`w-16 p-1 border-2 ${colorImageIndex === index + 1 ? 'border-blue-600' : ''} cursor-pointer`}>
                      <img onClick={() => handleImageClick(url, index)} src={url} alt="" className=" w-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="info flex gap-8 mt-4">
              <div className="one">
                <h1 className="font-semibold text-gray-500">Delivery</h1>
              </div>
              <div className="two">
                <h1 className="flex gap-2 items-center border-b-2 border-blue-500 py-2"><FaMapMarkerAlt /> {currentUser ? currentUser.address : 'Your Address...'} <Link to='/profile' className="px-2 bg-blue-500 text-white rounded-md">Edit</Link></h1>
                <h1 className="font-semibold">Delivery by {delivaryDate}</h1>
                {product.delivaryFee ? <div className='text-sm font-semibold text-gray-600 flex gap-1 items-center'>Delivary Charge 	&#8377;40 <FaTruckFast className='text-base' /></div> : <div className='text-sm font-semibold text-gray-500 flex gap-1 items-center'>FREE <span className='line-through'>&#8377;40</span><FaTruckFast className='text-base' /></div>}
              </div>
            </div>
            <div className="flex gap-8 my-4">
              <h1 className="font-semibold text-gray-500">Waranty</h1>
              {product.waranty === 'no' ? (
                <h1 className="">{product.waranty} Warranty for the Product</h1>
              ) : product.waranty === '1 Year' ? (
                <h1 className="">{product.waranty} Warranty for Product and 6 Months Warranty for In-Box Accessories</h1>
              ) : (
                <h1 className="">{product.waranty} Warranty for the Product</h1>
              )}
            </div>
            <div className="info flex gap-8 mt-4">
              <div className="one">
                <h1 className="font-semibold text-gray-500">Seller</h1>
              </div>
              <div className="two">
                <ul className="">
                  <li className="">{product.seller}</li>
                  <li className="">7 Days Service Center Replacement/Repair</li>
                </ul>
              </div>
            </div>

            <div className="info flex gap-8 mt-4">
              <div className="one">
                <h1 className="font-semibold text-gray-500">Description</h1>
              </div>
              <div className="two">
                <h1 className="text-sm text-justify">{product.description}</h1>
              </div>
            </div>

            <div className="rattings">
              <h1 className="text-2xl my-4 font-semibold">Rattings and Reviews</h1>
              <div className="flex">
                <div className="left border border-black w-1/2 p-3 flex">
                  <div className="">
                    <h1 className="text-3xl text-gray-800">{(+product.rating).toFixed(1)}&#9733;</h1>
                    <h1 className="text-lg my-2">134 Rattings & 9 Reviews</h1>
                  </div>
                  <div className="">
                    <LineProgressBar rating={4.5} stareValue={5} />
                    <LineProgressBar rating={3.9} stareValue={4} />
                    <LineProgressBar rating={1.5} stareValue={3} />
                    <LineProgressBar rating={1} stareValue={2} />
                    <LineProgressBar rating={0.5} stareValue={1} />
                  </div>
                </div>
                <div className="right border border-black w-1/2 flex justify-around">
                  <CircularProgressBar rating={4.5} title={"Camera"} />
                  <CircularProgressBar rating={4.2} title={"Battery"} />
                  <CircularProgressBar rating={4} title={"Display"} />
                </div>
              </div>
              {(currentUser && currentUser.admin === 'yes') && (
                <Link to={`/rate/${product._id}`}>
                  <button style={{ boxShadow: "0px 1px 3px 0px black" }} className="px-4 block py-2 my-2">Rate Product</button>
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
      <h1 className="text-2xl font-semibold px-6 py-2">Similar Items</h1>
      <div id='lastDiv' className="px-4 py-2 flex gap-4 justify-center ">
      {(!loading && similarProduct) && (
        similarProduct.map((product, index)=>
        <Link to={`/product/${product._id}`} key={index}>
          <div className="card w-40 h-full shadow-xl border rounded-md overflow-hidden">
            <div className="img w-full h-32 overflow-hidden">
              <img src={product.image[0]} alt="" className='w-full h-full object-contain transition-all duration-300 hover:scale-105' />
            </div>
            <h1 className="px-2 py-1 line-clamp-3">{product.name}</h1>
            <h1 className="px-2 py-1"><span className="text-white bg-orange-400 rounded-sm px-[2px]">{(+product.rating).toFixed(1)}&#9733;</span> Ratings</h1>
          </div>
        </Link>
        )
      )}
      </div>
      <Footer />
    </main>
  )
}
