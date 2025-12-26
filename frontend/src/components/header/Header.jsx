import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaSun, FaMoon, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

import UserMenu from './UserMenu';

const Header = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tighter">
              Ecommerce<span className="text-gray-700 dark:text-white">SHOP</span>
            </span>
          </Link>

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-blue-500">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setDarkMode(!darkMode)} className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-blue-500">
              <FaShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            <UserMenu userInfo={userInfo} />
          </div>

          {/* MOBILE HAMBURGER */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-white">
               {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pt-2 pb-4 space-y-2 border-t dark:border-gray-700">
           <div className="mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none"
              />
           </div>
           <Link to="/cart" className="block text-gray-700 dark:text-gray-200 py-2">Cart</Link>
           
           {/* Mobile Logic for Admin/User */}
           {userInfo && userInfo.role === 'admin' && (
             <>
               <Link to="/admin/productlist" className="block text-gray-700 dark:text-gray-200 py-2 font-bold">Admin Products</Link>
               <Link to="/admin/userlist" className="block text-gray-700 dark:text-gray-200 py-2 font-bold">Admin Users</Link>
             </>
           )}
           
           {/* We can reuse UserMenu logic or keep simple links for mobile */}
           {userInfo ? (
             <>
               <Link to="/profile" className="block text-gray-700 dark:text-gray-200 py-2">Profile</Link>
               {/* Note: Logout logic for mobile needs to be handled here or by importing UserMenu differently. 
                   For simplicity, you can keep basic links here or create a MobileMenu component later. */}
             </>
           ) : (
             <Link to="/login" className="block text-gray-700 dark:text-gray-200 py-2">Sign In</Link>
           )} </div> )} </header> ); };

export default Header;
        