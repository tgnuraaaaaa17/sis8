/** Pagination — беттерді ауыстыру (деректер серверде «бөлінген»). */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let index = 1; index <= totalPages; index += 1) {
    pages.push(index);
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn--ghost btn--small"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        ← Prev
      </button>

      {pages.map((pageNumber) => (
        <button
          type="button"
          key={pageNumber}
          className={`pagination__page ${pageNumber === page ? 'pagination__page--active' : ''}`}
          onClick={() => onChange(pageNumber)}
          aria-current={pageNumber === page ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        className="btn btn--ghost btn--small"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next →
      </button>
    </nav>
  );
}
