import "../../styles/Community/Pagination.css"

const Pagination = ({ currentPage, totalPages, setPage }) => {
    const pagesToShow = 5; // 페이지 버튼 개수
    const pageNumbers = []

    for (let i = Math.max(0, currentPage - Math.floor(pagesToShow / 2)); i <= Math.min(totalPages -1 , currentPage + Math.floor(pagesToShow / 2)); i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="pagination-container">
        {currentPage > 0 && (
          <button
            className="pagination-button"
            onClick={() => setPage(prev => prev - 1)}
          >
            이전
          </button>
        )}
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`pagination-button ${number === currentPage ? 'active' : ''}`}
            onClick={() => setPage(number)}
          >
            {number + 1}
          </button>
        ))}
        {currentPage <= totalPages - 2 && (
          <button
            className="pagination-button"
            onClick={() => setPage(prev => prev + 1)}
          >
            다음
          </button>
        )}
      </div>
    );
}

export default Pagination