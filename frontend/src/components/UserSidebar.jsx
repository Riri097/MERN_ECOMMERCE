import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaTimes, FaUser, FaSignOutAlt, FaList } from 'react-icons/fa';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { clearCartItems } from '../slices/cartSlice';

const UserSidebar = ({ isOpen, onClose, userInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(clearCartItems());
      navigate('/login');
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Overlay (Dark background) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" 
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 w-80 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex justify-between items-center mb-8">
          <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
            Menu
          </h5>
          <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="py-4 overflow-y-auto">
          {userInfo ? (
            <ul className="space-y-2 font-medium">
              <li className="px-2 py-2 mb-4 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-500 dark:text-gray-400">Signed in as</span>
                <div className="font-bold text-gray-900 dark:text-white truncate">{userInfo.email}</div>
              </li>
              
              <li>
                <Link to="/profile" onClick={onClose} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <FaUser className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="flex-1 ml-3 whitespace-nowrap">My Profile</span>
                </Link>
              </li>
              
              {/* Add My Orders link here later */}
              
              <li>
                <button onClick={logoutHandler} className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 group">
                  <FaSignOutAlt className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-500" />
                  <span className="flex-1 ml-3 whitespace-nowrap text-left group-hover:text-red-600 dark:group-hover:text-red-500">Logout</span>
                </button>
              </li>
            </ul>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-gray-500">Sign in to manage your account.</p>
              <Link 
                to="/login" 
                onClick={onClose}
                className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
              <div className="mt-4">
                <Link to="/register" onClick={onClose} className="text-blue-600 hover:underline">
                  Create an account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSidebar;