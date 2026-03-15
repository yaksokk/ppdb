function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
  children,
}) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-semibold rounded-sm transition-all duration-150 active:scale-95 whitespace-nowrap'

  const variants = {
    primary:  'bg-primary text-white hover:bg-primary-dark shadow-[0_2px_8px_rgba(37,99,235,.22)]',
    ghost:    'bg-white text-n700 border border-n200 hover:bg-n50',
    success:  'bg-success text-white hover:bg-green-700',
    danger:   'bg-danger text-white hover:bg-red-700',
    warning:  'bg-warning text-white hover:bg-amber-700',
    cyan:     'bg-cyan text-white hover:bg-cyan-dark shadow-[0_2px_8px_rgba(6,182,212,.22)]',
  }

  const sizes = {
    xs: 'px-2.5 py-1 text-[11px]',
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-[18px] py-[9px] text-[13px]',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  )
}

export default Button