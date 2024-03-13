import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';

import { MdDelete } from "react-icons/md";

export default function CreateProduct() {
    const [files, setFiles] = useState([]);
    const [colors, setColors] = useState([]);
    const [formData, setFormData] = useState({
        image: [],
    });
    console.log(formData);

    const [imageUploadError, setImageUploadError] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.image.length < 6){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for(let i = 0; i< files.length; i++){
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({...formData, image: formData.image.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => {
                setImageUploadError("Image upload failed (2 MB max per image)");
                setUploading(false);
            });
        }else{
            setImageUploadError("You can only upload 5 images");
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred /snapshot.totalBytes) * 100;
                    console.log(`upload is ${progress}`);
                },
                (error)=> {
                    reject(error);
                },
                ()=> {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=> {
                        resolve(downloadUrl);
                    });
                }
            )
        })
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            image: formData.image.filter((_, i) => i !== index),
        })
    }

    return (
        <div className='p-3 flex flex-col items-center bg-[#DCF2F1]'>
            <h1 className='text-3xl text-center my-6 font-semibold'>Sell Product</h1>
            <form action="" className="flex gap-8 border-2 border-black p-6">
                <div className="flex flex-col gap-4 border-2 border-black p-3">
                    <input type="text" placeholder='Name' id='name' autoComplete='off' className='p-3 rounded-lg ' />
                    <textarea id="description" placeholder='Description' cols="30" className='resize-none rounded-lg p-3' ></textarea>

                    <div className="typeCheckBox flex flex-wrap gap-6">
                        <div className="flex gap-2">
                            <input type="checkbox" id='computer' className='w-5' />
                            <span>Computer</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='phone' className='w-5' />
                            <span>Phone</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='camera' className='w-5' />
                            <span>Camera</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='other' className='w-5' />
                            <span>others</span>
                        </div>
                    </div>

                    <div className="offerCheckBox">
                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' className='w-5' />
                            <span>Offers</span>
                        </div>
                    </div>

                    <div className="elec flex flex-col gap-4">
                        <input type="text" id='ram' placeholder='Ram' autoComplete='off' className='p-3 rounded-lg' />
                        <input type="text" id='storage' placeholder='Storage' autoComplete='off' className='p-3 rounded-lg' />
                        <input type="text" id='processor' placeholder='Processor' autoComplete='off' className='p-3 rounded-lg' />
                    </div>
                    <div className="camera flex flex-col gap-4">
                        <input type="text" id='camera' placeholder='Camera' autoComplete='off' className='p-3 rounded-lg' />
                        <input type="text" id='battery' placeholder='Battery' autoComplete='off' className='p-3 rounded-lg' />
                    </div>
                    <input type="number" placeholder='Price' id='price' autoComplete='off' className='p-3 rounded-lg' />
                    <input type="number" placeholder='% discount' id='discount' autoComplete='off' className='p-3 rounded-lg ' />
                    <input type="text" id='warranty' placeholder='Waranty' className='p-3 rounded-lg' />
                    <input type="text" id='seller' placeholder='Seller Info' className='p-3 rounded-lg' />
                </div>
                <div className="image flex flex-col gap-4 border-2 border-black p-3">
                    <div className="flex flex-col gap-4">
                        <h3 className="">Images: The first image will be the cover</h3>
                        <div className="flex gap-2">
                            <input onChange={(e) => setFiles(e.target.files)} type="file" id='image' name='image' className='px-3 py-2 border border-black rounded-md' accept='image/*' multiple />
                            <button onClick={handleImageSubmit} type='button' className="px-3 py-2 border-2 border-blue-500 text-blue-500 rounded-md">{uploading ? 'Uploading...' : 'Upload'}</button>
                        </div>
                        {imageUploadError && (
                            <p className="text-red-700 text-sm font-semibold">{imageUploadError}</p>
                        )}
                        {formData.image.length > 0 && (
                            <div className="flex flex-wrap gap-2 w-[24rem]">
                                {formData.image.map((url, index) => (
                                    <div key={url} className="relative">
                                        <img src={url} alt="" className="w-20 inline-block" />
                                        <button type='button' onClick={()=> handleRemoveImage(index)} className='absolute bottom-[4px] right-[2px] bg-red-700 text-white rounded-md text-xl'><MdDelete /></button>
                                    </div>
                        ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="">Other Colors:</h3>
                        <div className="flex gap-2">
                            <input onChange={(e) => setColors(e.target.files)} type="file" id='color' name='color' className='px-3 py-2 border border-black rounded-md' accept='image/*' multiple />
                            <button type='button' className="px-3 py-2 border-2 border-blue-500 text-blue-500 rounded-md">Upload</button>
                        </div>
                    </div>
                    <button className='bg-blue-700 text-white uppercase p-3 rounded-lg font-semibold hover:opacity-95'>Add Product</button>
                </div>
            </form>
        </div>
    )
}
