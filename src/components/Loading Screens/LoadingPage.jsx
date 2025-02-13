import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../../assests/CargoLogo.png';

const LoadingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // Change the duration to match your animation duration

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: "#F4F4F4" }} // Neutral Light Gray as background
    >
      {/* Logo Container */}
      <div className="relative w-32 h-32 mb-8">
        <img
          src={Logo} // Replace with your logo path
          alt="Cargo Connect Logo"
          className="w-full h-full object-contain animate-pulse"
        />
      </div>

      {/* Loading Text */}
      <h1 className="text-4xl font-bold text-[#2C2C2C] mb-4">Cargo Connect</h1>

      {/* Loading Progress Bar */}
      <div className="w-64 h-2 bg-[#C057CB] rounded-full mt-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0534F0] to-[#98009E] rounded-full animate-progress"
          style={{ width: "60%" }} // Adjust width dynamically if needed
        ></div>
      </div>

      {/* Optional Subtext */}
      <p className="mt-4 text-[#2C2C2C] text-sm">Loading your cargo journey...</p>
    </div>
  );
};

export default LoadingScreen;