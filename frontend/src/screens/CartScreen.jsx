import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    // Redirect to login, then to shipping
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Shopping Cart</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT COLUMN: Cart Items */}
        <div className="md:w-2/3">
          {cartItems.length === 0 ? (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
              Your cart is empty <Link to="/" className="font-bold underline">Go Back</Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center border-b dark:border-gray-700 p-4 last:border-b-0">
                  
                  {/* Image */}
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
                  
                  {/* Name */}
                  <div className="flex-1">
                    <Link to={`/product/${item._id}`} className="text-lg font-medium text-gray-800 dark:text-white hover:text-blue-600">
                      {item.name}
                    </Link>
                  </div>

                  {/* Price */}
                  <div className="text-gray-600 dark:text-gray-300 font-bold mr-6">
                    ${item.price}
                  </div>

                  {/* Qty Selector */}
                  <select
                    className="border rounded p-1 mr-6 dark:bg-gray-700 dark:text-white"
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  {/* Delete Button */}
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Subtotal Card */}
        <div className="md:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
            </h2>
            
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </div>

            <button
              type="button"
              className={`w-full py-3 rounded-lg font-bold text-white transition ${
                cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartScreen;