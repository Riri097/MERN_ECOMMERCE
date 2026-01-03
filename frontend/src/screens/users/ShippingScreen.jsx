import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../../slices/cartSlice';
import CheckoutSteps from '../../components/CheckoutSteps';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // We only need one state variable now
  const [address, setAddress] = useState(shippingAddress || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch just the string
    dispatch(saveShippingAddress(address));
    navigate('/payment');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <CheckoutSteps step1 step2 />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Shipping</h1>
      
      <form onSubmit={submitHandler} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        
        {/* Single Text Area for Full Address */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Full Delivery Address</label>
          <textarea
            required
            rows="4"
            placeholder="Enter your full address (Street, City, Zip, Country)..."
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-bold">
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default ShippingScreen;
