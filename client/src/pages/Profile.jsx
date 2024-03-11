import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

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

  return (
    <div>
      <div className="flex flex-col items-center py-16 gap-4 relative">
        <h1 className="text-3xl font-semibold">Profile</h1>
          <img src={ formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} alt="" className='rounded-full h-24 w-24 object-cover cursor-pointer mt-4' />
        {fileUploadError ? (
          <span className="text-red-700 absolute top-[15rem]">Error Image Upload (Image size must be less than 2MB)</span>
        ): filePercent > 0 && filePercent < 100 ? (
          <span className="text-green-500 absolute top-[15rem]">{`Uploading ${filePercent}%`}</span>
        ): filePercent === 100 ? (
          <span className="text-green-500 absolute top-[15rem]">Image sucessfully uploaded</span>
        ): (
          ''
        )
      }
        <form action="" className="border-4 border-gray-300 flex flex-col items-center gap-4 px-8 pt-8 pb-0 w-[30rem] rounded-lg">
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept='image/*' />
          <input type="text" placeholder='username' id='username' className="px-4 py-3 rounded-lg w-full border-2 border-black" defaultValue={currentUser.username} onChange={handleChange} />
          <input type="email" placeholder='email' id='email' className="px-4 py-3 rounded-lg w-full border-2 border-black" defaultValue={currentUser.email} onChange={handleChange} />
          <input type="password" placeholder='password' id='password' className="px-4 py-3 rounded-lg w-full border-2 border-black" onChange={handleChange} />
          <textarea cols="30" placeholder='Address' id='address' className="w-full rounded-lg p-4 resize-none border-2 border-black" defaultValue={currentUser.address} onChange={handleChange}></textarea>
          <button className="w-full uppercase bg-[#0d6efd] p-3 font-semibold rounded-lg text-white disabled:bg-blue-500 transition-all duration-300 hover:bg-blue-700">Update</button>
        </form>
        <Link to='' className='bg-red-500 text-white uppercase w-[26rem] text-center font-semibold py-3 rounded-lg'>SignOut</Link>
        <Link to='' className='bg-red-500 text-white uppercase w-[26rem] text-center font-semibold py-3 rounded-lg'>Sell Products</Link>
        <Link to='' className='bg-red-500 text-white uppercase w-[26rem] text-center font-semibold py-3 rounded-lg'>Delete Account</Link>
      </div>
    </div>
  )
}
