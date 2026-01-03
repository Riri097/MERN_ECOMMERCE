import { useEffect } from 'react'; 
import { useSelector } from 'react-redux'; 
import { Outlet } from 'react-router-dom';
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

  const isAdmin = userInfo && userInfo.role === 'admin';

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

  // --- LAYOUT 1: ADMIN DASHBOARD ---
  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
        <AdminSidebar />
        <main className="flex-1 py-3 px-4">
          <Outlet />
        </main>
        <ToastContainer />
      </div>
    );
  }

  // --- LAYOUT 2: CUSTOMER STOREFRONT ---
  return (
    // CHANGED: dark:bg-gray-900 -> dark:bg-black (Pure Black)
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Removed onOpenUserSidebar prop */}
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