import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../../slices/productsApiSlice';
import { addToCart } from '../../slices/cartSlice'; 
import { FaArrowLeft } from 'react-icons/fa';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  return (
    <div className="container mx-auto mt-8">
      <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-6 w-fit">
        <FaArrowLeft className="mr-2" /> Go Back
      </Link>

      {isLoading ? (
        <h2 className="text-center text-xl">Loading...</h2>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error?.data?.message || error.error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Column 1: Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Column 2: Details & Cart */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {product.name}
            </h1>

            <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Cart Box */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 dark:text-gray-300">Price:</span>
                <span className="text-xl font-bold dark:text-white">${product.price}</span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 dark:text-gray-300">Qty:</span>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white focus:outline-none"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className={`w-full py-3 rounded-lg font-bold text-white transition ${
                  product.countInStock > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {product.countInStock > 0 ? 'Add To Cart' : 'Out Of Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;