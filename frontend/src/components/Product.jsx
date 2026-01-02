import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border dark:border-gray-700">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover object-center"
        />
      </Link>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400">
            {product.name}
          </h2>
        </Link>

        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          ${product.price}
        </h3>
      </div>
    </div>
  );
};

export default Product;