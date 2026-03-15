function Pagination({ current = 1, total = 1, onChange }) {
    if (total <= 1) return null

    const pages = Array.from({ length: total }, (_, i) => i + 1)

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => onChange(current - 1)}
                disabled={current === 1}
                className="px-2.5 py-1.5 text-[12px] rounded-xs border border-n200 text-n600 hover:bg-n50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                ‹
            </button>

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onChange(page)}
                    className={`
            w-7 h-7 text-[12px] rounded-xs border font-semibold
            ${page === current
                            ? 'bg-primary text-white border-primary'
                            : 'border-n200 text-n600 hover:bg-n50'}
          `}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onChange(current + 1)}
                disabled={current === total}
                className="px-2.5 py-1.5 text-[12px] rounded-xs border border-n200 text-n600 hover:bg-n50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                ›
            </button>
        </div>
    )
}

export default Pagination