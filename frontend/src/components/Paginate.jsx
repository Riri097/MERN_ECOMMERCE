import React from 'react';

const Paginate = ({ pages, page, setPage }) => {
  return (
    pages > 1 && (
      <div className="flex justify-center mt-8 space-x-2">
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            onClick={() => setPage(x + 1)}
            className={`px-4 py-2 rounded border transition-colors duration-200 ${
              x + 1 === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
            }`}
          >
            {x + 1}
          </button>
        ))}
      </div>
    )
  );
};

export default Paginate;