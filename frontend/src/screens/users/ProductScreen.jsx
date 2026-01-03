import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  useGetProductDetailsQuery, 
  useCreateReviewMutation
} from '../../slices/productsApiSlice';
import { addToCart } from '../../slices/cartSlice';
import { toast } from 'react-toastify';
import Rating from '../../components/Rating';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  
  // --- REVIEW STATE ---
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  // --------------------

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

  // --- REVIEW MUTATION HOOK ---
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  // --- SUBMIT REVIEW HANDLER ---
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch(); // Reload product data to show new review
      toast.success('Review Submitted');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  // -----------------------------

  return (
    <div className="container mx-auto px-4 py-8">
      <Link className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 mb-6 transition" to="/">
        <FaArrowLeft /> Go Back
      </Link>

      {isLoading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <div className="text-red-500">{error?.data?.message || error.error}</div>
      ) : (
        <>
          {/* --- PRODUCT DETAILS SECTION (Existing) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {/* Image */}
            <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
              <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
            </div>

            {/* Info */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${product.price}</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>

              {/* Stock & Cart */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span>
                  <span className={product.countInStock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </span>
                </div>

                {product.countInStock > 0 && (
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Qty:</span>
                    <select
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-gray-700 dark:text-white focus:outline-none"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
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
                  className={`w-full py-3 px-6 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition ${
                    product.countInStock === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'
                  }`}
                >
                  <FaShoppingCart />
                  {product.countInStock === 0 ? 'Out Of Stock' : 'Add To Cart'}
                </button>
              </div>
            </div>
          </div>

          {/* --- REVIEWS SECTION (New) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            
            {/* Left: List of Reviews */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Reviews</h2>
              {product.reviews.length === 0 && <div className="bg-blue-50 text-blue-700 p-4 rounded">No Reviews Yet</div>}
              
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-gray-900 dark:text-white">{review.name}</strong>
                      <Rating value={review.rating} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{review.createdAt.substring(0, 10)}</p>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Write a Review Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Write a Customer Review</h2>
              {userInfo ? (
                <form onSubmit={submitHandler} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value=''>Select...</option>
                      <option value='1'>1 - Poor</option>
                      <option value='2'>2 - Fair</option>
                      <option value='3'>3 - Good</option>
                      <option value='4'>4 - Very Good</option>
                      <option value='5'>5 - Excellent</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Comment</label>
                    <textarea
                      rows='3'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                  </div>

                  <button
                    disabled={loadingProductReview}
                    type='submit'
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition w-full"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-700 dark:text-yellow-200">
                    Please <Link to='/login' className="font-bold underline">sign in</Link> to write a review.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
</div>
);
};

export default ProductScreen;