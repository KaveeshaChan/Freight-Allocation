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
    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group flex items-center gap-1
      ${isUserDropdownOpen 
        ? "bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg" 
        : "text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white"
      }`}
  >
    Users
    <svg
      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
        isUserDropdownOpen ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>
  
  {isUserDropdownOpen && (
    <div className="absolute mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-10 divide-y divide-gray-100">
      <div className="py-1">
        <button 
          onClick={handleAddUserDropdown}
          className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {isAddUserDropdownOpen && (
          <div className="ml-4 border-l-2 border-blue-100">
            {userRole === 'admin' && (
              <a href="/add-main-user" className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Main User
              </a>
            )}
            <a href="/add-freight-agent" className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Freight Agent
            </a>
            <a href="/add-freight-coordinator" className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Coordinator
            </a>
          </div>
        )}
      </div>

      <div className="py-1">
        <button
          onClick={handleViewUserDropdown}
          className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Users
          </span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {isViewUserDropdownOpen && (
          <div className="ml-4 border-l-2 border-purple-100">
            <a href="/View_Main_User" className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Main Users
            </a>
            <a href="/view-freight-agents" className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Freight Agents
            </a>
          </div>
        )}
      </div>
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