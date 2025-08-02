import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Camera,
  Database,
  History,
  Home,
  Info,
  Shield,
  Menu,
  X,
  LogOut,
} from "lucide-react";


const Navbar = () => {
  const [user, setUser] = useState(true);
  const [signOut, setSignOut] = useState(false);
  const [menuHide, setMenuHide] = useState(true);
  const location = useLocation();
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/detection", label: "Live Detection", icon: Camera },
    { path: "/history", label: "History", icon: History },
    { path: "/database", label: "Database", icon: Database },
    { path: "/admin", label: "Admin", icon: Shield },
    { path: "/about", label: "About", icon: Info },
  ];


  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setMenuHide(false); // Only close on mobile (sm)
    }
  };

  return (
    <>
      <div>
        <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold text-white max-sm:text-sm">
                NoSmoke-AI
              </span>
            </div>
            <div className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer block md:hidden">
              {menuHide ? (
                <X onClick={() => setMenuHide(false)} />
              ) : (
                <Menu onClick={() => setMenuHide(true)} />
              )}
            </div>
            <div
              className={`flex items-center max-sm:gap-2 max-sm:items-start space-x-1 max-sm:bg-gray-800  max-sm:absolute max-sm:top-16 max-sm:pt-3 max-sm:w-full max-sm:left-0 max-sm:pl-4 max-sm:pb-4 max-sm:flex-col ${
                menuHide ? "flex" : "hidden"
              } `}
            >
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                onClick={handleNavClick}
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 md:px-4 px-1 md:py-2 py-1 max-sm:text-sm  rounded-lg transition-colors ${
                    location.pathname === path
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
             
             {user && (
                <button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className=" space-x-2 md:px-4 md:ml-1 bg-red-800 px-2 max-sm:mt-1 md:py-2 py-1 max-sm:text-sm  cursor-pointer text-white border-gray-600  hover:bg-red-700"
                >
                  Logout
                </button>
              )}
             
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
