import { motion } from "framer-motion";
import { FiBell, FiLogOut } from "react-icons/fi";

function AnimatedUI() {
  return (
    <div className="flex justify-between p-4">
      {/* Navigation Links */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key="Home" className="relative">
        <button className="flex items-center font-medium px-1 py-2 transition-all text-gray-500 hover:text-blue-500 hover:scale-[1.03]">
          Home
        </button>
      </motion.div>

      {/* Notification Bell */}
      <motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="relative p-2 rounded-xl hover:bg-gray-50 transition-all group">
        <FiBell className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
        <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }} className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
          3
        </motion.span>
      </motion.button>

      {/* Sign Out Button */}
      <motion.button whileHover={{ scale: 1.05, backgroundColor: "#6B46C1" }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2 pl-4 pr-6 py-2.5 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 group">
        <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
          <FiLogOut className="w-5 h-5 transition-transform" />
        </motion.div>
        <span className="text-sm font-medium">Sign Out</span>
      </motion.button>
    </div>
  );
}

export default AnimatedUI;
