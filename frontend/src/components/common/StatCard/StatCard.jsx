function StatCard({ icon, label, value, sub, iconBg = 'bg-primary-light' }) {
  const Icon = icon

  return (
    <div className="bg-white border border-n200 rounded-md p-4 shadow-xs">
      <div className={`w-9 h-9 ${iconBg} rounded-sm flex items-center justify-center mb-2.5`}>
        <Icon size={16} />
      </div>
      <div className="text-[10.5px] font-bold text-n500 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-[26px] font-extrabold text-n800 leading-none">{value}</div>
      {sub && <div className="text-[11px] text-n500 mt-1">{sub}</div>}
    </div>
  )
}

export default StatCard