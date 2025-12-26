import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements,Route, RouterProvider, } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VerifyScreen from './screens/VerifyScreen';

import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/admin/ProductListScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element= {<LoginScreen/>}/>
      <Route path="/register" element={<RegisterScreen />} /> 
      <Route path="/verify" element={<VerifyScreen />} /> 

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        {/* We will add ProductEditScreen here next */}
      </Route> 
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store= {store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);