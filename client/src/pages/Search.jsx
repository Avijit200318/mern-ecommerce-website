import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ProductCards from '../components/ProductCards';

export default function Search() {

    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        delivaryFee: true,
        sort: 'createdAt',
        order: 'desc',
    });
    // console.log(sideBarData);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    // console.log('products are - ', products);
    const [showMore, setShowMore] = useState(false);

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSideBarData({ ...sideBarData, searchTerm: e.target.value });
        }
        else if (e.target.id === 'delivaryFee') {
            setSideBarData({ ...sideBarData, [e.target.id]: e.target.checked || e.target.checked === 'false' ? false : true });
        }
        else if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';

            setSideBarData({ ...sideBarData, sort, order });
        }
        else {
            setSideBarData({ ...sideBarData, type: e.target.id });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set('type', sideBarData.type);
        urlParams.set('delivaryFee', sideBarData.delivaryFee);
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('order', sideBarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const delivaryFeeFromUrl = urlParams.get('delivaryFee');
        const orderFromUrl = urlParams.get('order');
        const sortFromUrl = urlParams.get('sort');

        if (searchTermFromUrl || typeFromUrl || delivaryFeeFromUrl || orderFromUrl || sortFromUrl) {
            setSideBarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                delivaryFee: delivaryFeeFromUrl === 'false' ? false : true,
                order: orderFromUrl || 'desc',
                sort: sortFromUrl || 'createdAt',
            })
        };

        const fetchSearchProducts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/product/search?${searchQuery}`);
            const data = await res.json();
            if(data.length > 7){
                setShowMore(true);
            }
            setProducts(data);
            setLoading(false);
        };
        fetchSearchProducts();

    }, [location.search]);

    const onShowMoreClick = async () => {
        const numberOfProducts = products.length;
        const startIndex = numberOfProducts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/product/search?${searchQuery}`);
        const data = await res.json();
        if(data.length < 8){
            setShowMore(false);
        }
        setProducts([...products, ...data]);
    };

    return (
        <main>
            <div className="flex w-full">
                <div className="left w-[30%] h-full border border-black py-4 px-4">
                    <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-6 px-4">
                        <div className="flex gap-3 items-center">
                            <label className='text-xl'>Search Term:</label>
                            <input type="text" id='searchTerm' onChange={handleChange} value={sideBarData.searchTerm} className="border border-black px-4 py-2 rounded-md w-[60%]" placeholder='Search' />
                        </div>
                        <div className="flex gap-2">
                            <label className="text-lg font-semibold">Type:</label>
                            <div className="flex gap-2 flex-wrap items-center">
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" onChange={handleChange} checked={sideBarData.type === 'all'} id='all' className="w-5 h-5" />
                                    <label htmlFor="all" className="text-base">All</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" onChange={handleChange} checked={sideBarData.type === 'phone'} id='phone' className="w-5 h-5" />
                                    <label htmlFor="phone" className="text-base">Phone</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" onChange={handleChange} checked={sideBarData.type === 'computer'} id='computer' className="w-5 h-5" />
                                    <label htmlFor="computer" className="text-base">Laptop</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" onChange={handleChange} checked={sideBarData.type === 'camera'} id='camera' className="w-5 h-5" />
                                    <label htmlFor="camera" className="text-base">Camera</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" onChange={handleChange} checked={sideBarData.type === 'boots'} id='boots' className="w-5 h-5" />
                                    <label htmlFor="boots" className="text-base">Boot</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" onChange={handleChange} checked={sideBarData.type === 'bag'} id='bag' className="w-5 h-5" />
                                    <label htmlFor="bag" className="text-base">Bag</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" onChange={handleChange} checked={sideBarData.type === 'headset'} id='headset' className="w-5 h-5" />
                                    <label htmlFor="headset" className="text-base">Head Set</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" onChange={handleChange} checked={sideBarData.type === 'others'} id='others' className="w-5 h-5" />
                                    <label htmlFor="others" className="text-base">Others</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <label className='text-base font-semibold'>Delivery Charge: </label>
                            <div className="flex gap-2 items-center">
                                <input type="checkbox" id='delivaryFee' onChange={handleChange} checked={!sideBarData.delivaryFee} className="w-5 h-5" />
                                <label htmlFor="delivaryFee" className='text-base'>Free Delivary</label>
                            </div>
                        </div>
                        <div className="">
                            <label className='text-base font-semibold'>Sort: </label>
                            <select onChange={handleChange} defaultValue={'createdAt_desc'} id="sort_order" className='border rounded-lg px-3 py-2'>
                                <option value="price_desc">Price high to low</option>
                                <option value="price_asc">Price low to high</option>
                                <option value="createdAt_desc">Latest</option>
                                <option value="createdAt_asc">Oldest</option>
                            </select>
                        </div>
                        <button className="w-full py-2 px-4 bg-blue-600 text-white text-lg rounded-md font-semibold transition-all duration-300 hover:bg-blue-500 disabled:bg-blue-500">Search</button>
                    </form>
                </div>
                <div className="right w-[70%] h-full border border-black p-2">
                    <h1 className="text-2xl my-4">Search Results</h1>
                    <div className="flex gap-1 flex-wrap justify-start">
                        {loading && (
                            <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
                                <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
                            </div>
                        )}
                        {(!loading && products.length === 0) && (
                            <h1 className="text-2xl mx-4 text-red-500 font-semibold">No Results found!</h1>
                        )}
                        {!loading && products.length > 0 && products.map((product) => <ProductCards key={product._id} product={product} />)}

                        {showMore && (
                            <div className="w-full flex justify-center">
                                <button onClick={onShowMoreClick} className=" my-4 text-blue-700 font-semibold text-lg">Show More</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
