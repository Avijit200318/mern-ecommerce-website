import React, {useRef} from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector((state)=> state.user);
  const fileRef = useRef(null);
  return (
    <div>
        <div className="flex flex-col items-center py-16">
          <div className="image w-21 h-21 overflow-hidden my-6 cursor-pointer">
          <img src={currentUser.avatar} onClick={() => fileRef.current.click()} alt="" className='w-full h-full object-cover' />
          </div>
          <form action="" className="border-4 border-gray-300 flex flex-col items-center gap-4 px-8 py-10 w-[30rem] rounded-lg">
            <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept='image/*' />
            <input type="text" placeholder='username' className="px-4 py-3 rounded-lg w-full border-2 border-black" value={currentUser.username} />
            <input type="email" placeholder='email' className="px-4 py-3 rounded-lg w-full border-2 border-black" value={currentUser.email} />
            <input type="password" placeholder='password' className="px-4 py-3 rounded-lg w-full border-2 border-black" />
            <textarea cols="30" placeholder='Address' className="w-full rounded-lg p-4 resize-none border-2 border-black" value={currentUser.address}></textarea>
            <button className="w-full uppercase bg-[#0d6efd] p-3 font-semibold rounded-lg text-white disabled:bg-blue-500 transition-all duration-300 hover:bg-blue-700">Update</button>
          </form>
        </div>
    </div>
  )
}
