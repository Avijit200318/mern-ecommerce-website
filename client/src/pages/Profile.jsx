import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { MdDelete } from "react-icons/md";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  // console.log(file);
  const [filePercent, setFilePercent] = useState(0);
  // console.log(filePercent);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);

  const dispatch = useDispatch();
  const {loading, error} = useSelector((state)=> state.user);

  const [userUpdate, setUserUpdate] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('upload is ' + progress + '% done');
        setFilePercent(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadUrl) => {
            setFormData({ ...formData, avatar: downloadUrl });
          })
      }
    );
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUserUpdate(true);
    }catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try{
      dispatch(signOutUserSuccess());
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    }catch(error){
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div className='bg-[#DCF2F1]'>
      <div className="flex flex-col items-center py-12 gap-4 relative">
        <h1 className="text-3xl font-semibold">Profile</h1>
          <img src={ formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} alt="" className='rounded-full h-24 w-24 object-cover cursor-pointer mt-4 border-4 border-white' />
        {fileUploadError ? (
          <span className="text-red-700 absolute font-semibold top-[14rem]">Error Image Upload (Image size must be less than 2MB)</span>
        ): filePercent > 0 && filePercent < 100 ? (
          <span className="text-green-500 absolute top-[13rem]">{`Uploading ${filePercent}%`}</span>
        ): filePercent === 100 ? (
          <span className="text-green-500 absolute top-[13rem]">Image sucessfully uploaded</span>
        ): (
          ''
        )
      }
      {/* update error which I add latter */}
      {error && (
        <span className="text-red-700 font-semibold absolute top-[14.5rem]">{error}</span>
      )}
      {userUpdate ? <span className='text-green-600 font-semibold absolute top-[14.5rem]'>User updated successfully</span> : ''}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 px-4 pt-8 pb-0 w-full rounded-lg sm:w-[70%] md:w-[30rem] sm:px-8">
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept='image/*' />
          <input type="text" placeholder='username' id='username' className="px-4 py-3 rounded-lg w-full border border-black" defaultValue={currentUser.username} onChange={handleChange} />
          <input type="email" placeholder='email' id='email' className="px-4 py-3 rounded-lg w-full border border-black" defaultValue={currentUser.email} onChange={handleChange} />
          <input type="password" placeholder='password' id='password' className="px-4 py-3 rounded-lg w-full border border-black" onChange={handleChange} />
          <input type="number" placeholder='Contact' id='contact' className="px-4 py-3 rounded-lg w-full border border-black" defaultValue={currentUser.contact} onChange={handleChange} />
          <textarea cols="30" placeholder='Address' id='address' className="w-full rounded-lg p-4 resize-none border border-black" defaultValue={currentUser.address} onChange={handleChange}></textarea>
          <button disabled={loading} className="w-full uppercase bg-[#0d6efd] p-3 font-semibold rounded-lg text-white disabled:bg-blue-500 transition-all duration-300 hover:bg-blue-700">{loading ? 'Updating...' : 'Update'}</button>
        </form>
        <Link to='/create-product' className='bg-blue-800 text-white uppercase w-[90%] text-center font-semibold py-3 rounded-lg sm:w-[61%] md:w-[26rem]'>Sell Products</Link>
        <Link to='/userProducts' className='bg-green-600 text-white uppercase w-[90%] text-center font-semibold py-3 rounded-lg sm:w-[61%] md:w-[26rem]'>Your Products</Link>
        {currentUser.admin === 'yes' && (
          <Link to='/allOrders' className='bg-[#0d6efd] text-white uppercase w-[90%] text-center font-semibold py-3 rounded-lg sm:w-[61%] md:w-[26rem]'>All Orders</Link>
        )}
        <button onClick={handleSignOut} className='bg-red-600 text-white uppercase w-[90%] text-center font-semibold py-3 rounded-lg sm:w-[61%] md:w-[26rem]'>SignOut</button>
        <button onClick={handleDeleteUser} className='bg-red-800 text-white uppercase w-[90%] text-center font-semibold py-3 rounded-lg sm:w-[61%] md:w-[26rem]'>Delete Account</button>
      </div>
    </div>
  )
}
