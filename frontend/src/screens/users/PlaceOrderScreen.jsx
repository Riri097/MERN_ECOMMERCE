import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import CheckoutSteps from '../../components/CheckoutSteps';
import { useCreateOrderMutation } from '../../slices/ordersApiSlice';
import { clearCartItems } from '../../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // --- PRICE CALCULATOR ---
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10); // Free shipping over $100
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);
  // ------------------------

  useEffect(() => {
    if (!cart.shippingAddress) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    // --- FAKE PAYMENT CONFIRMATION ---
    const confirmed = window.confirm(`Confirm payment of $${totalPrice}?`);
    
    if (confirmed) {
      try {
        const res = await createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress, // Sending simple string
          paymentMethod: cart.paymentMethod,
          itemsPrice: itemsPrice,
          shippingPrice: shippingPrice,
          taxPrice: taxPrice,
          totalPrice: totalPrice,
        }).unwrap();

        dispatch(clearCartItems());
        navigate(`/order/${res._id}`);
        toast.success('Order Placed Successfully!');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Shipping Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Shipping</h2>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Address: </strong>
              {/* Displaying the simple string address */}
              {cart.shippingAddress}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Payment Method</h2>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <Link to={`/product/${item._id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Summary */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Order Summary</h2>
            
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Items</span>
                <span>${itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-800 dark:text-white border-t pt-3 dark:border-gray-700">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {error && <div className="text-red-500 mt-4">{error?.data?.message || error.error}</div>}

            <button
              type="button"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition shadow-lg"
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;