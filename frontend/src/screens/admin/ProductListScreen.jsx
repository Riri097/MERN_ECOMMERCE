import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { 
  useGetProductsQuery, 
  useCreateProductMutation,
  useDeleteProductMutation 
} from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Create a new product?')) {
      try {
        await createProduct().unwrap();
        refetch();
        alert('Product Created! You can now edit it.');
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
        >
          <FaPlus className="mr-2" /> Create Product
        </button>
      </div>

      {loadingCreate && <p className="text-blue-500">Creating product...</p>}
      {loadingDelete && <p className="text-red-500">Deleting product...</p>}

      {isLoading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error?.data?.message || error.error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">NAME</th>
                <th className="py-3 px-6 text-left">PRICE</th>
                <th className="py-3 px-6 text-left">CATEGORY</th>
                <th className="py-3 px-6 text-left">BRAND</th>
                <th className="py-3 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{product._id}</td>
                  <td className="py-3 px-6 text-left">{product.name}</td>
                  <td className="py-3 px-6 text-left">${product.price}</td>
                  <td className="py-3 px-6 text-left">{product.category}</td>
                  <td className="py-3 px-6 text-left">{product.brand}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110 transition"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="w-4 transform hover:text-red-500 hover:scale-110 transition"
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