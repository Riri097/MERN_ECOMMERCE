import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "../../slices/productsApiSlice";
import Product from "../../components/Product";
import Paginate from "../../components/Paginate";
import Hero from "../../components/Hero";
import CategorySection from "../../components/CategorySection";

const HomeScreen = () => {
  const { keyword } = useParams();
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <>
          <div className="w-full">
            <Hero />
          </div>
          <div className="container mx-auto px-4 py-6">
            <CategorySection />
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition"
          >
            ← <span className="ml-2">Go Back</span>
          </Link>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="mt-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
            {keyword ? `Search Results for "${keyword}"` : "New Arrivals"}
          </h2>

          {isLoading ? (
            <h2 className="text-center">Loading...</h2>
          ) : error ? (
            <div className="text-red-500 text-center">
              {error?.data?.message || error.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
              {/* Pass keyword to Paginate so it persists when changing pages */}
              <Paginate
                pages={data.pages}
                page={data.page}
                setPage={setPageNumber}
                keyword={keyword ? keyword : ""}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
