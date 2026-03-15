import { RiInboxLine } from 'react-icons/ri'

function EmptyState({ icon: Icon = RiInboxLine, title = 'Tidak ada data', description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={36} className="text-n300 mb-3" />
      <p className="text-[13px] font-semibold text-n700 mb-1">{title}</p>
      {description && (
        <p className="text-[12px] text-n500 max-w-xs">{description}</p>
      )}
    </div>
  )
}

export default EmptyState