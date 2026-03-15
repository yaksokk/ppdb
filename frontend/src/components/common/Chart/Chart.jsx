const COLORS = [
  '#2563EB', '#7C3AED', '#16A34A', '#D97706',
  '#DC2626', '#06B6D4', '#EC4899', '#84CC16',
]

export function BarChartCSS({ data }) {
  const max = Math.max(...data.map(d => d.total))
  return (
    <div className="flex items-end gap-4 h-[120px] pt-2">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[12px] font-bold text-n700">{item.total}</span>
          <div
            className="w-full rounded-t-[4px] transition-all duration-500"
            style={{
              height: `${(item.total / max) * 90}px`,
              background: item.color || COLORS[i % COLORS.length],
            }}
          />
          <span className="text-[10.5px] text-n500 text-center">{item.jalur}</span>
        </div>
      ))}
    </div>
  )
}

export function PieChartCSS({ data }) {
  const total = data.reduce((a, b) => a + b.value, 0)
  let cumulative = 0
  const segments = data.map((item, i) => {
    const pct = (item.value / total) * 100
    const start = cumulative
    cumulative += pct
    return { ...item, pct, start, color: item.color || COLORS[i % COLORS.length] }
  })

  const gradient = segments.map(s =>
    `${s.color} ${s.start}% ${s.start + s.pct}%`
  ).join(', ')

  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: 90, height: 90 }}>
        <div
          className="w-full h-full rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="absolute inset-0 rounded-full bg-white m-[15px]" />
      </div>
      <div className="flex flex-col gap-2">
        {segments.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-[12px] text-n700">
              <span className="font-bold">{item.value}</span> {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}