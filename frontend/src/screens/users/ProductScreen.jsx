import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../../slices/productsApiSlice';
import { addToCart } from '../../slices/cartSlice';
import Rating from '../../components/Rating';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      toast.success('Review Submitted');
      setRating(0);
      setComment('');
      setTimeout(() => refetch(), 500);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6">
        <FaArrowLeft className="mr-2" /> Back
      </Link>

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error?.data?.message || error.error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-lg object-cover shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <Rating value={product.rating} />
                <span className="text-gray-500 text-sm">({product.numReviews} reviews)</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                ${product.price}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {product.countInStock > 0 && (
                  <div className="flex gap-4">
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="border border-gray-300 rounded px-4 py-2 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          Qty: {x + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={addToCartHandler}
                      className="bg-black dark:bg-white dark:text-black text-white px-8 py-2 rounded hover:opacity-80 transition flex items-center gap-2"
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Reviews ({product.reviews.length})
            </h2>

            {userInfo ? (
              <form onSubmit={submitHandler} className="mb-10 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold mb-3 dark:text-white">Write a review</h3>
                <div className="mb-3">
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">Select Rating...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div className="mb-3">
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  ></textarea>
                </div>
                <button
                  disabled={loadingProductReview}
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Post Review
                </button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
                Please <Link to="/login" className="text-blue-600 underline">sign in</Link> to write a review.
              </div>
            )}

            <div className="space-y-6">
              {(product.reviews || []).length === 0 && (
                <p className="text-gray-500">No reviews yet.</p>
              )}

              {(product.reviews || []).map((review) => (
                <div key={review._id} className="border-b border-gray-100 dark:border-gray-700 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 text-xs">
                        {review.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{review.name}</span>
                      <span className="text-gray-400 text-xs">• {review.createdAt.substring(0, 10)}</span>
                    </div>
                    <Rating value={review.rating} />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm pl-10">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
