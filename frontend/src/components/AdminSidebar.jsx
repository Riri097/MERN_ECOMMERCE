import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaPlusCircle, 
  FaUsers, 
  FaClipboardList, 
  FaSignOutAlt, 
  FaStore,
  FaSun,
  FaMoon,
  FaChevronRight,
  FaExternalLinkAlt 
} from 'react-icons/fa';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { clearCartItems } from '../slices/cartSlice';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

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

  const NavItem = ({ to, icon: Icon, label }) => (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center justify-between p-3 rounded-lg transition
          ${
            isActive
              ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className="flex items-center">
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 group-hover:text-blue-500'
                }`}
              />
              <span className="ml-3">{label}</span>
            </div>

            {isActive && (
              <FaChevronRight className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            )}
          </>
        )}
      </NavLink>
    </li>
  );

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-50 dark:bg-black flex flex-col border-r border-gray-200 dark:border-slate-700 transition-colors duration-300">
      
      {/* Top Brand */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center">
          <FaStore className="text-blue-600 dark:text-blue-400 text-xl mr-2" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Admin<span className="text-blue-600 dark:text-blue-400">Panel</span>
          </span>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition"
          aria-label="Toggle Theme"
        >
          {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-2">
          <NavItem to="/admin/dashboard" icon={FaTachometerAlt} label="Dashboard" />
          <NavItem to="/admin/productlist" icon={FaBoxOpen} label="All Products" />
          <NavItem to="/admin/product/create" icon={FaPlusCircle} label="Add Product" />
          <NavItem to="/" icon={FaExternalLinkAlt} label="View Live Store" />
          <NavItem to="/admin/userlist" icon={FaUsers} label="Users List" />
          <NavItem to="/admin/orderlist" icon={FaClipboardList} label="Orders" />
        </ul>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={logoutHandler}
          className="flex w-full items-center p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;
