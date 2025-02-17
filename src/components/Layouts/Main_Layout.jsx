import React, { useState, useEffect } from 'react';
import logo from "../../assests/CargoLogo.png";

const Header = () => {
  const currentPath = window.location.pathname;
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAddUserDropdownOpen, setAddUserDropdownOpen] = useState(false);
  const [isViewUserDropdownOpen, setViewUserDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user role from local storage
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const navItems = [
    { name: "All Orders", path: "/All-Orders" },
    { name: "Add New Order", path: "/add-new-order" },
  ];

  const handleUserDropdown = () => {
    setUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleAddUserDropdown = () => {
    setAddUserDropdownOpen(!isAddUserDropdownOpen);
  };

  const handleViewUserDropdown = () => {
    setViewUserDropdownOpen(!isViewUserDropdownOpen);
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="CargoConnect Logo" className="h-8 w-8" />
          <span className="text-lg font-bold text-gray-900 tracking-tighter">
            CargoConnect
          </span>
          <span className="text-sm text-blue-700">  Main Portal</span>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-6">
          {navItems.map((item) => (
            <a 
              key={item.path} 
              href={item.path} 
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group
                ${currentPath === item.path ? "bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg" : "text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white"}`}
            >
              {item.name}
            </a>
          ))}
          <div className="relative">
            <button
              onClick={handleUserDropdown}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group
                ${isUserDropdownOpen ? "bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg" : "text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white"}`}
            >
              Users
            </button>
            {isUserDropdownOpen && (
              <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button onClick={handleAddUserDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Add User</button>
                {isAddUserDropdownOpen && (
                  <div className="pl-4">
                    {userRole === 'admin' && (
                      <a href="/add-main-user" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add Main User</a>
                    )}
                    <a href="/add-freight-agent" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add Freight Agent</a>
                    <a href="/add-freight-coordinator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add Freight Coordinator</a>
                  </div>
                )}
                <button onClick={handleViewUserDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">View User</button>
                {isViewUserDropdownOpen && (
                  <div className="pl-4">
                    <a href="/View_Main_User" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Main User</a>
                    <a href="/view-freight-agents" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Freight Agents</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Logout Button */}
        <a 
          href="/logout" 
          className="px-4 py-2 border border-gray-400 rounded-full text-gray-900 font-medium hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white transition-all"
        >
          Log Out
        </a>
      </div>
    </header>
  );
};

export default Header;