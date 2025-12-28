import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';
import UserSidebar from './components/UserSidebar';

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  
  const isAdmin = userInfo && userInfo.role === 'admin';

  // --- LAYOUT 1: ADMIN DASHBOARD ---
  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Fixed Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area (Pushed right by 64 units) */}
        <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
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
      
      <main className="flex-grow container mx-auto px-4 py-6">
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