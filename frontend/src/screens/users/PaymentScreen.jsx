import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../../slices/cartSlice';
import CheckoutSteps from '../../components/CheckoutSteps';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
      if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <CheckoutSteps step1 step2 step3 />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Payment Method</h1>
      
      <form onSubmit={submitHandler} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-4">Select Method</label>
          
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="PayPal" className="ml-2 text-gray-700 dark:text-gray-300">PayPal or Credit Card</label>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-bold">
          Continue
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;