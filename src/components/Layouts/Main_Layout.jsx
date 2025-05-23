import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from "../../assests/CargoLogo.png";
import { useLocation, useNavigate  } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAddUserDropdownOpen, setAddUserDropdownOpen] = useState(false);
  const [isViewUserDropdownOpen, setViewUserDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isUserActive = ["/add-main-user", "/add-freight-agent", "/add-freight-coordinator", "/view_Main_User", "/view-freight-agents"].includes(location.pathname);
  const [hideTimeout, setHideTimeout] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/Admin-Dashboard" },
    { name: "All Orders", path: "/All-Orders" },
    { name: "Add New Order", path: "/add-new-order" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu on navigation
  };

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    setUserDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 300); // 300ms delay before closing
    setHideTimeout(timeout);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5056/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
      if (response.ok) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        // console.error('Logout failed');
        window.location.href = '/login'
      }
    } catch (error) {
      // console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-[#F4F4FB] shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50 py-0">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="CargoConnect Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-900">Cargo Connect - <span className="text-lg font-semibold
           text-blue-700">Main Portal</span></span>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-gray-700 focus:outline-none" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navbar Links */}
        <nav className={`lg:flex ${isMenuOpen ? "block" : "hidden"} absolute lg:relative top-16 lg:top-auto left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none p-4 lg:p-0`}>
          <ul className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <a 
                href={item.path} 
                className={`flex items-center block relative bg-[linear-gradient(transparent,transparent),linear-gradient(#3b82f6,#3b82f6)] 
                        bg-[length:100%_3px,0_3px] bg-[position:100%_100%,0_100%] bg-no-repeat
                        transition-[background-size,color] duration-500 hover:bg-[0_3px,100%_4px]
                ${location.pathname === item.path 
                  ? 'text-[#3b82f6] bg-[length:100%_3px,100%_3px] bg-[linear-gradient(#3b82f6, #3b82f6)] bg-[100%_3px,50%_4px] font-bold bg-[position:0_100%,50%_100%]'
                  : 'text-neutral-950 '}`
                }
              >
                {item.name}
              </a>
            </li>
            ))}

            {/* Users Dropdown */}
            <li className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button
                className={`flex items-center block relative bg-[linear-gradient(transparent,transparent),linear-gradient(#3b82f6,#3b82f6)] 
                        bg-[length:100%_3px,0_3px] bg-[position:100%_100%,0_100%] bg-no-repeat
                        transition-[background-size,color] duration-500 hover:bg-[0_3px,100%_4px]
                        ${
                          isUserActive 
                            ? "text-[#3b82f6] bg-[length:100%_3px,100%_3px] bg-[linear-gradient(#3b82f6, #3b82f6)] bg-[100%_3px,50%_4px] font-bold bg-[position:0_100%,25%_100%]"
                            : "text-neutral-950"
                        }`}
              >
                Users
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M36 18L24 30L12 18" />
                </svg>
              </button>
  
              {isUserDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 transition-all duration-300 ease-out transform opacity-100 scale-100">
      
                  {/* Add User */}
                  <li>
                    <button
                      onClick={() => setAddUserDropdownOpen(!isAddUserDropdownOpen)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Add User
                    </button>
                    {isAddUserDropdownOpen && (
                    <ul className="ml-4 border-l border-blue-200 transition-all duration-200 transform opacity-100 scale-100">
                      {userRole === "admin" && (
                        <li>
                          <a href="/add-main-user" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                            Main User
                          </a>
                        </li>
                      )}
                      <li>
                        <a href="/add-freight-agent" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          Freight Agent
                        </a>
                      </li>
                      <li>
                        <a href="/add-freight-coordinator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          Coordinator
                        </a>
                      </li>
                    </ul>
                    )}
                  </li>

                  {/* View Users */}
                  <li>
                    <button
                      onClick={() => setViewUserDropdownOpen(!isViewUserDropdownOpen)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      View Users
                    </button>
                    {isViewUserDropdownOpen && (
                      <ul className="ml-4 border-l border-purple-200 transition-all duration-200 transform opacity-100 scale-100">
                        <li>
                          <a href="/view_Main_User" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                            Main Users
                          </a>
                        </li>
                        <li>
                          <a href="/view-freight-agents" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                            Freight Agents
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>
            {/* Logout Button */}
            <li>
              <button 
                onClick={handleLogout} 
                className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden 
                      rounded-full bg-[#042ccc] hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] 
                      font-medium text-neutral-200 transition-all duration-300 hover:w-32"
              >
                <div className="inline-flex whitespace-nowrap font-bold text-m opacity-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:opacity-100 ">
                  Log Out
                </div>
                <div className="absolute right-3.5 ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 15 23">
	                  <path fill="currentColor" d="M12 3.25a.75.75 0 0 1 0 1.5a7.25 7.25 0 0 0 0 14.5a.75.75 0 0 1 0 1.5a8.75 8.75 0 1 1 0-17.5" />
	                  <path fill="currentColor" d="M16.47 9.53a.75.75 0 0 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H10a.75.75 0 0 1 0-1.5h8.19z" />
                  </svg>
                </div>
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile Menu Content */}
            <nav className="w-[100%] fixed top-16 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto lg:hidden transition-all duration-300 ease-in-out">
              <ul className="flex flex-col space-y-4 p-6">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}

                {/* Mobile Users Dropdown */}
                <li className="flex flex-col">
                  <button
                    onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-colors flex justify-between items-center ${
                      isUserActive
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Users
                    <svg
                      className={`transform transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                    >
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M36 18L24 30L12 18" />
                    </svg>
                  </button>

                  {isUserDropdownOpen && (
                    <div className="ml-4 mt-2 space-y-2 border-l-2 border-blue-200 pl-4">
                      {/* Add User Dropdown */}
                      <div>
                        <button
                          onClick={() => setAddUserDropdownOpen(!isAddUserDropdownOpen)}
                          className="w-full text-left py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50 flex justify-between items-center"
                        >
                          Add User
                          <svg
                            className={`transform transition-transform ${isAddUserDropdownOpen ? 'rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                          >
                            <path fill="currentColor" d="M7 10l5 5 5-5z" />
                          </svg>
                        </button>
                        
                        {isAddUserDropdownOpen && (
                          <div className="ml-4 mt-1 space-y-1">
                            {userRole === "admin" && (
                              <button
                                onClick={() => handleNavigation("/add-main-user")}
                                className="w-full text-left py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50"
                              >
                                Main User
                              </button>
                            )}
                            <button
                              onClick={() => handleNavigation("/add-freight-agent")}
                              className="w-full text-left py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50"
                            >
                              Freight Agent
                            </button>
                            <button
                              onClick={() => handleNavigation("/add-freight-coordinator")}
                              className="w-full text-left py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50"
                            >
                              Coordinator
                            </button>
                          </div>
                        )}
                      </div>

                      {/* View Users Dropdown */}
                      <div>
                        <button
                          onClick={() => setViewUserDropdownOpen(!isViewUserDropdownOpen)}
                          className="w-full text-left py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50 flex justify-between items-center"
                        >
                          View Users
                          <svg
                            className={`transform transition-transform ${isViewUserDropdownOpen ? 'rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                          >
                            <path fill="currentColor" d="M7 10l5 5 5-5z" />
                          </svg>
                        </button>
                        
                        {isViewUserDropdownOpen && (
                          <div className="ml-4 mt-1 space-y-1">
                            <button
                              onClick={() => handleNavigation("/view_Main_User")}
                              className="w-full text-left py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50"
                            >
                              Main Users
                            </button>
                            <button
                              onClick={() => handleNavigation("/view-freight-agents")}
                              className="w-full text-left py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50"
                            >
                              Freight Agents
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>

                {/* Mobile Logout Button */}
                <li className="mt-8">
                <hr class="h-1 mx-auto m-4 mb-6 bg-blue-200 border-0 rounded-sm"></hr>
                  <div className='flex justify-center'>
                    
                  <button 
                onClick={handleLogout} 
                className="group relative inline-flex h-[50px] w-[150px] items-center justify-center overflow-hidden 
                      rounded-full bg-[#0534F0] hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] 
                      font-medium text-neutral-200 transition-all duration-300"
              >
                <div className="inline-flex whitespace-nowrap font-bold text-m opacity-100 transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-100 ">
                  Log Out
                </div>
                <div className="absolute right-3.5 ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 23">
	                  <path fill="currentColor" d="M12 3.25a.75.75 0 0 1 0 1.5a7.25 7.25 0 0 0 0 14.5a.75.75 0 0 1 0 1.5a8.75 8.75 0 1 1 0-17.5" />
	                  <path fill="currentColor" d="M16.47 9.53a.75.75 0 0 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H10a.75.75 0 0 1 0-1.5h8.19z" />
                  </svg>
                </div>
              </button>
                  </div>

                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
