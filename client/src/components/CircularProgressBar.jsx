import React from 'react';

const CircularProgressBar = ({ rating, title }) => {
  // Calculate the progress percentage
  const progress = (rating / 5) * 100;
  // Calculate the radius and circumference
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Calculate the stroke dash offset with rotation
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const rotation = -90; // Rotate the progress bar by -90 degrees to start from the top
  const strokeWidth = 8; // Adjust the thickness of the progress bar

  return (
    <div className="">
    <div className="relative inline-block">
    <svg className="circular-progress" viewBox="0 0 100 100" width="100" height="100" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Background circle */}
      <circle cx="50" cy="50" r={radius} fill="none" stroke="#CDFADB" strokeWidth={strokeWidth} />

      {/* Progress arc */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#FDA403"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round" // Rounded end edges
      />

    </svg>
    <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl">{rating}</h1>
    </div>
    <h1 className='text-center relative -top-[10px]'>{title}</h1>
    </div>
  );
};

export default CircularProgressBar;
