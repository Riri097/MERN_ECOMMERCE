
    import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../slices/productsApiSlice';
import Product from '../../components/Product';
import Paginate from '../../components/Paginate';

const ShopScreen = () => {
  const { keyword } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [category, setCategory] = useState('All'); // State for selected category

  // Fetch Categories
  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();
  
  // Fetch Products (depends on page, keyword, and category)
  const { data, isLoading, error } = useGetProductsQuery({ 
    keyword, 
    pageNumber, 
    category: category !== 'All' ? category : '' 
  });

  // Reset page to 1 when category changes
  useEffect(() => {
    setPageNumber(1);
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR: FILTERS --- */}
        <div className="w-full md:w-1/4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
              Categories
            </h3>
            
            <ul className="space-y-2">
              {/* 'All' Option */}
              <li>
                <button
                  className={`w-full text-left px-2 py-1 rounded transition ${
                    category === 'All' 
                      ? 'bg-blue-600 text-white font-bold' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setCategory('All')}
                >
                  All Products
                </button>
              </li>

              {/* Dynamic Categories */}
              {!loadingCategories && categories?.map((c) => (
                <li key={c}>
                  <button
                    className={`w-full text-left px-2 py-1 rounded transition ${
                      category === c 
                        ? 'bg-blue-600 text-white font-bold' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- RIGHT SIDE: PRODUCTS GRID --- */}
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {category === 'All' ? 'All Products' : `${category} Products`}
          </h2>

          {isLoading ? (
            <h2>Loading...</h2>
          ) : error ? (
            <div className="text-red-500">{error?.data?.message || error.error}</div>
          ) : (
            <>
              {data.products.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">No products found in this category.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              )}
              
              <div className="mt-8">
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
    </div> ); };

export default ShopScreen;