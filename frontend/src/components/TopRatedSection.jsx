import { useState } from 'react';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import Product from './Product';
import Loader from './Loader';
import Message from './Message';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TopRatedSection = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [page, setPage] = useState(0); // 0-indexed logic
  
  const itemsPerPage = 4;

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  if (!products || products.length === 0) return null;

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Logic to slice the products for current page
  const displayedProducts = products.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="my-16 border-t border-gray-100 dark:border-gray-800 pt-10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Top Rated</h2>
        <p className="text-gray-500 mt-2">Highest rated products by our customers</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {displayedProducts.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      {/* --- NUMBERED PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="flex items-center justify-center w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white disabled:dark:hover:bg-transparent transition-colors"
          >
            <FaChevronLeft size={12} />
          </button>

          {/* Number Boxes */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`w-10 h-10 rounded text-sm font-bold border transition-colors ${
                page === index 
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
            className="flex items-center justify-center w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white disabled:dark:hover:bg-transparent transition-colors"      >
        <FaChevronRight size={12} />
      </button>
    </div>
  )}
</div>
);
};

export default TopRatedSection;