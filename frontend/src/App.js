import { useState, useEffect } from 'react'; 
import { useSelector,  } from 'react-redux'; 
import { Outlet,  } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';
import UserSidebar from './components/UserSidebar';
import { useProfileMutation } from './slices/usersApiSlice'; 

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [updateProfile] = useProfileMutation();

  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  
  const isAdmin = userInfo && userInfo.role === 'admin';

useEffect(() => {
    if (userInfo && cartItems.length > 0) {
      const saveCartToBackend = async () => {
        try {
          // --- FIX: Format items for Backend ---
          // The backend expects 'product' to be the ID. 
          // Sometimes frontend uses '_id' or just 'product'.
          const formattedCartItems = cartItems.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id || item.product // Ensure we send the ID as 'product'
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
      <div className="flex min-h-screen bg-gray-100 dark:bg-black">
        {/* Fixed Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area (Pushed right by 64 units) */}
        <main className="py-3">
          {/* Optional: You could add a small top bar here for Dark Mode toggle if you want */}
          <Outlet />
        </main>
      </div>
    );
  }

  // --- LAYOUT 2: CUSTOMER STOREFRONT ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header onOpenUserSidebar={() => setIsUserSidebarOpen(true)} />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />

      <UserSidebar 
        isOpen={isUserSidebarOpen} 
        onClose={() => setIsUserSidebarOpen(false)} 
        userInfo={userInfo}
      />
    </div>
  );
};

export default App;