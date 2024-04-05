import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../public/images/logo.png";
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { BsBoxSeamFill } from "react-icons/bs";
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  // console.log("current user is ", currentUser);
  const [searchTerm, setSearchTerm] = useState('');
  // console.log("searchTerm is ", searchTerm);
  const navigate = useNavigate();

  useEffect(()=> {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <header id='header' className=''>
      <div className="flex w-full justify-between items-center bg-[#0d6efd] px-10 py-2">
        <div className="nameLogo flex items-center">
          <img src={Logo} alt="" className="w-8" />
          <Link to='/'>
            <h1 className="text-xl"><span className='text-[#EBF400] font-semibold'>Nova</span><span className="text-[#7FC7D9] font-semibold">Mart</span></h1>
          </Link>
        </div>
        <div className="links flex justify-center items-center gap-8 text-white font-semibold w-[20%]">
          {/* <Link to='/about' className='text-lg'>About</Link>
          <Link to='/contact' className='text-lg'>Contact</Link> */}
        </div>
        <form onSubmit={handleSubmit} className="w-[40%] pr-8 bg-white relative rounded-full overflow-hidden">
          <input type="text" className="w-full px-4 py-2 outline-none" placeholder='Search...' value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)} />
          <button className='absolute top-2 right-3 text-2xl'><IoSearch />
          </button>
        </form>
        <div className="allBtns flex justify-between items-center gap-4 text-white font-semibold">
          <Link title='Order' to="/order" className="text-2xl  relative"><BsBoxSeamFill />
          {currentUser && currentUser.order.length > 0 && <span className='bg-red-600 w-[15px] h-[15px] rounded-full absolute top-[-1px] right-[-8px] flex items-center justify-center text-[0.7rem]'>{currentUser.order.length}</span>}
          </Link>
          <Link title='Cart' to="/cart" className="text-2xl mx-4 relative"><FaCartShopping />
            {currentUser && currentUser.cart.length > 0 && <span className='bg-red-600 w-[15px] h-[15px] rounded-full absolute top-[-4px] right-[-4px] flex items-center justify-center text-[0.7rem]'>{currentUser.cart.length}</span>}
          </Link>
          {currentUser ? (
            <Link to='/profile'>
              <img src={currentUser.avatar} alt="" className='w-[2.5rem] h-[2.5rem] border-2 border-white object-cover rounded-full overflow-hidden bg-[#96EFFF]' />
            </Link>
          ) : (
            <Link to='/sign-in' className="text-xl mx-4 mb-[5px]">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}
