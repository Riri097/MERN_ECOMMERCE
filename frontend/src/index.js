import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';

// --- PUBLIC SCREENS ---
import HomeScreen from './screens/users/HomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import VerifyScreen from './screens/auth/VerifyScreen';
import ProductScreen from './screens/users/ProductScreen';
import CartScreen from './screens/users/CartScreen';
import ShopScreen from './screens/users/ShopScreen';

// --- PRIVATE SCREENS (Logged In Users) ---
import PrivateRoute from './components/PrivateRoute';
import ShippingScreen from './screens/users/ShippingScreen';
import PaymentScreen from './screens/users/PaymentScreen';
import PlaceOrderScreen from './screens/users/PlaceOrderScreen';
import OrderScreen from './screens/users/OrderScreen';
import ProfileScreen from './screens/users/ProfileScreen';

// --- ADMIN SCREENS ---
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import ProductCreateScreen from './screens/admin/ProductCreateScreen';
import DashboardScreen from './screens/admin/DashboardScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
// Note: You are missing OrderListScreen import here, we will address that later

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      
      {/* --- PUBLIC ROUTES --- */}
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} /> {/* Added Pagination */}
      <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} /> {/* Added Search + Pagination */}
      
      <Route path="/shop" element={<ShopScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/verify" element={<VerifyScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />

      {/* --- PRIVATE ROUTES (Logged In) --- */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
      </Route>

      {/* --- ADMIN ROUTES --- */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<DashboardScreen />} />
        
        {/* Products */}
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route path="/admin/productlist/:pageNumber" element={<ProductListScreen />} /> {/* Added Pagination */}
        <Route path="/admin/product/create" element={<ProductCreateScreen />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        
        {/* Users */}
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} /> {/* FIXED: Added /:id */}
        
        {/* Orders (You are missing the OrderListScreen file in your folder structure) */}
        {/* <Route path="/admin/orderlist" element={<OrderListScreen />} /> */}
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);