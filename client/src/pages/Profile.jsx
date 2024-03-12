import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/user/userSlice';
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
  }

  return (
    <div className='bg-[#DCF2F1]'>
      <div className="flex flex-col items-center py-16 gap-4 relative">
        <h1 className="text-3xl font-semibold">Profile</h1>
          <img src={ formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} alt="" className='rounded-full h-24 w-24 object-cover cursor-pointer mt-4 border-4 border-white' />
        {fileUploadError ? (
          <span className="text-red-700 absolute font-semibold top-[14rem]">Error Image Upload (Image size must be less than 2MB)</span>
        ): filePercent > 0 && filePercent < 100 ? (
          <span className="text-green-500 absolute top-[14rem]">{`Uploading ${filePercent}%`}</span>
        ): filePercent === 100 ? (
          <span className="text-green-500 absolute top-[14rem]">Image sucessfully uploaded</span>
        ): (
          ''
        )
      }
      {/* update error which I add latter */}
      {error && (
        <span className="text-red-700 font-semibold absolute top-[15.5rem]">{error}</span>
      )}
      {userUpdate ? <span className='text-green-600 font-semibold absolute top-[15.5rem]'>User updated successfully</span> : ''}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 px-8 pt-8 pb-0 w-[30rem] rounded-lg">
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept='image/*' />
          <input type="text" placeholder='username' id='username' className="px-4 py-3 rounded-lg w-full" defaultValue={currentUser.username} onChange={handleChange} />
          <input type="email" placeholder='email' id='email' className="px-4 py-3 rounded-lg w-full" defaultValue={currentUser.email} onChange={handleChange} />
          <input type="password" placeholder='password' id='password' className="px-4 py-3 rounded-lg w-full" onChange={handleChange} />
          <textarea cols="30" placeholder='Address' id='address' className="w-full rounded-lg p-4 resize-none" defaultValue={currentUser.address} onChange={handleChange}></textarea>
          <button disabled={loading} className="w-full uppercase bg-[#0d6efd] p-3 font-semibold rounded-lg text-white disabled:bg-blue-500 transition-all duration-300 hover:bg-blue-700">{loading ? 'Updating...' : 'Update'}</button>
        </form>
        <Link to='' className='bg-red-500 text-white uppercase w-[26rem] text-center font-semibold py-3 rounded-lg'>SignOut</Link>
        <Link to='' className='bg-red-500 text-white uppercase w-[26rem] text-center font-semibold py-3 rounded-lg'>Sell Products</Link>
        <button onClick={handleDeleteUser} className='bg-red-500 text-white uppercase w-[26rem] text-center font-semibold py-3 rounded-lg'>Delete Account</button>
      </div>
    </div>
  )
}
