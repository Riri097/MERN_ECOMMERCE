import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaUser, FaSun, FaMoon, FaSearch, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
  // State for UI toggles
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Dropdown state

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] }); // Safety check

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  
  // Ref to close dropdown when clicking outside
  const dropdownRef = useRef(null);

  // Dark Mode Logic
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = async () => {
    try {
      //unwrap will get the real result or throw error
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
      setIsProfileOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. LOGO */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tighter">
              Ecommerce<span className="text-gray-700 dark:text-white">SHOP</span>
            </span>
          </Link>

          {/* 2. SEARCH BAR (Hidden on mobile) */}
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

          {/* 3. ICONS & ACTIONS */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition">
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-blue-500 transition">
              <FaShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 focus:outline-none"
                >
                  <span className="font-medium">{userInfo.name}</span>
                  <FaChevronDown size={12} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-500 font-medium">
                <FaUser /> <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-white focus:outline-none">
               {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pt-2 pb-4 space-y-2 border-t dark:border-gray-700">
           {/* Mobile Search */}
           <div className="mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none"
              />
           </div>
           
           <Link to="/cart" className="block text-gray-700 dark:text-gray-200 py-2">Cart</Link>
           {userInfo ? (
             <>
               <Link to="/profile" className="block text-gray-700 dark:text-gray-200 py-2">Profile</Link>
               <button onClick={logoutHandler} className="block w-full text-left text-red-500 py-2">Logout</button>
             </>
           ) : (
             <Link to="/login" className="block text-gray-700 dark:text-gray-200 py-2">Sign In</Link>
           )}
        </div>
      )}
    </header>
  );
};

export default Header;