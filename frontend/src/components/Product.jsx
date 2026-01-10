
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaRegEye } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Rating from './Rating'; 

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = (e) => {
    e.preventDefault();

    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (product.countInStock > 0) {
      dispatch(addToCart({ ...product, qty: 1 }));
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error('Product is out of stock');
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      
      {/* --- IMAGE SECTION (Square Aspect Ratio) --- */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Out of Stock Badge */}
        {product.countInStock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded z-10">
            OutOfStock
          </div>
        )}
        
        {/* Quick View Overlay */}
        <Link 
          to={`/product/${product._id}`}
          className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="bg-white text-gray-900 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-black hover:text-white">
            <FaRegEye /> QUICK VIEW
          </div>
        </Link>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-4 flex flex-col gap-1.5 flex-grow">
        
        {/* Category */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {product.category}
        </p>

        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating (No Margin, tight to title) */}
        <div className="flex items-center">
           <Rating value={product.rating} text={`${product.numReviews}`} />
           <span className="text-xs text-gray-400 ml-1">reviews</span>
        </div>

        {/* Bottom Row: Price & Add Button */}
        <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-50 dark:border-gray-700">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
          </div>

          <button 
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm
              ${product.countInStock === 0 
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed dark:bg-gray-700' 
                : 'bg-black text-white hover:bg-blue-600 hover:scale-110 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white'
              }`}
            title={product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
>
<FaShoppingCart size={14} />
</button>
</div>
</div>
</div>
);
};

export default Product;