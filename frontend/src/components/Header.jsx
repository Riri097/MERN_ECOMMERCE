import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaSearch, FaBars, FaUserCircle,FaChevronDown, FaSun, FaMoon } from 'react-icons/fa';

const Header = ({ onOpenUserSidebar }) => {
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { userInfo } = useSelector((state) => state.auth);

  // --- DARK MODE LOGIC ---
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  // -----------------------

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30 h-16 transition-colors duration-300">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* LOGO */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tighter">
              MERN<span className="text-gray-700 dark:text-white">SHOP</span>
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

          {/* RIGHT ICONS */}
          <div className="flex items-center space-x-5">
            
            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition">
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-blue-500 transition">
              <FaShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {/* User Sidebar Trigger */}
            <button
  onClick={onOpenUserSidebar}
  className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 focus:outline-none transition"
>
  {userInfo ? (
    <div className="flex items-center gap-2">
      <span className="hidden md:block font-medium text-sm max-w-[100px] truncate">
        {userInfo.name}
      </span>

      {userInfo.image ? (
        <img
          src={userInfo.image}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <FaUserCircle size={24} />
      )}

      {/* Down arrow */}
      <FaChevronDown size={12} className="opacity-70" />
    </div>
  ) : (
    <FaBars size={24} />
  )}
</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;