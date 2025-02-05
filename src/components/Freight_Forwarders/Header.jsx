import { FiLogOut, FiBell, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assests/CargoLogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const user = {
    name: "Kaveesha Chan",
    role: "Admin",
    avatar: "https://ui-avatars.com/api/?name=KC&background=2563eb&color=fff"
  };

  const notifications = [
    { id: 1, text: "New shipment request", time: "2h ago" },
    { id: 2, text: "Payment received", time: "4h ago" }
  ];

  const navigation = [
    { name: "Dashboard", path: "/mm" },
    { name: "Add New Quote", path: "/add_quote", badge: true },
    { name: "Members", path: "/members" }
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Branding & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6 text-gray-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center group cursor-pointer bg-transparent"
            >
              <div className="relative">
                <motion.img 
                  src={logo} 
                  alt="CargoConnect Logo" 
                  className="w-14 h-14  bg-transparent"
                  whileHover={{ rotate: -5, scale: 1.05 }}
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(30, 64, 175, 0.1))'
                  }}
                />
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-100/30 transition-all duration-500" />
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.path}
                  className={`flex items-center font-medium px-3 py-2 transition-colors ${
                    activeTab === item.name 
                      ? "text-blue-600" 
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                  onClick={() => setActiveTab(item.name)}
                >
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 px-2 py-1 bg-green-100/80 text-green-800 text-xs rounded-full backdrop-blur-sm">
                      New
                    </span>
                  )}
                </Link>
                {activeTab === item.name && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl hover:bg-gray-50 transition-colors relative"
                aria-label="Notifications"
              >
                <FiBell className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100/75 backdrop-blur-sm"
                  >
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 px-2 py-1">
                        Notifications
                      </h3>
                      <div className="space-y-1.5 mt-1">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className="p-2.5 rounded-lg hover:bg-gray-50/80 transition-colors cursor-pointer"
                          >
                            <p className="text-sm text-gray-700 font-medium">{notification.text}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 group pl-2 pr-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="User profile"
              >
                <div className="relative">
                  <motion.img 
                    src={user.avatar}
                    className="w-9 h-9 rounded-lg border-2 border-white shadow-sm"
                    alt="User profile"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500/90">{user.role}</p>
                </div>
                <FiChevronDown className={`text-gray-500 transition-transform ${
                  isProfileOpen ? 'rotate-180 text-blue-600' : ''
                }`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white/95 rounded-xl shadow-xl border border-gray-100/75 backdrop-blur-sm"
                  >
                    <div className="p-1.5">
                      <Link
                        to="/profile-settings"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50/80 rounded-lg transition-colors"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/team-members"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50/80 rounded-lg transition-colors"
                      >
                        Team Members
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50/80 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4 flex-shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-3 border-t border-gray-100/75 backdrop-blur-sm"
            >
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => {
                      setActiveTab(item.name);
                      setIsMenuOpen(false);
                    }}
                    className={`block px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                      activeTab === item.name 
                        ? "bg-blue-50/80 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-50/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {item.name}
                      {item.badge && (
                        <span className="px-2 py-1 bg-green-100/80 text-green-800 text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}