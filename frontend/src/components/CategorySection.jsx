import { Link } from 'react-router-dom';
import { FaMobileAlt, FaCamera, FaHeadphones, FaGamepad, FaTv } from 'react-icons/fa';

const categories = [
  { name: 'Phones', icon: <FaMobileAlt />, path: '/search/phone' },
  { name: 'Cameras', icon: <FaCamera />, path: '/search/camera' },
  { name: 'Headphones', icon: <FaHeadphones />, path: '/search/headphone' },
  { name: 'Gaming', icon: <FaGamepad />, path: '/search/gaming' },
  { name: 'TV', icon: <FaTv />, path: '/search/tv' },
];

const CategorySection = () => {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        Shop by Category
      </h2>

      <div className="flex flex-wrap justify-center gap-10">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.path}
            className="group flex flex-col items-center transform transition-transform duration-300 hover:-translate-y-2"
          >
            {/* Circular Icon with border */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl 
                            text-gray-600 dark:text-gray-300 
                            border-2 border-black dark:border-white 
                            group-hover:border-blue-600 dark:group-hover:border-blue-400 
                            transition-all duration-300">
              {cat.icon}
            </div>

            {/* Label */}
            <span className="mt-4 font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">
              {cat.name}
            </span>

            {/* Optional small hover underline */}
            <span className="block w-0 h-1 bg-blue-600 rounded mt-1 group-hover:w-full transition-all duration-300"></span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
