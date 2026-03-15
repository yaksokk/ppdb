import { useRef } from 'react'

function FormFile({ label, required, hint, error, note, value, onChange }) {
  const ref = useRef()

  return (
    <div className="mb-3 last:mb-0">
      {label && (
        <label className="block text-[11px] font-bold text-n600 uppercase tracking-wide mb-1.5">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div
        onClick={() => ref.current.click()}
        className={`
          border-2 border-dashed rounded-md p-5 text-center cursor-pointer
          transition-all duration-150
          ${value
            ? 'border-green-300 bg-success-light'
            : error || note
            ? 'border-orange-200 bg-orange-50'
            : 'border-n300 bg-n50 hover:border-primary hover:bg-primary-light'}
        `}
      >
        <span className="block text-3xl mb-2">{value ? '✅' : '⬆️'}</span>
        <p className="text-[13px] font-semibold text-n700 mb-1">
          {value ? value.name : 'Klik untuk upload'}
        </p>
        {hint && !value && <p className="text-[11px] text-n400">{hint}</p>}
      </div>

      {note && (
        <div className="mt-1.5 text-[11.5px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xs px-2.5 py-1.5 leading-snug">
          {note}
        </div>
      )}
      {error && !note && <p className="mt-1 text-[11px] text-danger">{error}</p>}

      <input
        ref={ref}
        type="file"
        className="hidden"
        onChange={e => onChange && onChange(e.target.files[0])}
      />
    </div>
  )
}

export default FormFile