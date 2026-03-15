function FormSelect({ label, required, error, children, ...rest }) {
  return (
    <div className="mb-3 last:mb-0">
      {label && (
        <label className="block text-[11px] font-bold text-n600 uppercase tracking-wide mb-1.5">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-[9px] text-[13px] text-n800
          border-[1.5px] rounded-sm bg-white outline-none
          transition-all duration-150 cursor-pointer
          focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-danger' : 'border-n200'}
        `}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
    </div>
  )
}

export default FormSelect