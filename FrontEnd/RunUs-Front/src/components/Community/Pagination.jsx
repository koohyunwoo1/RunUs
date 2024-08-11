import "../../styles/Community/Pagination.css"

const Pagination = ({ page, totalPages, setPage }) => {
    const pagesToShow = 5; // 페이지 버튼 개수
    const pageNumbers = []

    for (let i = Math.max(0, page - Math.floor(pagesToShow / 2)); i <= Math.min(totalPages, page + Math.floor(pagesToShow / 2)); i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="pagination-container">
        {page > 0 && (
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
            className={`pagination-button ${number === page ? 'active' : ''}`}
            onClick={() => setPage(number)}
          >
            {number + 1}
          </button>
        ))}
        {page <= totalPages - 1 && (
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