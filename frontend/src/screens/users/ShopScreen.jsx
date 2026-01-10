import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from '../../slices/productsApiSlice';
import Product from '../../components/Product';
import Paginate from '../../components/Paginate';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ShopScreen = () => {
  const { keyword } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [category, setCategory] = useState('All');

  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category: category !== 'All' ? category : '',
  });

  useEffect(() => {
    setPageNumber(1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [category]);

  return (
    <div className="bg-gray-50/50 dark:bg-black min-h-screen">
      <div className="pt-10 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {keyword ? `Results for "${keyword}"` : 'Explore Our Collection'}
        </h1>
      </div>

      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800 backdrop-blur-md border-y border-gray-100 dark:border-gray-800 mb-8 py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-center flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => setCategory('All')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5
                ${category === 'All'
                  ? 'bg-black text-white shadow-lg dark:bg-white dark:text-black'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-black dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-500'
                }`}
            >
              All Items
            </button>

            {!loadingCategories && categories?.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 capitalize
                  ${category === c
                    ? 'bg-black text-white shadow-lg dark:bg-white dark:text-black'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-black dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-500'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <>
            {!isLoading && (
              <div className="mb-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
                Showing {data.products.length} result(s) for <span className="text-black dark:text-white font-bold">"{category}"</span>
              </div>
            )}

            {data.products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">No products found</h3>
                <p className="text-gray-500">Try selecting a different category or clear your search.</p>
                <button 
                  onClick={() => setCategory('All')} 
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            )}

            <div className="mt-16 flex justify-center">
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ''}
                setPage={setPageNumber}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopScreen;
