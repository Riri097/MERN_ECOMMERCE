import { useEffect } from 'react'; 
import { useSelector } from 'react-redux'; 
import { Outlet, useLocation } from 'react-router-dom'; // Added useLocation
import Header from './components/Header';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';
import { useProfileMutation } from './slices/usersApiSlice'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [updateProfile] = useProfileMutation();
  
  const location = useLocation(); // Get current URL path

  // FIX 1: Check for 'isAdmin' boolean (standard MERN), not 'role' string
  // FIX 2: Only use Admin Layout if user is Admin AND on an /admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminUser = userInfo && userInfo.isAdmin; 

  // --- AUTO-SAVE CART LOGIC ---
  useEffect(() => {
    if (userInfo && cartItems.length > 0) {
      const saveCartToBackend = async () => {
        try {
          const formattedCartItems = cartItems.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id || item.product 
          }));

          await updateProfile({
            _id: userInfo._id, // Ensure ID is sent
            name: userInfo.name,
            email: userInfo.email,
            cartItems: formattedCartItems, 
          }).unwrap();
        } catch (err) {
          console.error('Failed to save cart:', err);
        }
      };

      const timer = setTimeout(() => {
        saveCartToBackend();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [cartItems, userInfo, updateProfile]);

  // --- LAYOUT 1: ADMIN DASHBOARD (Only on /admin routes) ---
  if (isAdminUser && isAdminRoute) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
        <AdminSidebar />
        <main className="flex-1 py-3 px-4 overflow-y-auto">
          <Outlet />
        </main>
        <ToastContainer />
      </div>
    );
  }

  // --- LAYOUT 2: CUSTOMER STOREFRONT (For everyone else) ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
        <ToastContainer />
</div>
);
};

export default App;