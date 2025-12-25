import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center space-x-1 mb-2">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} className="text-yellow-400">
          {value >= index ? (
            <FaStar />
          ) : value >= index - 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{text && text}</span>
    </div>
  );
};

export default Rating;