import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { clearCartItems } from '../slices/cartSlice';
import SearchBox from './SearchBox';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(clearCartItems());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
<header className="bg-white/80 dark:bg-black backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* 1. Logo */}
        <Link to="/" className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-wider flex items-center gap-2">
          <span className="text-blue-600 dark:text-blue-400">SHOP</span>EASY
        </Link>

        {/* 2. Search Bar */}
        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <SearchBox />
        </div>

        {/* 3. Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          
          

          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white font-medium transition">Home</Link>
          <Link to="/search/electronics" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white font-medium transition">Shop</Link>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition transform hover:scale-110"
          >
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition">
            <FaShoppingCart className="text-xl" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* User Profile Dropdown */}
          {userInfo ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white font-medium focus:outline-none">
                <FaUser />
                <span>{userInfo.name.split(' ')[0]}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right border border-gray-100 dark:border-gray-700">
                <Link to="/profile" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                {userInfo.isAdmin && (
                  <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Admin Dashboard</Link>
                )}
                <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white font-medium">Sign In</Link>
          )}
        </nav>

        {/* 4. Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
           {/* Mobile Theme Toggle */}
           <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          
          <button 
            className="text-gray-600 dark:text-white text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4 px-4 space-y-4">
           <SearchBox />
           <Link to="/" className="block text-gray-300 py-2">Home</Link>
           <Link to="/cart" className="block text-gray-300 py-2">Cart ({cartItems.length})</Link>
           {userInfo ? (
             <>
               <Link to="/profile" className="block text-gray-300 py-2">Profile</Link>
               <button onClick={logoutHandler} className="block text-red-500 py-2">Logout</button>
             </>
           ) : (
             <Link to="/login" className="block text-gray-300 py-2">Sign In</Link>
           )}
        </div>
      )}
    </header>
  );
};

export default Header;