import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useGetProductsQuery, useDeleteProductMutation } from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetProductsQuery({ keyword });

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (e, id) => {
    e.stopPropagation(); // Prevent row click when clicking delete
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
  };

  // Navigate to product detail on row click
  const rowClickHandler = (id) => {
    navigate(`/product/${id}`);
  };

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
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Stock</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Brand</th> {/* Brand Column Added */}
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {(data.products || data).map((product) => (
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
                  <td className="py-3 px-6 text-left">{product.brand}</td> {/* Brand Value */}
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-4">
                      {/* Edit Icon */}
                      <Link 
                        to={`/admin/product/${product._id}/edit`} 
                        onClick={(e) => e.stopPropagation()}
                        className="transform hover:text-blue-500 hover:scale-110 transition"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </Link>

                      {/* Delete Icon */}
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
      )}
    </div>
  );
};

export default ProductListScreen;
