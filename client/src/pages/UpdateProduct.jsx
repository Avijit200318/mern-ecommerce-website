import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import Footer from '../components/Footer';

export default function UpdateProduct() {
    const [files, setFiles] = useState([]);
    const [colors, setColors] = useState([]);
    const [formData, setFormData] = useState({
        image: [],
        color: [],
        name: '',
        type: 'other',
        discount: '',
        price: '',
        ram: '',
        storage: '',
        battery: '',
        camera: '',
        processor: '',
        waranty: '',
        delivaryFee: true,
        seller: '',
        description: '',
    });
    // console.log(formData);

    const [imageUploadError, setImageUploadError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [colorUploadError, setColorUploadError] = useState(null);
    const [colorLoading, setColorLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setPageLoading(true);
            const productId = params.productId;
            const res = await fetch(`/api/product/getProduct/${productId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                setPageLoading(false);
                return;
            };
            setFormData(data);
            setPageLoading(false);
        };

        fetchProduct();

    }, []);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.image.length < 6) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, image: formData.image.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => {
                setImageUploadError("Image upload failed (2 MB max per image)");
                setUploading(false);
            });
        } else {
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
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`upload is ${progress}`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl);
                    });
                }
            )
        })
    };

    const handleRemoveImage = async (index, url) => {
        setFormData({
            ...formData,
            image: formData.image.filter((_, i) => i !== index),
        });

        // delete image from firebase database.
        const storage = getStorage(app);
        // Extracting the file name from the URL
        const decodedUrl = decodeURIComponent(url); // Decode the URL
        const fileName = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1).split('?')[0];

        console.log("file name is ", fileName);
        const storageRef = ref(storage, fileName);
        try {
            await deleteObject(storageRef);
            console.log("File deleted successfully");
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const handleChange = (e) => {
        if (e.target.id === 'delivaryFee') {
            setFormData({
                ...formData,
                delivaryFee: !formData.delivaryFee,
            })
        } else {
            if (e.target.id) {
                setFormData({
                    ...formData,
                    type: e.target.id,
                })
            }
        };

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.image.length < 1)
                return setError('You must upload at least one image');
            if (formData.discount > 100)
                return setError('Discount % always less than 100%');
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/product/update/${params.productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }
            navigate(`/product/${data._id}`)

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleColorSubmit = (e) => {
        if (colors.length > 0 && colors.length + formData.color.length < 6) {
            setColorLoading(true);
            setColorUploadError(false);
            const promises = [];

            for (let i = 0; i < colors.length; i++) {
                promises.push(storeImage(colors[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, color: formData.color.concat(urls)
                });
                setColorLoading(false);
                setColorUploadError(false);
            }).catch((error) => {
                setColorUploadError("Image upload failed (2 MB max per image)");
                setColorLoading(false);
            });
        } else {
            setColorUploadError("You can only upload 5 images");
            setColorLoading(false);
        }
    };
    const handleRemoveColor = async (index, url) => {
        setFormData({
            ...formData,
            color: formData.color.filter((_, i) => i !== index),
        });

        // delete file from firebase database.
        const storage = getStorage(app);
        // Extracting the file name from the URL
        const decodedUrl = decodeURIComponent(url); // Decode the URL
        const fileName = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1).split('?')[0];

        console.log("file name is ", fileName);
        const storageRef = ref(storage, fileName);
        try {
            await deleteObject(storageRef);
            console.log("File deleted successfully");
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return (
        <div>
            {pageLoading && (
                <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
                <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
              </div>
            )}
            {!pageLoading && (
                <div className='py-3 flex flex-col items-center bg-[#DCF2F1] sm:p-3'>
                    <h1 className='text-3xl text-center my-6 font-semibold'>Update Product</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full sm:w-[80%] md:w-auto lg:flex-row">
                        <div className="flex flex-col gap-4 p-3">
                            <input type="text" onChange={handleChange} value={formData.name} placeholder='Name' id='name' autoComplete='off' className='p-3 rounded-lg border border-black' required />
                            <textarea id="description" onChange={handleChange} value={formData.description} placeholder='Description' cols="30" className='resize-none rounded-lg p-3 border border-black' ></textarea>

                            <div className="typeCheckBox w-full flex flex-wrap gap-6 sm:w-[26rem]">
                                <div className="flex gap-2">
                                    <input type="checkbox" onChange={handleChange} checked={formData.type === 'computer'} id='computer' className='w-5' />
                                    <span>Computer</span>
                                </div>
                                <div className="flex gap-2">
                                    <input type="checkbox" onChange={handleChange} checked={formData.type === 'phone'} id='phone' className='w-5' />
                                    <span>Phone</span>
                                </div>
                                <div className="flex gap-2">
                                    <input type="checkbox" onChange={handleChange} checked={formData.type === 'camera'} id='camera' className='w-5' />
                                    <span>Camera</span>
                                </div>
                                <div className="flex gap-2">
                                    <input type="checkbox" onChange={handleChange} checked={formData.type === 'bag'} id='bag' className='w-5' />
                                    <span>Bag</span>
                                </div>
                                <div className="flex gap-2">
                                    <input type="checkbox" onChange={handleChange} checked={formData.type === 'boots'} id='boots' className='w-5' />
                                    <span>Boots</span>
                                </div>
                                <div className="flex gap-2">
                                    <input type="checkbox" onChange={handleChange} checked={formData.type === 'headset'} id='headset' className='w-5' />
                                    <span>Head Set</span>
                                </div>
                                <div className="flex gap-2">
                                    <input type="checkbox" onChange={handleChange} checked={formData.type === 'other'} id='other' className='w-5' />
                                    <span>others</span>
                                </div>
                            </div>

                            <div className="offerCheckBox my-4">
                                <div className="flex gap-2">
                                    <input type="checkbox" onChange={handleChange} checked={formData.delivaryFee} id='delivaryFee' className='w-5' />
                                    <span>Extra Delivary Charge ( &#8377;40 extra )</span>
                                </div>
                            </div>
                            {
                                (formData.type === 'computer' || formData.type === 'phone') && (
                                    <div className="elec flex flex-col gap-4">
                                        <input type="text" onChange={handleChange} value={formData.ram} id='ram' placeholder='Ram' autoComplete='off' className='p-3 rounded-lg border border-black' />
                                        <input type="text" onChange={handleChange} value={formData.storage} id='storage' placeholder='Storage' autoComplete='off' className='p-3 rounded-lg border border-black' />
                                        <input type="text" onChange={handleChange} value={formData.processor} id='processor' placeholder='Processor' autoComplete='off' className='p-3 rounded-lg border border-black' />
                                    </div>
                                )
                            }
                            {
                                (formData.type === 'computer' || formData.type === 'phone' || formData.type === 'camera') && (
                                    <div className="camera flex flex-col gap-4">
                                        <input type="text" onChange={handleChange} value={formData.camera} id='camera' placeholder='Camera' autoComplete='off' className='p-3 rounded-lg border border-black' />
                                        <input type="text" onChange={handleChange} value={formData.battery} id='battery' placeholder='Battery' autoComplete='off' className='p-3 rounded-lg border border-black' />
                                    </div>
                                )
                            }
                            <input type="number" onChange={handleChange} value={formData.price} placeholder='Price' id='price' autoComplete='off' className='p-3 rounded-lg border border-black' required />
                            <input type="number" onChange={handleChange} value={formData.discount} placeholder='% discount' id='discount' autoComplete='off' className='p-3 rounded-lg border border-black ' required />
                            <input type="text" onChange={handleChange} value={formData.waranty} id='waranty' placeholder='Waranty' className='p-3 rounded-lg border border-black' required />
                            <input type="text" onChange={handleChange} value={formData.seller} id='seller' placeholder='Seller Info' className='p-3 rounded-lg border border-black' required />
                        </div>
                        <div className="image w-full flex flex-col gap-4 p-3 lg:w-[26rem]">
                            <div className="flex flex-col gap-4">
                                <h3 className="">Images: The first image will be the cover</h3>
                                <div className="flex gap-2 w-full">
                                    <input onChange={(e) => setFiles(e.target.files)} type="file" id='image' name='image' className='px-3 py-2 border border-black rounded-md w-[75%] bg-white' accept='image/*' multiple />
                                    <button disabled={uploading || colorLoading} onClick={handleImageSubmit} type='button' className="px-3 py-2 border-2 border-blue-500 text-blue-500 rounded-md truncate w-[23%]">{uploading ? 'Uploading...' : 'Upload'}</button>
                                </div>
                                {imageUploadError && (
                                    <p className="text-red-700 text-sm font-semibold">{imageUploadError}</p>
                                )}
                                {formData.image.length > 0 && (
                                    <div className="flex w-full flex-wrap gap-2 lg:w-[24rem]">
                                        {formData.image.map((url, index) => (
                                            <div key={url} className="relative">
                                                <img src={url} alt="" className="w-20 inline-block" />
                                                <button type='button' onClick={() => handleRemoveImage(index, url)} className='absolute bottom-[4px] right-[2px] bg-red-700 text-white rounded-md text-xl'><MdDelete /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-4 w-full">
                                <h3 className="">Other Colors:</h3>
                                <div className="flex gap-2">
                                    <input onChange={(e) => setColors(e.target.files)} type="file" id='color' name='color' className='px-3 py-2 border border-black rounded-md w-[75%] bg-white' accept='image/*' multiple />
                                    <button disabled={uploading || colorLoading} onClick={handleColorSubmit} type='button' className="px-3 py-2 border-2 border-blue-500 text-blue-500 rounded-md truncate w-[23%]">{colorLoading ? 'Uploading...' : 'Upload'}</button>
                                </div>
                                {colorUploadError && (
                                    <p className="text-red-700 text-sm font-semibold">{colorUploadError}</p>
                                )}
                                {formData.color.length > 0 && (
                                    <div className="flex w-full flex-wrap gap-2 lg:w-[24rem]">
                                        {formData.color.map((url, index) => (
                                            <div key={url} className="relative">
                                                <img src={url} alt="" className="w-20 inline-block" />
                                                <button type='button' onClick={() => handleRemoveColor(index, url)} className='absolute bottom-[4px] right-[2px] bg-red-700 text-white rounded-md text-xl'><MdDelete /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button disabled={loading || uploading || colorLoading} className='bg-blue-700 text-white uppercase p-3 rounded-lg font-semibold hover:opacity-95 disabled:bg-blue-500'>{loading ? 'Updating...' : 'Update Product'}</button>
                            {error && <p className='text-red-700 font-semibold text-sm'>{error}</p>}
                        </div>
                    </form>
                </div>
            )}
            <Footer />
        </div>
    )
}
