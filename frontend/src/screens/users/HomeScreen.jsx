import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "../../slices/productsApiSlice";
import Product from "../../components/Product";
import Paginate from "../../components/Paginate";
import Hero from "../../components/Hero";
import CategorySection from "../../components/CategorySection";
import TopRatedSection from "../../components/TopRatedSection";
import NewArrivalsSection from "../../components/NewArrivalsSection"; // ✅ Import new component

const HomeScreen = () => {
  const { keyword } = useParams();
  
  const [searchPage, setSearchPage] = useState(1);

  const { data: searchData, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber: searchPage,
  }, { skip: !keyword }); 

  return (
    <>
      {!keyword ? (
        <>
          <div className="w-full">
            <Hero />
          </div>
          
          <div className="container mx-auto px-4 py-6">
            <CategorySection />
            <NewArrivalsSection /> 
            <TopRatedSection />
          </div>
        </>
      ) : (
        
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition mb-6"
          >
            ← <span className="ml-2">Go Back</span>
          </Link>

          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
            Search Results for "{keyword}"
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
                {searchData.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
              
              <Paginate
                pages={searchData.pages}
                page={searchData.page}
setPage={setSearchPage}
keyword={keyword}
/>
</>
)}
</div>
)}
</>
);
};

export default HomeScreen;