function Avatar({ name = '', size = 'md', style }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-[11px]',
    lg: 'w-10 h-10 text-[13px]',
  }

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full flex items-center justify-center
        font-bold tracking-wide flex-shrink-0
        bg-white/20 text-white
      `}
      style={style}
    >
      {initials}
    </div>
  )
}

export default Avatar