import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiMenuLine, RiCloseLine, RiSchoolLine } from 'react-icons/ri'
import { Button } from '../../common'

const NAV_LINKS = [
  { label: 'Beranda',         path: '/' },
  { label: 'Informasi Jalur', path: '/jalur' },
  { label: 'Pengumuman',      path: '/pengumuman' },
  { label: 'Cek Status',      path: '/cek-status' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="bg-dark-blue sticky top-0 z-[200] border-b border-white/8">
      <div className="h-[60px] px-12 flex items-center">

        <a href="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
          <div className="w-[34px] h-[34px] bg-white/12 rounded-[9px] flex items-center justify-center flex-shrink-0">
            <RiSchoolLine size={18} color="#fff" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-white font-poppins leading-tight">PPDB Online</p>
            <p className="text-[10px] text-white/40 mt-0.5">SMP Negeri 1 Tumpaan</p>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-1 ml-10 flex-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.path}
              href={link.path}
              className="px-3 py-1.5 text-[13px] text-white/70 font-medium rounded-sm hover:text-white hover:bg-white/8 transition-all duration-150 no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Masuk
          </Button>
          <Button size="sm" onClick={() => navigate('/register')}>
            Daftar Sekarang
          </Button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden ml-auto text-white bg-transparent border-none cursor-pointer"
        >
          {menuOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
        </button>

      </div>

      {menuOpen && (
        <div className="md:hidden bg-dark-blue border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.path}
              href={link.path}
              className="px-3 py-2 text-[13px] text-white/70 hover:text-white hover:bg-white/8 rounded-sm no-underline"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 mt-2">
            <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/login')}>Masuk</Button>
            <Button size="sm" fullWidth onClick={() => navigate('/register')}>Daftar</Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar