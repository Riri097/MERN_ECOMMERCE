import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { addToCart, removeFromCart, clearCartItems } from '../../slices/cartSlice';
import { useCreateOrderMutation } from '../../slices/ordersApiSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <FaArrowLeft className="mr-2" /> Continue Shopping
      </Link>
      
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
          Your cart is empty. <Link to="/" className="font-bold underline">Go Back</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div>
                    <Link to={`/product/${item._id}`} className="font-bold text-gray-800 dark:text-white hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-sm">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    className="border rounded p-1 dark:bg-gray-700 dark:text-white"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                  <button onClick={() => removeFromCartHandler(item._id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h2>
              
              <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300">
                <span>Items:</span>
                <span>${cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-4 text-gray-600 dark:text-gray-300">
                <span>Shipping:</span>
                <span>$10.00</span>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t pt-4 mt-2">
                <span>Total:</span>
                <span>
                  ${(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) + 10).toFixed(2)}
                </span>
              </div>

              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0 || isLoading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                {isLoading ? 'Processing...' : 'Proceed To Pay'}
              </button>
            </div>
          </div>
          </div> 
        )
        } 
        </div>
       ); 
       };

export default CartScreen;