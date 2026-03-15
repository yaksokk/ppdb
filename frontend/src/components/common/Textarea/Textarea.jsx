function Textarea({
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  rows = 4,
  ...rest
}) {
  return (
    <div className="w-full">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-3 py-[9px] text-[13px] text-n800
          border-[1.5px] rounded-sm bg-white outline-none
          transition-all duration-150 leading-relaxed
          placeholder:text-n400 resize-y min-h-[76px]
          focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-danger' : 'border-n200'}
        `}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-[11px] text-danger">{error}</p>
      )}
    </div>
  )
}

export default Textarea