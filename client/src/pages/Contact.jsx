import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Contact() {
  const {currentUser} = useSelector((state)=> state.user);
  const [userMessage, setUserMessage] = useState({
    name: '',
    contact: currentUser.contact,
    email: currentUser.email,
    type: '',
    message: '',
  });
  console.log(userMessage);

  const handleChange = (e) => {
    setUserMessage({
      ...userMessage,
      [e.target.id]: e.target.value
    })
  }

  const adminEmail = "avijithira14@gmail.com";
  const adminName = "Avijit Hira";

  return (
    <div className='flex flex-col items-center'>
      <h1 className="text-2xl font-semibold py-6">Contact</h1>
      <div className="w-[40%]">
        <form className="flex flex-col gap-4">
          <input type="text" id='name' placeholder='name' className='border border-black py-2 px-4 rounded-md' required defaultValue={userMessage.name} onChange={handleChange}/>
          <input type="number" id='contact' placeholder='contact' className='border border-black py-2 px-4 rounded-md' defaultValue={userMessage.contact} required onChange={handleChange}/>
          <input type="email" id='email' placeholder='email' className='border border-black py-2 px-4 rounded-md' defaultValue={userMessage.email} required onChange={handleChange}/>
          <input type="text" id='type' placeholder='What type of Issue?' className='border border-black py-2 px-4 rounded-md' required  onChange={handleChange}/>
          <textarea id="message" cols="30" className="resize-none px-2 py-4 rounded-md border border-black" placeholder='Your Issue...' required defaultValue={userMessage.message} onChange={handleChange}></textarea>
          <Link to={`mailto:${adminEmail}?subject=Regarding ${userMessage.type}&body=${userMessage.message}`}>
          <button type='button' className="w-full px-4 py-2 bg-blue-500 text-white text-lg font-semibold rounded-md">Submit</button>
          </Link>
        </form>
      </div>
    </div>
  )
}
