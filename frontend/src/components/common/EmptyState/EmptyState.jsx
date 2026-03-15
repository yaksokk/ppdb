function EmptyState({ icon = '📭', title = 'Tidak ada data', description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-[13px] font-semibold text-n700 mb-1">{title}</p>
      {description && (
        <p className="text-[12px] text-n500 max-w-xs">{description}</p>
      )}
    </div>
  )
}

export default EmptyState