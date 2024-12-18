import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assests/basilurlogo.png'; // Ensure the logo path is correct

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [displayedText] = useState('Basilur Tea Exports (Pvt) Ltd.');
  const navigate = useNavigate();

  useEffect(() => {
    // Reduce the interval time for a faster loading animation
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 2); // Increment progress by 2 to make it fill faster
      } else {
        clearInterval(interval); // Stop the interval when progress reaches 100%
        setTimeout(() => {
          navigate('/login'); // Redirect to the login page after a short delay
        }, 1000); // Wait 1 second before redirecting
      }
    }, 30); // Speed of progress bar increment, reduced to 30ms for faster animation

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [progress, navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Logo */}
      <img src={logo} alt="Logo" className="h-64 mb-4" />

      {/* Display the company name */}
      <span
        className="text-4xl font-bold"
        style={{
          color: '#191919', // Text color set to #191919
        }}
      >
        {displayedText}
      </span>

      {/* Loading bar */}
      <div className="w-80 mt-8">
        <div
          className="bg-gray-200 h-4 rounded-full"
          style={{
            width: '100%',
            backgroundColor: '#e0e0e0',
          }}
        >
          <div
            className="bg-orange-500 h-4 rounded-full"
            style={{
              width: `${progress}%`, // Width of the loading bar based on progress
            }}
          />
        </div>
        {/* Display percentage text in orange */}
        <p className="text-center text-lg mt-2 text-orange-500">{progress}%</p>
      </div>
    </div>
  );
};

export default LoadingPage;
