import React from "react";


function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <button
        onClick={() => handlePageChange(1)}
        className={currentPage === 1 ? "active" : ""}
      >
        1
      </button>
      {currentPage > 4 && <span className="dots">...</span>}
      {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
        .filter((page) => page > 1 && page < totalPages)
        .map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        ))}
      {currentPage < totalPages - 3 && <span className="dots">...</span>}
      {totalPages > 1 && (
        <button
          onClick={() => handlePageChange(totalPages)}
          className={currentPage === totalPages ? "active" : ""}
        >
          {totalPages}
        </button>
      )}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
