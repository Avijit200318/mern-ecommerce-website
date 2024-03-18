import React from 'react';
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

export default function StarRating({ stars }) {
  const ratingStars = Array.from({ length: 5 }, (_, index) => {
    const number = index + 0.5;
    return (
      <span key={index}>
        {stars >= index + 1 ? (
          <IoIosStar />
        ) : stars >= number ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </span>
    );
  });

  return <div className="flex text-base text-[#fcd734]">{ratingStars}</div>;
}
