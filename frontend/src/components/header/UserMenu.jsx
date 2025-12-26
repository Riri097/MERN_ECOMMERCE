import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { logout } from '../../slices/authSlice';

const UserMenu = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  // 1. If not logged in, show Sign In link
  if (!userInfo) {
    return (
      <Link to="/login" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-500 font-medium">
        <FaUser /> <span>Sign In</span>
      </Link>
    );
  }

  // 2. If logged in (User OR Admin), show the Dropdown
  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 focus:outline-none"
      >
        <span className="font-medium">{userInfo.name}</span>
        <FaChevronDown size={12} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
          
          {/* --- ADMIN LINKS (Only visible if Admin) --- */}
          {userInfo.role === 'admin' && (
            <>
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Admin Panel
              </div>
              <Link 
                to="/admin/productlist" 
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/admin/userlist" 
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Users
              </Link>
              <Link 
                to="/admin/orderlist" 
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Orders
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            </>
          )}
          {/* ----------------------------------------- */}

          {/* --- STANDARD USER LINKS --- */}
          <Link 
            to="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
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
  );
};

export default UserMenu;