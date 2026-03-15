function Select({
  value,
  onChange,
  disabled = false,
  error,
  children,
  ...rest
}) {
  return (
    <div className="w-full">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
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
      {error && (
        <p className="mt-1 text-[11px] text-danger">{error}</p>
      )}
    </div>
  )
}

export default Select