import { useState } from 'react';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from './Product';
import Loader from './Loader';
import Message from './Message';
import Paginate from './Paginate';

const NewArrivalsSection = () => {
  const [pageNumber, setPageNumber] = useState(1);

  // Fetch only this section's data
  const { data, isLoading, error } = useGetProductsQuery({ 
    pageNumber, 
    keyword: '' 
  });

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  return (
    <div className="my-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">New Arrivals</h2>
        <p className="text-gray-500 mt-2">Check out our latest collection</p>
      </div>

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
    </div>
  );
};

export default NewArrivalsSection;