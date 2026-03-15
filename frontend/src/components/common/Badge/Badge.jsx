function Badge({ variant = 'blue', children }) {
  const variants = {
    blue:   'bg-primary-light text-primary-dark',
    green:  'bg-success-light text-success',
    amber:  'bg-warning-light text-warning',
    red:    'bg-danger-light text-danger',
    slate:  'bg-n100 text-n500',

    // status pendaftaran
    draft:      'bg-n100 text-n600',
    menunggu:   'bg-warning-light text-warning',
    perbaikan:  'bg-orange-50 text-orange-600',
    diterima:   'bg-success-light text-success',
    ditolak:    'bg-danger-light text-danger',
  }

  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-[3px]
      rounded-pill text-[11px] font-bold whitespace-nowrap leading-snug
      ${variants[variant]}
    `}>
      {children}
    </span>
  )
}

export default Badge