import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../public/images/logo.png";
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { BsBoxSeamFill } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  // console.log("current user is ", currentUser);
  const [searchTerm, setSearchTerm] = useState('');
  // console.log("searchTerm is ", searchTerm);
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [menuOption, setMenuOption] = useState(null);
  const [menuBtnOption, setMenuBtnOption] = useState(false);
  console.log(menuBtnOption)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleMenu = () => {
    setMenu(!menu);
  }

  const handleMouseEnter = (e) => {
    setMenuOption(e.target.id);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const type = urlParams.get('type');
    if (type) {
      const value = {
        'phone': 'Smart Phone',
        'computer': 'Laptops',
        'camera': 'Camera',
        'bag': 'Bags',
        'headset': 'Head Sets',
        'boots': 'Sneakers'
      }
      const option = value[type];
      setMenuOption(option);
    } else {
      setMenuOption("Explore");
    }
  }, [location.search]);

  const handleMenuBtn = () => {
    setMenuBtnOption(!menuBtnOption);
  }

  return (
    <header id='header' className=''>
      <div className="px-2 flex w-full justify-between items-center bg-[#0d6efd] sm:px-10 py-2">
        <div className="flex gap-1 items-center w-[70%] sm:gap-12">
          <div className="nameLogo flex items-center">
            <Link to='/'>
              <img src={Logo} alt="" className="w-8" />
            </Link>
            <Link to='/'>
              <h1 className="hidden sm:block text-xl"><span className='text-[#EBF400] font-semibold'>Nova</span><span className="text-[#7FC7D9] font-semibold">Mart</span></h1>
            </Link>
          </div>
          <div onClick={handleMenu} className="hidden lg:block relative w-24 bg-white cursor-pointer py-1 rounded-md">
            <div className="flex gap-1 justify-center items-center">
              <p className="text-blue-600 font-semibold truncate pl-1">{menuOption ? menuOption : 'Explore'}</p>
              <p className="text-xl text-blue-600 pr-1"><MdKeyboardArrowDown /></p>
            </div>
            <div className="absolute z-30 w-full">
              <ul className={`bg-white ${menu ? 'block' : 'hidden'} w-32 shadow-xl border-2`}>
                <Link to='/search?type=phone'><li onMouseEnter={handleMouseEnter} id='Smart Phones' className='p-2 border-b-2 hover:bg-blue-500 hover:text-white hover:border-white'>Smart Phones</li></Link>
                <Link to='/search?type=computer'><li onMouseEnter={handleMouseEnter} id='Laptops' className='p-2 border-b-2 hover:bg-blue-500 hover:text-white hover:border-white'>Laptops</li></Link>
                <Link to='/search?type=headset'><li onMouseEnter={handleMouseEnter} id='Headsets' className='p-2 border-b-2 hover:bg-blue-500 hover:text-white hover:border-white'>Headsets</li></Link>
                <Link to='/search?type=bag'><li onMouseEnter={handleMouseEnter} id='Bags' className='p-2 border-b-2 hover:bg-blue-500 hover:text-white hover:border-white'>Bags</li></Link>
                <Link to='/search?type=boots'><li onMouseEnter={handleMouseEnter} id='Sneakers' className='p-2 border-b-2 hover:bg-blue-500 hover:text-white hover:border-white'>Sneakers</li></Link>
                <Link to='/search?type=camera'><li onMouseEnter={handleMouseEnter} id='Camera' className='p-2 border-b-2 hover:bg-blue-500 hover:text-white hover:border-white'>Camera</li></Link>
              </ul>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="w-[80%] pr-8 bg-white relative rounded-full overflow-hidden sm:w-[60%]">
            <input type="text" className="w-full px-4 py-2 outline-none" placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button className='absolute top-2 right-3 text-2xl'><IoSearch />
            </button>
          </form>
        </div>
        <button onClick={handleMenuBtn} className="text-white text-3xl sm:hidden"><IoMenu /></button>
        <div style={{right: menuBtnOption ? '0' : '-100%' }} className="allBtns flex flex-row-reverse items-center gap-4 w-full text-white font-semibold absolute  top-2 right-0 bg-[#0d6efd] z-20 transition-all duration-300 px-2 sm:flex sm:z-0 sm:static sm:right-auto sm:top-auto sm:flex-row sm:justify-between sm:w-auto">
        <button onClick={handleMenuBtn} className="text-2xl text-white font-semibold pr-2 sm:hidden"><RxCross2 /></button>
          <Link title='Order' to="/order" className="text-2xl  relative"><BsBoxSeamFill />
            {currentUser && currentUser.order.length > 0 && <span className='bg-red-600 w-[15px] h-[15px] rounded-full absolute top-[-1px] right-[-8px] flex items-center justify-center text-[0.7rem]'>{currentUser.order.length}</span>}
          </Link>
          <Link title='Cart' to="/cart" className="text-2xl relative sm:mx-4"><FaCartShopping />
            {currentUser && currentUser.cart.length > 0 && <span className='bg-red-600 w-[15px] h-[15px] rounded-full absolute top-[-4px] right-[-4px] flex items-center justify-center text-[0.7rem]'>{currentUser.cart.length}</span>}
          </Link>
          {currentUser ? (
            <Link to='/profile'>
              <img src={currentUser.avatar} alt="" className='w-[2.5rem] h-[2.5rem] border-2 border-white object-cover rounded-full overflow-hidden bg-[#96EFFF]' />
            </Link>
          ) : (
            <Link to='/sign-in' className="text-xl mb-[5px] sm:mx-4">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}
