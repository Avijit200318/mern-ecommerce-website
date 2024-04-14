import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import HomePageProductCards from '../components/HomePageProductCards';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

import slide1 from "../../public/images/slide11.png";
import slide2 from "../../public/images/slide21.png";
import slide3 from "../../public/images/slide3.png";
import slide4 from "../../public/images/slide4.png";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";


export default function Home() {

  SwiperCore.use([Navigation, Autoplay]);

  const [phones, setPhones] = useState([]);
  const [laptops, steLaptops] = useState([]);
  const [camera, setCamera] = useState([]);
  const [bags, setBags] = useState([]);
  const [boots, setBoots] = useState([]);
  const [headSet, setHeadSet] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log();

  const slides = [
    { "url": slide1 },
    { "url": slide2 },
    { "url": slide3 },
    { "url": slide4 }
  ];

  useEffect(() => {
    const fetchPhonesData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/product/search?type=phone&limit=12");
        const data = await res.json();
        setPhones(data);
        fetchLaptopsData();
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchPhonesData();

    const fetchLaptopsData = async () => {
      try {
        const res = await fetch("/api/product/search?type=computer&limit=12");
        const data = await res.json();
        steLaptops(data);
        fetchCameraData();
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    }

    const fetchCameraData = async () => {
      try {
        const res = await fetch("/api/product/search?type=camera&limit=12");
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return;
        }
        setCamera(data);
        fetchBagData();
      } catch (error) {
        console.log(error.message);
      }
    }

    const fetchBagData = async() => {
      try {
        const res = await fetch("/api/product/search?type=bag&limit=12");
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return;
        }
        setBags(data);
        fetchBootsData();
      } catch (error) {
        console.log(error.message);
      }
    }

    const fetchBootsData = async() => {
      try {
        const res = await fetch("/api/product/search?type=boots&limit=12");
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return;
        }
        setBoots(data);
        fetchHeadSetData();
      } catch (error) {
        console.log(error.message);
      }
    }

    const fetchHeadSetData = async() => {
      try {
        const res = await fetch("/api/product/search?type=headset&limit=12");
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return;
        }
        setHeadSet(data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }
  }, []);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    // initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button onClick={onClick} className="prev-arrow border h-20 cursor-pointer text-2xl rounded-md px-2 shadow-2xl absolute left- 0 z-20 bg-white opacity-90 hover:opacity-100 sm:text-3xl"><IoIosArrowBack /></button>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <button onClick={onClick} className="next-arrow border h-20 cursor-pointer text-2xl rounded-md px-2 shadow-3xl absolute right-0 z-20 bg-white opacity-90 hover:opacity-100 sm:text-3xl"><IoIosArrowForward /></button>
    )
  };


  return (
    <main className='bg-blue-100'>
      {loading && (
        <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
          <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
        </div>
      )}
      {loading === false && (
        <div className=''>
          <Swiper modules={[Navigation]} spaceBetween={50} slidesPerView={1} navigation={true} autoplay={{ delay: 5000, disableOnInteraction: false }} loop={true} loopedslides={1} >
            {
              slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div style={{ background: `url(${slide.url}) center no-repeat`, backgroundSize: 'cover' }} className="h-[38vw] lg:h-[30vw] xl:h-[350px]" key={index}></div>
                </SwiperSlide>
              ))
            }
          </Swiper>

          <div className="py-4 bg-white relative shadow-lg sm:p-4">
            <div className="flex gap-4 items-center mb-2">
              <h1 className="text-xl font-semibold px-1 sm:text-2xl">Today's Deals</h1>
              <Link to='/search?type=phone' className='text-blue-500 font-semibold block sm:text-lg'>See all Deals</Link>
            </div>
            <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />} className='flex gap-1 items-center'>
              {phones.map((phone) =>
                <HomePageProductCards key={phone._id} product={phone} />
              )}
            </Slider>
          </div>

          <div className="py-4 my-6 bg-white relative shadow-lg sm:p-4">
            <div className="flex gap-4 items-center mb-2">
              <h1 className="text-xl font-semibold px-1 sm:text-2xl">Best Deals in Laptops</h1>
              <Link to='/search?type=computer' className='text-blue-500 font-semibold block sm:text-lg'>See all Deals</Link>
            </div>
            <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />} className='flex gap-1 items-center'>
              {laptops.map((laptop) =>
                <HomePageProductCards key={laptop._id} product={laptop} />
              )}
            </Slider>
          </div>

          <div className="py-4 my-6 bg-white relative shadow-lg sm:p-4">
            <div className="flex gap-4 items-center mb-2">
              <h1 className="text-xl font-semibold px-1 sm:text-2xl">Best Deals in Camera</h1>
              <Link to='/search?type=camera' className='text-blue-500 font-semibold block sm:text-lg'>See all Deals</Link>
            </div>
            <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />} className='flex gap-1 items-center'>
              {camera.map((camera) =>
                <HomePageProductCards key={camera._id} product={camera} />
              )}
            </Slider>
          </div>

          <div className="py-4 my-6 bg-white relative shadow-lg p-4">
            <div className="flex gap-4 items-center mb-2">
              <h1 className="text-xl font-semibold px-1 sm:text-2xl">Best Deals in Bags</h1>
              <Link to='/search?type=bag' className='text-blue-500 font-semibold block sm:text-lg'>See all Deals</Link>
            </div>
            <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />} className='flex gap-1 items-center'>
              {bags.map((bag) =>
                <HomePageProductCards key={bag._id} product={bag} />
              )}
            </Slider>
          </div>

          <div className="py-4 my-6 bg-white relative shadow-lg p-4">
            <div className="flex gap-4 items-center mb-2">
              <h1 className="text-xl font-semibold px-1 sm:text-2xl">Best Deals in Boots</h1>
              <Link to='/search?type=boots' className='text-blue-500 font-semibold block sm:text-lg'>See all Deals</Link>
            </div>
            <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />} className='flex gap-1 items-center'>
              {boots.map((boot) =>
                <HomePageProductCards key={boot._id} product={boot} />
              )}
            </Slider>
          </div>

          <div className="py-4 my-6 bg-white relative shadow-lg p-4">
            <div className="flex gap-4 items-center mb-2">
              <h1 className="text-xl font-semibold px-1 sm:text-2xl">Best Deals in Headsets</h1>
              <Link to='/search?type=headset' className='text-blue-500 font-semibold block sm:text-lg'>See all Deals</Link>
            </div>
            <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />} className='flex gap-1 items-center'>
              {headSet.map((headset) =>
                <HomePageProductCards key={headset._id} product={headset} />
              )}
            </Slider>
          </div>
        </div>
      )}
      <Footer />
    </main>
  )
}
