import React, { useEffect, useState } from 'react';
import logo from "../../assests/CargoLogo.png";
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ userName, userEmail }) => {
  const [userRole, setUserRole] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, []);

  const navItems = [
    { name: "All Orders", path: "/user-dashboard" },
    { name: "New Quote", path: "/Add_Quote" },
    { name: "Members", path: "/members" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu on navigation
  };

  // Filter out "New Quote" for freightAgent role
  const filteredNavItems = userRole === "freightAgent" 
    ? navItems.filter(item => item.name !== "New Quote")
    : navItems;

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.100.20:5056/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-[#F4F4FB] shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50 py-0">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="CargoConnect Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-900">Cargo Connect</span>
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
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path} 
                  className={`flex items-center block relative bg-[linear-gradient(transparent,transparent),linear-gradient(#3b82f6,#3b82f6)] 
                    bg-[length:100%_3px,0_3px] bg-[position:100%_100%,0_100%] bg-no-repeat
                    transition-[background-size,color] duration-500 hover:bg-[0_3px,100%_4px]
                      ${location.pathname === item.path 
                        ? 'text-[#3b82f6] bg-[length:100%_3px,100%_3px] bg-[linear-gradient(#3b82f6, #3b82f6)] bg-[100%_3px,50%_4px] font-bold bg-[position:0_100%,50%_100%]'
                        : 'text-neutral-950'}`
                  }
                >
                  {item.name}
                </a>
              </li>
            ))}
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
              className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu COntent */}
            <nav className='w-[100%] fixed top-16 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto lg-hidden transition-all duration-300 ease-in-out'>
              <ul className='flex flex-col space-y-4 p-6'>
                {filteredNavItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-colors 
                          ${
                            location.pathname === item.path
                              ? 'bg-blue-100 text-blue-700 font-semibold'
                              : 'text-gray-800 hover:bg-gray-100'
                            }`}
                      >
                        {item.name}
                      </button>
                  </li>
                ))}

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