function Spinner({ size = 'md', color = 'primary' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
  }

  const colors = {
    primary: 'border-primary/20 border-t-primary',
    white:   'border-white/20 border-t-white',
    slate:   'border-n300 border-t-n500',
  }

  return (
    <div className={`
      ${sizes[size]} ${colors[color]}
      rounded-full animate-spin
    `} />
  )
}

export default Spinner