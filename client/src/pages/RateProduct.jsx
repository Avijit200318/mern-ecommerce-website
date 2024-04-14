import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { IoStar } from "react-icons/io5";
import Footer from '../components/Footer';


export default function RateProduct() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [starRating, setStarRating] = useState(0);
    // console.log(starRating);
    const navigate = useNavigate();

    useEffect(() => {
        window.scroll(0, 0);
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/product/getProduct/${params.productId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, []);

    const handleChange = (e) => {
        setStarRating(+e.target.id + 1);
    };

    const submitRating = async() => {
        try{
            const res = await fetch(`/api/product/rating/${params.productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: starRating,
                }),
            });
            const data = await res.json();
            if(data.success === false){
                console.log(data.message);
                return;
            }
            navigate(`/product/${params.productId}`);
            console.log("done");
        }catch(error){
            console.log(error.message);
        }
    }

    return (
        <div>
            {loading && (
                <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
                    <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
                </div>
            )}
            {(!loading && product) && (
                <div className="p-4 w-full h-screen flex flex-col items-center">
                    <h1 className="text-2xl my-4 font-semibold">Rating and Reviews</h1>
                    <div className="flex items-center gap-4 my-4 border-2 border-gray-400 p-4 w-full sm:w-[90%] md:w-[42rem]">
                        <div className="w-36 h-36 sm:w-24 sm:h-24">
                            <img src={product.image[0]} alt="" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-lg sm:text-xl truncate">{product.name}</h1>
                    </div>
                    <div className="border-2 border-gray-400 w-full p-4 sm:w-[90%] md:w-[42rem]">
                        <h1 className="text-lg my-2 font-semibold">Rate this Product</h1>
                        <div className="flex gap-3 my-4">
                            {[...Array(5)].map((star, index) => (
                                <div key={index} className="">
                                    <input type="radio" onChange={handleChange} id={index} name='star' className="" hidden />
                                    <label id={index} htmlFor={index} className="">
                                        <IoStar className={`text-4xl  ${starRating > index ? 'text-[#fcd734]' : 'text-gray-300'}`} />
                                    </label>
                                </div>
                            ))}
                        </div>
                        <textarea name="" id="" cols="30" className='w-full border border-gray-400 resize-none h-44 p-3 rounded-md' placeholder='Description'></textarea>
                        <button onClick={submitRating} className="px-4 py-2 bg-blue-500 text-white rounded-md my-4">Submit</button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}
