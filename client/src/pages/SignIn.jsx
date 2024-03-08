import React from 'react'
import {Link} from 'react-router-dom';

export default function SignIn() {
  return (
    <div className='flex justify-center items-center h-[90vh] bg-[#C5FFF8]'>
      <div className="w-[28rem] p-4 rounded-3xl shadow-2xl bg-white">
        <h1 className='text-center text-3xl my-7'>Login</h1>
        <form action="" className="flex flex-col justify-center my-4 p-4 gap-4">
          <input type="email" placeholder='email' id='email' className='px-4 py-3 rounded-lg  border-2 border-gray-300' autoComplete='off' />
          <input type="password" placeholder='password' id='password' className='px-4 py-3 rounded-lg border-2 border-gray-300' autoComplete='off' />
          <p className="cursor-pointer font-semibold">Forget password ?</p>
          <button className="bg-blue-600 text-xl text-white font-semibold w-full py-2 rounded-lg transition-all duration-300 hover:bg-blue-500">Login</button>
        </form>
        <p className='px-6 text-xs font-semibold my-4'>By continuing, you agree to NovaMart's Terms of Service and acknowledge you've read our Privacy Policy.Notice all collection</p>
        <div className="flex gap-2 px-4 my-8">
          <p>Don't have an account ?</p>
          <Link to='/sign-up' className='text-blue-500 font-semibold'>SignUp</Link>
        </div>
      </div>
    </div>
  )
}
