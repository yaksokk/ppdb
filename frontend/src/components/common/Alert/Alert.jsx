function Alert({ variant = 'blue', children }) {
  const variants = {
    blue:  'bg-primary-light text-blue-900 border-blue-200',
    green: 'bg-success-light text-green-900 border-green-200',
    amber: 'bg-warning-light text-amber-900 border-amber-200',
    red:   'bg-danger-light text-red-900 border-red-200',
    slate: 'bg-n100 text-n600 border-n200',
  }

  return (
    <div className={`
      px-3 py-2.5 rounded-sm text-[12px] leading-relaxed border
      ${variants[variant]}
    `}>
      {children}
    </div>
  )
}

export default Alert