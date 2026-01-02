import { Link } from 'react-router-dom';
import { FaMobileAlt, FaLaptop, FaCamera, FaHeadphones, FaGamepad, FaTv } from 'react-icons/fa';

const categories = [
  { name: 'Electronics', icon: <FaLaptop />, path: '/search/electronics' },
  { name: 'Phones', icon: <FaMobileAlt />, path: '/search/phone' },
  { name: 'Cameras', icon: <FaCamera />, path: '/search/camera' },
  { name: 'Audio', icon: <FaHeadphones />, path: '/search/headphone' },
  { name: 'Gaming', icon: <FaGamepad />, path: '/search/gaming' },
  { name: 'TV', icon: <FaTv />, path: '/search/tv' },
];

const CategorySection = () => {
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Shop by Category
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            to={cat.path}
            className="group flex flex-col items-center"
          >
            {/* Circular Icon Container */}
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl text-gray-600 dark:text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg">
              {cat.icon}
            </div>
            {/* Label */}
            <span className="mt-3 font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;