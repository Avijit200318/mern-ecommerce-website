import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    setTimeout(()=> {
      setLoading(false);
    }, 400);
  }, []);
  return (
    <div>
      {loading && (
        <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-[#0197ff]">
        <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full h-16 w-16 animate-spin"></div>
      </div>
      )}
      {!loading && (
        <div className=''>
          <div className="w-full h-[80%] py-6 px-10">
          <h1 className="text-2xl font-semibold my-4">Welcome to NovaMart</h1>
          <p className="text-lg">At NovaMart, we're on a mission to redefine your online shopping experience. We believe that shopping should be more than just a transaction; it should be an adventure, a discovery, and a delight. With our carefully curated selection of products, seamless shopping experience, and dedication to customer satisfaction, we're here to make your shopping journey truly exceptional.</p>
          <h1 className="text-2xl font-semibold my-4">Our Story</h1>
          <p className='text-lg'>NovaMart was founded with a simple yet powerful vision: to create an online marketplace that offers not only a wide range of high-quality products but also an unparalleled level of service and convenience. Our journey began with a team of passionate individuals who shared a common goal: to transform the way people shop online.
    
            From our humble beginnings, we have grown into a thriving community of shoppers and merchants, united by our shared love for great products and exceptional service. Every day, we strive to bring you the best of the best, carefully handpicking each item to ensure it meets our rigorous standards of quality, value, and style.</p>
          <h1 className="font-semibold my-4 text-2xl">Our Values</h1>
          <p className="text-lg">Quality: We believe that quality should never be compromised. That's why we work tirelessly to source products from reputable suppliers and ensure that every item meets our stringent quality control standards.
    
            Customer Satisfaction: Your satisfaction is our top priority. Whether you have a question, a concern, or simply need assistance, our friendly and knowledgeable customer support team is here to help you every step of the way.
    
            Innovation: We're constantly pushing the boundaries of innovation to bring you the latest trends, technologies, and shopping experiences. From cutting-edge products to intuitive features, we're always looking for new ways to enhance your shopping journey.</p>
    
            <p className='text-lg py-4'>When you shop with NovaMart, you can shop with confidence, knowing that you're getting the best products, the best service, and the best value. We're committed to making your shopping experience enjoyable, effortless, and unforgettable.
            </p>
    
            <p className="font-semibold text-lg">Thank you for choosing NovaMart. Happy shopping!</p>
          </div>
            <Footer />
        </div>
      )}
    </div>
  )
}
