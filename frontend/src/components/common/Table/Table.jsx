function Table({ headers = [], children, empty }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-n200 bg-white shadow-xs">
            <table className="w-full border-collapse min-w-[560px]">
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th
                                key={i}
                                className="bg-n50 px-3.5 py-2.5 text-left text-[11px] font-bold text-n500 uppercase tracking-wide border-b border-n200 whitespace-nowrap"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children || (
                        <tr>
                            <td colSpan={headers.length} className="text-center py-10 text-[13px] text-n400">
                                {empty || 'Tidak ada data'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export function Tr({ children, onClick }) {
    return (
        <tr
            onClick={onClick}
            className={`border-b border-n200 last:border-0 hover:bg-n50 ${onClick ? 'cursor-pointer' : ''}`}
        >
            {children}
        </tr>
    )
}

export function Td({ children, className = '' }) {
    return (
        <td className={`px-3.5 py-3 text-[13px] align-middle ${className}`}>
            {children}
        </td>
    )
}

export default Table