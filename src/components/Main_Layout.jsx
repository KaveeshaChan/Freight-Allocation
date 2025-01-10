import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assests/basilurlogo.png';
import { FaCaretDown } from 'react-icons/fa';

const Layout = ({ children }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const hideTimeout = useRef(null);
  const location = useLocation(); // Get the current route
  const currentPage = location.pathname;
  // Retrieve the role from localStorage
  const userRole = localStorage.getItem("userRole");


  const handleMouseEnter = () => {
    clearTimeout(hideTimeout.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setHovered(false), 200);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown-container')) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(hideTimeout.current);
    };
  }, []);

  return (
    <div
      className="font-sans min-h-screen flex flex-col"
      style={{
        backgroundColor: '#FFFFFF',
        margin: 0,
        padding: 0,
      }}
    >
      <div
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          paddingBottom: '20px',
        }}
      >
        <header
          className="flex items-center justify-center p-2 mx-auto"
          style={{
            backgroundColor: '#191919',
            color: '#FFFFFF',
            borderRadius: '30px',
            height: '50px',
            width: '85%',
            marginTop: '20px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}
        >
          <img
            src={logo}
            alt="Logo"
            className="mr-4"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
            }}
          />
          <h1
            className="text-lg font-bold flex-1 text-center"
            style={{
              color: '#FFFFFF',
            }}
          >
            Freight Allocation
          </h1>
        </header>

        <nav
          className="w-85%"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <ul className="flex space-x-4 justify-center items-center flex-grow">
            <li
              className="relative dropdown-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline flex items-center"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                In Progress <FaCaretDown className="ml-2" />
              </button>
              {(isHovered || isDropdownVisible) && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg"
                  style={{
                    zIndex: 10,
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <ul>
                    <li
                      className={
                        currentPage === '/In-Progress' ? 'blur text-gray-400' : ''
                      }
                    >
                      <Link
                        to="/In-Progress"
                        className="block px-4 py-2 text-black hover:bg-orange-500"
                      >
                        In Progress
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/completed"
                        className="block px-4 py-2 text-black hover:bg-orange-500"
                      >
                        Completed
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/add-document"
                        className="block px-4 py-2 text-black hover:bg-orange-500"
                      >
                        Add New Order
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/view-freight-agents"
                        className="block px-4 py-2 text-black hover:bg-orange-500"
                      >
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
            {userRole === 'admin' && (
              <>
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
              </>
            )}
          </ul>
        </nav>
      </div>

      <main className="flex-grow">{children}</main>

      <footer
        className="p-4 text-center mt-auto"
        style={{
          backgroundColor: 'transparent',
          color: '#191919',
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
