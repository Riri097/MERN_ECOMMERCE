import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useGetProductsQuery, useDeleteProductMutation } from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 7; // show 7 products per page

  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetProductsQuery({ keyword });
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchTerm);
    setPage(1); // reset to first page on search
  };

  const rowClickHandler = (id) => navigate(`/product/${id}`);

  // frontend pagination logic
  const products = data?.products || data || [];
  const pages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products Inventory</h1>
        
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-l-lg focus:outline-none dark:bg-gray-700 dark:text-white"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700">
            <FaSearch />
          </button>
        </form>
      </div>

      {loadingDelete && <p className="text-red-500">Deleting...</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error?.data?.message}</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Image</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-left">Stock</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Brand</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
                {paginatedProducts.map((product) => (
                  <tr 
                    key={product._id} 
                    onClick={() => rowClickHandler(product._id)} 
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition"
                  >
                    <td className="py-3 px-6 text-left">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover border" />
                    </td>
                    <td className="py-3 px-6 text-left font-medium">{product.name}</td>
                    <td className="py-3 px-6 text-left">${product.price}</td>
                    <td className={`py-3 px-6 text-left font-bold ${product.countInStock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {product.countInStock}
                    </td>
                    <td className="py-3 px-6 text-left">{product.category}</td>
                    <td className="py-3 px-6 text-left">{product.brand}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-4">
                        <Link 
                          to={`/admin/product/${product._id}/edit`} 
                          onClick={(e) => e.stopPropagation()}
                          className="transform hover:text-blue-500 hover:scale-110 transition"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button 
                          onClick={(e) => deleteHandler(e, product._id)} 
                          className="transform hover:text-red-500 hover:scale-110 transition"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-30"
            >
              <FaChevronLeft />
            </button>

            {[...Array(pages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setPage(x + 1)}
                className={`px-3 py-1 rounded border ${
                  page === x + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {x + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
              disabled={page === pages}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-30"
            >
              <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListScreen;
