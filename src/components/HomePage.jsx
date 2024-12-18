import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assests/basilurlogo.png'; // Import logo
import { FaSearch } from 'react-icons/fa'; // Import search icon from react-icons

const Layout = ({ children }) => {
  const [isSideNavVisible, setSideNavVisible] = useState(false);
  const [isHovered, setHovered] = useState(false);

  // Function to handle the mouse entering and leaving the side nav button and content
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const handleDropdownToggle = () => {
    // Toggle the visibility of the side navigation when clicked
    setSideNavVisible(!isSideNavVisible);
  };

  return (
    <div
      className="font-sans min-h-screen flex flex-col"
      style={{
        backgroundColor: '#FFFFFF', // White background for the page
        margin: 0, // Remove any margin for the body
        padding: 0, // Remove any padding
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-center p-2 mx-auto"
        style={{
          backgroundColor: '#191919', // Black header background
          color: '#FFFFFF', // White font color
          borderRadius: '30px', // Rounded header corners
          height: '50px', // Smaller header height
          width: '85%', // Header width
          marginTop: '20px', // Space from top
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
          paddingTop: '5px', // Adjust padding for compact header
          paddingBottom: '5px', // Adjust padding for compact header
        }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="mr-4"
          style={{
            width: '40px', // Logo size
            height: '40px',
            objectFit: 'contain',
          }}
        />
        {/* Title */}
        <h1
          className="text-lg font-bold flex-1 text-center"
          style={{
            color: '#FFFFFF', // White text color
          }}
        >
          Freight Allocation
        </h1>
      </header>

      {/* Navigation Bar */}
      <div
        className="mt-4 w-85%"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ul className="flex space-x-4 justify-center items-center">
          <li>
            <Link to="/home">
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                Home
              </button>
            </Link>
          </li>
          <span className="text-orange-500">|</span>
          <li>
            <Link to="/add-freight-agent">
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                Add Freight Agent
              </button>
            </Link>
          </li>
          <span className="text-orange-500">|</span>
          <li>
            <Link to="/add-freight-coordinator">
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                Add Freight Coordinator
              </button>
            </Link>
          </li>
          <span className="text-orange-500">|</span>
          <li>
            <Link to="/add-main-user">
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                Add Main User
              </button>
            </Link>
          </li>
        </ul>
      </div>

      {/* Additional Content (Side Navigation Button and Search Bar) */}
      <div
        className="mt-4 w-85%"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2%',
        }}
      >
        {/* Side Navigation Button */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={handleDropdownToggle}
            className={`text-lg font-medium px-4 py-2 rounded shadow focus:outline-none ${
              isSideNavVisible || isHovered
                ? 'bg-orange-500 text-white'
                : 'border-2 border-orange-500 text-orange-500'
            }`}
            style={{
              transition: 'all 0.3s ease',
            }}
          >
            ☰
          </button>
          {/* Side Navigation (Dropdown Menu) */}
          {(isSideNavVisible || isHovered) && (
            <div
              className="absolute top-full left-0 mt-2 bg-white shadow-md rounded w-48"
              style={{
                zIndex: 1000, // Ensure it appears above other elements
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <ul className="flex flex-col space-y-2 p-2">
                <li>
                  <Link
                    to="/in-progress"
                    className="text-black hover:text-orange-500"
                  >
                    In Progress
                  </Link>
                </li>
                <li>
                  <Link
                    to="/completed"
                    className="text-black hover:text-orange-500"
                  >
                    Completed
                  </Link>
                </li>
                <li>
                  <Link
                    to="/add-document"
                    className="text-black hover:text-orange-500"
                  >
                    Add Document
                  </Link>
                </li>
                <li>
                  <Link
                    to="/freight-agent"
                    className="text-black hover:text-orange-500"
                  >
                    Freight Agent
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div
          className="flex items-center bg-orange-500 rounded-full px-3 py-2 shadow"
          style={{
            width: '250px', // Search bar width
          }}
        >
          <FaSearch
            className="text-white mr-2"
            style={{
              fontSize: '16px',
            }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-white border-none outline-none"
            style={{
              fontSize: '14px',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer
        className="p-4 text-center mt-auto"
        style={{
          backgroundColor: 'transparent', // Transparent background
          color: '#191919', // Black text
          fontSize: '14px',
          marginTop: '20px',
        }}
      >
        © {new Date().getFullYear()} Freight Allocation. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;
