import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from "../../assests/CargoLogo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAddUserDropdownOpen, setAddUserDropdownOpen] = useState(false);
  const [isViewUserDropdownOpen, setViewUserDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/Admin-Dashboard" },
    { name: "All Orders", path: "/All-Orders" },
    { name: "Add New Order", path: "/add-new-order" },
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const response = await fetch('http://localhost:5056/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
      if (response.ok) {
        localStorage.clear();
        window.location.href = '/login';
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
          <span className="text-xl font-bold text-gray-900">Cargo Connect - <span className="text-lg font-semibold
           text-blue-700">Main Portal</span></span>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navbar Links */}
        <nav className={`lg:flex ${isMenuOpen ? "block" : "hidden"} absolute lg:relative top-16 lg:top-auto left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none p-4 lg:p-0`}>
          <ul className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <a href={item.path} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white rounded-lg transition">
                  {item.name}
                </a>
              </li>
            ))}
            
            {/* Users Dropdown */}
            <li className="relative">
              <button onClick={() => setUserDropdownOpen(!isUserDropdownOpen)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r from-[#0534F0] to-[#98009E] rounded-lg transition">
                Users
              </button>
              {isUserDropdownOpen && (
                <ul
                  className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 
                      transition-all duration-300 ease-out transform 
                      ${isUserDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                >
                  {/* Add User */}
                  <li>
                    <button
                      onClick={() => setAddUserDropdownOpen(!isAddUserDropdownOpen)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Add User
                    </button>
                    {isAddUserDropdownOpen && (
                    <ul
                      className={`ml-4 border-l border-blue-200 transition-all duration-200 transform 
                        ${isAddUserDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                    {userRole === "admin" && (
                  <li>
              <a
                href="/add-main-user"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
              >
                Main User
              </a>
            </li>
          )}
          <li>
            <a
              href="/add-freight-agent"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
            >
              Freight Agent
            </a>
          </li>
          <li>
            <a
              href="/add-freight-coordinator"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
            >
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
        <ul
          className={`ml-4 border-l border-purple-200 transition-all duration-200 transform 
            ${isViewUserDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <li>
            <a
              href="/view_Main_User"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
            >
              Main Users
            </a>
          </li>
          <li>
            <a
              href="/view-freight-agents"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
            >
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
              <button onClick={handleLogout} className="px-4 py-2 border border-gray-400 rounded-full text-gray-900 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white transition">
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;