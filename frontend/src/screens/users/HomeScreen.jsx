import { useState } from 'react';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import Product from '../../components/Product';
import Paginate from '../../components/Paginate';

const HomeScreen = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, error } = useGetProductsQuery({ pageNumber });

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Latest Products</h1>
      
      {isLoading ? (
        <h2 className="text-center text-xl">Loading...</h2>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error?.data?.message || error.error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {data.products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>

          <Paginate 
            pages={data.pages} 
            page={data.page} 
            setPage={setPageNumber} 
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;