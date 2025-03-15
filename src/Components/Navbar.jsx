import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import image from "/Users/hp/Documents/React/projectS8/local/smart_irrigation_local/smart_irrigation/src/assets/untitled-5-o.avif";
import {
  ChartBarIcon,
  PlusCircleIcon,
  CogIcon,
  UserCircleIcon,
  BellIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ selectedCrop, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoverItem, setHoverItem] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state

  const routes = [
    { path: "/home", icon: HomeIcon, label: "Dashboard", color: "bg-blue-600" },
    { path: "/multi-sensor-graph", icon: ChartBarIcon, label: "Analytics", color: "bg-indigo-600" },
    { 
      path: "/addCrop", 
      icon: PlusCircleIcon, 
      label: selectedCrop ? "Change Crop" : "Add Crop", 
      color: "bg-emerald-600" 
    },
    { path: "/control-panel", icon: CogIcon, label: "Controls", color: "bg-amber-600" },
    { path: "/notifications", icon: BellIcon, label: "Alerts", color: "bg-purple-600" },
    { path: "/profile", icon: UserCircleIcon, label: "Profile", color: "bg-slate-600" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mr-3">
              <img src={image} alt="Logo" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              solidFlow
            </h1>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {routes.map((route) => (
                <motion.button
                  key={route.path}
                  onClick={() => navigate(route.path)}
                  onMouseEnter={() => setHoverItem(route.path)}
                  onMouseLeave={() => setHoverItem(null)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive(route.path) 
                      ? `${route.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-gray-900 ring-opacity-60 ${route.color.replace('bg-', 'ring-')}` 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <route.icon className="w-4 h-4" />
                  <span>{route.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-300 hover:text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <XMarkIcon className="h-6 w-6" /> : (
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 border-t border-gray-800 rounded-bl-xl absolute top-16 left-2/4 w-full"
          >
            <div className="py-3 px-5 flex flex-col space-y-2">
              {routes.map((route) => (
                <button
                  key={route.path}
                  onClick={() => {
                    navigate(route.path);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-left transition-all duration-200 text-sm font-medium ${
                    isActive(route.path) 
                      ? `${route.color} text-white` 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <route.icon className="w-5 h-5" />
                  <span>{route.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
