import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assests/basilurlogo.png"; // Import logo
import { FaCaretDown } from "react-icons/fa"; // Import caret down icon for dropdown
import { jwtDecode } from 'jwt-decode'; // Ensure this is the correct import

const Layout = ({ children }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
    const [userRole, setUserRole] = useState(null); // State to store user role
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      console.log(token);
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.roleName); // Set user role from token
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }, []);
  
    return (
      <div
        className="font-sans min-h-screen flex flex-col"
        style={{
          backgroundColor: "#FFFFFF",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Header */}
        <header
          className="flex items-center justify-center p-2 mx-auto"
          style={{
            backgroundColor: "#191919", // Black header background
            color: "#FFFFFF", // White font color
            borderRadius: "30px", // Rounded header corners
            height: "50px", // Smaller header height
            width: "85%", // Header width
            marginTop: "20px", // Space from top
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
            paddingTop: "5px", // Adjust padding for compact header
            paddingBottom: "5px", // Adjust padding for compact header
          }}
        >
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="mr-4"
            style={{
              width: "40px", // Logo size
              height: "40px",
              objectFit: "contain",
            }}
          />
          {/* Title */}
          <h1
            className="text-lg font-bold flex-1 text-center"
            style={{
              color: "#FFFFFF", // White text color
            }}
          >
            Freight Allocation
          </h1>
        </header>
  
        {/* Navigation Bar */}
        <div
          className="mt-8 w-85%"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ul className="flex space-x-4 justify-center items-center flex-grow">
            <li className="relative">
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline flex items-center"
                style={{
                  transition: "all 0.3s ease",
                }}
                onClick={() => setDropdownVisible(!isDropdownVisible)} // Toggle dropdown visibility
              >
                Orders <FaCaretDown className="ml-2" />
              </button>
              {isDropdownVisible && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg"
                  style={{
                    zIndex: 10,
                  }}
                >
                  <ul>
                    <li>
                      <Link to="/completed" className="block px-4 py-2 text-black hover:bg-orange-500">
                        Completed
                      </Link>
                    </li>
                    <li>
                      <Link to="/add-new-order" className="block px-4 py-2 text-black hover:bg-orange-500">
                        Due Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/view-freight-agents" className="block px-4 py-2 text-black hover:bg-orange-500">
                        View Freight Agents
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <span className="text-orange-500">|</span>
            <li>
              <Link to="/add-freight-agent">
                <button
                  className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                  style={{
                    transition: "all 0.3s ease",
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
                    transition: "all 0.3s ease",
                  }}
                >
                  Add Freight Coordinator
                </button>
              </Link>
            </li>
            {userRole !== "mainUser" && ( // Conditionally render the Add Main User link
              <>
                <span className="text-orange-500">|</span>
                <li>
                  <Link to="/add-main-user">
                    <button
                      className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                      style={{
                        transition: "all 0.3s ease",
                      }}
                    >
                      Add Main User
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
  
        {/* Main Content */}
        <main className="flex-grow">{children}</main>
  
        {/* Footer */}
        <footer
          className="p-4 text-center mt-auto"
          style={{
            backgroundColor: "transparent", // Transparent background
            color: "#191919", // Black text
            fontSize: "14px",
            marginTop: "20px",
          }}
        >
          © {new Date().getFullYear()} Freight Allocation. All Rights Reserved.
        </footer>
      </div>
    );
  };
  
  export default Layout;