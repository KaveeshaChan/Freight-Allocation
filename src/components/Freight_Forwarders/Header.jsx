import React from 'react';
import logo from "../../assests/CargoLogo.png";

const Header = ({ userName, userEmail }) => {
  const currentPath = window.location.pathname;

  const navItems = [
    { name: "Dashboard", path: "/user-dashboard" },
    { name: "New Quote", path: "/Add_Quote" },
    { name: "Members", path: "/members" },
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5056/api/logout', {
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
    <header className="bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="CargoConnect Logo" className="h-8 w-8" />
          <span className="text-lg font-bold text-gray-900 tracking-tighter">
            CargoConnect
          </span>
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
        </nav>

        {/* Logout Button */}
        <button 
        onClick={handleLogout}
        className="px-4 py-2 border border-gray-400 rounded-full text-gray-900 font-small hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white transition-all"
      >
        Log Out
      </button>
      </div>
    </header>
  );
};

export default Header;