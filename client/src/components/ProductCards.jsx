import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCards({ product }) {
    return (
        <div className='w-[49%] shadow-lg sm:w-[32.9%] md:w-[24.6%] lg:w-[32.9%] 2xl:w-auto'>
            <Link to={`/product/${product._id}`}>
                <div className="border border-black w-full p-3 flex flex-col gap-3 overflow-hidden 2xl:w-64 sm:p-3">
                    <div className="left h-40 w-full flex justify-center overflow-hidden lg:h-60">
                        <img src={product.image[0]} alt="" className="w-full h-full object-contain transition-all duration-300 hover:scale-110" />
                    </div>
                    <div className="right px-1">
                        <h1 className="text-sm font-semibold my-3 truncate sm:text-xl">{product.name}</h1>
                        <div className="flex gap-2 items-center"><span className="bg-orange-500 text-white px-1 text-sm font-semibold rounded-sm">{(+product.rating).toFixed(1)}&#9733;</span><span className='text-gray-500 font-semibold truncate text-sm sm:text-base'>134 Ratings & 9 Reviews</span></div>
                        <h1 className="text-sm font-semibold mt-2 sm:text-lg truncate">&#8377;{Math.round((product.price - (product.price * product.discount / 100))).toLocaleString('en-US')} <span className="line-through text-gray-400 text-xs sm:text-base mx-1">&#8377;{product.price.toLocaleString('en-US')}</span> <span className="text-xs font-semibold text-orange-500 sm:text-sm">{product.discount}% off</span></h1>

                    </div>
                </div>
            </Link>
        </div>
    )
}
