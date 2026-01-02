import { useState } from 'react';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import Product from '../../components/Product';
import Paginate from '../../components/Paginate';
import Hero from '../../components/Hero'; // Import Hero
import CategorySection from '../../components/CategorySection'; // Import Categories

const HomeScreen = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, isLoading, error } = useGetProductsQuery({ pageNumber });

  return (
    <>
      {/* 1. Hero is OUTSIDE any container div to go full width */}
      <div className=" w-full"> 
        <Hero />
      </div>

      {/* 2. The rest of the content lives inside a container */}
      <div className="container mx-auto px-4 py-6">
        <CategorySection />

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
            New Arrivals
          </h2>
          
          {isLoading ? (
            <h2 className="text-center">Loading...</h2>
          ) : error ? (
            <div className="text-red-500 text-center">{error?.data?.message || error.error}</div>
          ) : (
            <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
              <Paginate pages={data.pages} page={data.page} setPage={setPageNumber} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeScreen;