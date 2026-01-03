import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className='flex items-center gap-1 mb-2'>
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} style={{ color }}>
          {value >= index ? (
            <FaStar />
          ) : value >= index - 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </span>
      ))}
      {text && <span className='ml-2 text-sm text-gray-600 dark:text-gray-400 font-medium'>{text}</span>}
    </div>
  );
};

export default Rating;