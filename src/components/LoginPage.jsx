import React, { useState } from 'react';
import logo from '../assests/basilurlogo.png'; // Import the logo

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // To store error message
  const [email, setEmail] = useState(""); // To store email input
  const [password, setPassword] = useState(""); // To store password input

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Clear previous errors

    // Simulating a network request (you can replace this with actual logic)
    setTimeout(() => {
      // Simple validation for demo purposes
      if (email !== "test@example.com" || password !== "password123") {
        setErrorMessage("Incorrect email or password!"); // Set error message
      }

      setIsLoading(false); // Reset loading state
    }, 3000); // Simulate a 3-second delay for the demo
  };

  return (
    <div
      className="font-sans min-h-screen flex flex-col justify-between"
      style={{
        backgroundColor: '#FFFFFF', // White background for the body
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-center p-2 mx-auto"
        style={{
          backgroundColor: '#191919', // Black header background
          color: '#FFFFFF', // White font color
          borderRadius: '30px', // Rounded corners
          height: '50px', // Smaller header height
          width: '85%', // Narrower width
          marginTop: '20px', // Space from top
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
        }}
      >
        {/* Logo inside the header */}
        <img
          src={logo}
          alt="Logo"
          className="mr-4"
          style={{
            width: '40px', // Reduced logo size
            height: '40px',
            objectFit: 'contain',
          }}
        />

        {/* Title centered in the header */}
        <h1
          className="text-lg font-bold flex-1 text-center"
          style={{
            color: '#FFFFFF', // White text color
          }}
        >
          Freight Allocation
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center">
        <div
          className="p-8 rounded-lg shadow-lg w-96"
          style={{
            background: '#FFFFFF', // Solid white background
            borderRadius: '16px', // Rounded corners
            border: '1px solid rgba(25, 25, 25, 0.1)', // Subtle border
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
          }}
        >
          <h2
            className="text-2xl mb-6 font-semibold"
            style={{
              color: '#191919', // Black text for the title
              textAlign: 'center',
            }}
          >
            Login
          </h2>
          {errorMessage && (
            <div
              className="bg-red-500 text-white text-center p-3 rounded-md mb-4"
              style={{
                backgroundColor: '#FF0000', // Red background for error
              }}
            >
              {errorMessage} {/* Display the error message */}
            </div>
          )}
          <form className="flex flex-col" onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="Email"
                className="block mb-2 text-sm"
                style={{ color: '#191919' }}
              >
                Email:
              </label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Handle email input
                className="w-full p-3 border rounded-md text-sm"
                style={{
                  borderColor: '#191919', // Black border
                  backgroundColor: '#FFFFFF', // White input background
                  color: '#191919', // Black input text
                }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-2 text-sm"
                style={{ color: '#191919' }}
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Handle password input
                className="w-full p-3 border rounded-md text-sm"
                style={{
                  borderColor: '#191919', // Black border
                  backgroundColor: '#FFFFFF', // White input background
                  color: '#191919', // Black input text
                }}
              />
            </div>
            <button
              type="submit"
              className="p-3 rounded-md text-lg cursor-pointer border-2"
              style={{
                borderColor: '#FF4D00', // Orange border
                backgroundColor: '#FF4D00', // Orange background
                color: '#FFFFFF', // White text
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#FFFFFF'; // White background on hover
                  e.target.style.color = '#FF4D00'; // Orange text on hover
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#FF4D00'; // Orange background
                  e.target.style.color = '#FFFFFF'; // White text
                }
              }}
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div
                    className="w-4 h-4 border-2 border-t-2 border-solid border-white rounded-full animate-spin"
                    style={{ borderColor: 'white', borderTopColor: '#FF4D00' }}
                  ></div>
                  <span className="ml-2">Please wait...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="p-4 text-center"
        style={{
          backgroundColor: 'transparent', // Transparent background
          color: '#191919', // Black text color
          fontSize: '14px',
          marginTop: '20px',
        }}
      >
        © {new Date().getFullYear()} Freight Allocation. All Rights Reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
