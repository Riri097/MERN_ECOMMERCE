import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSun, FaMoon } from 'react-icons/fa'; // Import icons

const Header = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

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
    // Use dark:bg-gray-900 to change header color in dark mode
    <header className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">
          MERN Shop
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-6">

          {/* Cart Link */}
          <Link to="/cart" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
            <FaShoppingCart className="mr-1" /> Cart
          </Link>

          {/* Login Link */}
          <Link to="/login" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
            <FaUser className="mr-1" /> Sign In
          </Link>

          {/* Dark Mode Toggle Button */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 focus:outline-none"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;