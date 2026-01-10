import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Paginate = ({ pages, page, isAdmin = false, keyword = '', setPage }) => {
  // If only 1 page, don't show pagination
  if (pages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (setPage) {
      setPage(newPage);
      // Scroll to top of product list nicely
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white disabled:dark:hover:bg-transparent transition-colors"
      >
        <FaChevronLeft size={12} />
      </button>

      {/* Number Boxes */}
      {[...Array(pages).keys()].map((x) => {
        const pageNum = x + 1;
        return (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-10 h-10 rounded text-sm font-bold border transition-colors ${
              page === pageNum
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === pages}
        className="flex items-center justify-center w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white disabled:dark:hover:bg-transparent transition-colors"
      >
        <FaChevronRight size={12} />
      </button>

    </div>
  );
};

export default Paginate;