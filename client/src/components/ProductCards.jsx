import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCards({ product }) {
    return (
        <div>
            <Link to={`/product/${product._id}`}>
                <div className="border border-black  w-64 p-3 flex flex-col gap-3 overflow-hidden">
                    <div className="left h-60 w-full flex justify-center">
                        <img src={product.image[0]} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="right px-1">
                        <h1 className="text-xl font-semibold my-3 truncate">{product.name}</h1>
                        <div className="flex gap-2 items-center"><span className="bg-orange-500 text-white px-1 text-sm font-semibold rounded-sm">{(+product.rating).toFixed(1)}&#9733;</span><span className='text-gray-500 font-semibold'>134 Ratings & 9 Reviews</span></div>
                        <h1 className="text-lg font-semibold mt-2">&#8377;{Math.round((product.price - (product.price * product.discount / 100))).toLocaleString('en-US')} <span className="line-through text-gray-400 text-base mx-1">&#8377;{product.price.toLocaleString('en-US')}</span> <span className="text-sm font-semibold text-orange-500">{product.discount}% off</span></h1>

                    </div>
                </div>
            </Link>
        </div>
    )
}
