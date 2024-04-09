import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function UserProducts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userProducts, setUserProducts] = useState([]);
    const [showProductError, setShowPorductError] = useState(false);
    const [productLoading, setProductLoading] = useState(false);
    // console.log(currentUser);
    // console.log("userProduct details -", userProducts);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setProductLoading(true);
                const res = await fetch(`/api/user/userProducts/${currentUser._id}`);
                const data = await res.json();
                if (data.successs === false) {
                    setProductLoading(false);
                    setShowPorductError(true);
                }
                setUserProducts(data);
                setProductLoading(false);
            } catch (error) {
                setShowPorductError(true);
                setProductLoading(false);
            }
        };

        fetchProducts();
    }, []);


    const handleDelete = async (productId) => {
        try {
            const res = await fetch(`/api/product/delete/${productId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setUserProducts((prev) => prev.filter((product) => product._id !== productId));
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <main>
            {productLoading && (
                <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
                <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
              </div>
            )}
            {(userProducts.length > 0 && !productLoading) && (
        <div>
            <h1 className='text-center text-3xl my-6 font-semibold'>Your Products</h1>
            <div className="w-full py-4 flex flex-col gap-4 sm:p-8">
                {userProducts.length > 0 && userProducts.map((product) => (
                    product.type === 'phone' || product.type === 'computer' ? (<div key={product._id} className="card flex gap-2 bg-white sm:gap-6">
                        <Link to={`/product/${product._id}`} >
                            <div className="left w-36 px-2 py-4 sm:px-4 sm:w-44 overflow-hidden">
                                <img src={product.image[0]} alt="" className='mx-auto w-full h-full object-contain transition-all duration-300 hover:scale-110' />
                            </div>
                        </Link>
                        <div className="right w-[80%] px-1 py-2 sm:px-3">
                            <Link to={`/product/${product._id}`}>
                                <div className="flex justify-between">
                                    <div className="info">
                                        <h3 className="text-xl font-semibold mb-1 line-clamp-2">{product.name}</h3>
                                        <h3 className='text-sm font-semibold'><span className="bg-orange-400 text-white p-1 text-xs font-semibold rounded-md">{(+product.rating).toFixed(1)}&#9733;</span> 134 Ratings & 9 Reviews</h3>
                                        {/* some */}
                                        <h1 className="text-lg font-semibold mt-2 md:hidden">&#8377;{(product.price).toLocaleString('US-en')} <span className='text-sm text-orange-500 mx-2'>{product.discount}% off</span></h1>
                                        <ul className="list-none flex flex-col gap-1 pt-4">
                                            <li className="text-sm">{product.ram} RAM | {product.storage} ROM</li>
                                            <li className="text-sm">{product.processor}</li>
                                            <li className='text-sm'>{product.camera}</li>
                                            <li className="text-sm">{product.battery} Battery</li>
                                            <li className="text-sm">{product.waranty} Manufacturing Warranty</li>
                                        </ul>
                                    </div>
                                    <div className="price p-4 hidden md:block">
                                        <h2 className="text-2xl font-semibold">&#8377;{(product.price - Math.round(product.price * product.discount / 100)).toLocaleString('en-US')}</h2>
                                        <div className="flex gap-2 items-center">
                                            <h2 className="text-lg text-gray-500 line-through">&#8377;{product.price.toLocaleString('en-US')}</h2>
                                            <h2 className="text-xs text-orange-400 font-bold">{product.discount}% off</h2>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className="flex gap-8 mt-2">
                                <Link to={`/updateProduct/${product._id}`} className="bg-blue-500 text-white px-2 text-center py-1 rounded-md w-16">Edit</Link>
                                <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-1 rounded-md w-16">Delete</button>
                            </div>
                        </div>
                    </div>) :
                        (<div key={product._id} className="card flex gap-2 bg-white sm:gap-6">
                            <Link to={`/product/${product._id}`}>
                                <div className="left w-36 px-2 py-4 sm:w-44 sm:px-4 overflow-hidden">
                                    <img src={product.image[0]} alt="" className='mx-auto w-full h-full object-contain transition-all duration-300 hover:scale-110' />
                                </div>
                            </Link>
                            <div className="right w-[80%] px-1 py-2 sm:px-3">
                                <Link to={`/product/${product._id}`}>
                                    <div className="flex justify-between">
                                        <div className="info">
                                            <h3 className="text-xl font-semibold mb-1 line-clamp-2">{product.name}</h3>
                                            <h3 className='text-sm font-semibold'><span className="bg-orange-400 text-white p-1 text-xs font-semibold rounded-md">{(+product.rating).toFixed(1)}&#9733;</span> 134 Ratings & 9 Reviews</h3>
                                            {/* some */}
                                            <h1 className="text-lg font-semibold mt-2 md:hidden">&#8377;{(product.price).toLocaleString('US-en')} <span className='text-sm text-orange-500 mx-2'>{product.discount}% off</span></h1>
                                            <ul className="list-none flex flex-col gap-1 pt-4">
                                                <li className='text-sm w-full line-clamp-3 mb-2 sm:w-[23rem]'>{product.description}</li>
                                                <li className='text-sm'>{product.camera}</li>
                                                <li className="text-sm">{product.battery} Battery</li>
                                                <li className="text-sm">{product.waranty} Manufacturing Warranty</li>
                                            </ul>
                                        </div>
                                        <div className="price hidden p-4 md:block">
                                            <h2 className="text-2xl font-semibold">&#8377;{(product.price - Math.round(product.price * product.discount / 100)).toLocaleString('en-US')}</h2>
                                            <div className="flex gap-2 items-center">
                                                <h2 className="text-lg text-gray-500 line-through">&#8377;{product.price.toLocaleString('en-US')}</h2>
                                                <h2 className="text-xs text-orange-400 font-bold">{product.discount}% off</h2>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div className="flex gap-8 mt-2">
                                    <Link to={`/updateProduct/${product._id}`} className="bg-blue-500 text-white px-2 text-center py-1 rounded-md w-16">Edit</Link>
                                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-1 rounded-md w-16">Delete</button>
                                </div>
                            </div>
                        </div>)
                )
                )}
            </div>
        </div>
            )}
            <Footer />
        </main>
    )
}
