import { useNavigate } from 'react-router-dom'
import { RiSchoolLine, RiDashboardLine, RiGroupLine, RiFileList3Line, RiUploadCloud2Line, RiTrophyLine, RiInformationLine, RiLogoutBoxRLine, RiUserSettingsLine } from 'react-icons/ri'
import { Avatar } from '../../common'
import authService from '../../../services/auth.service'
import useAuthStore from '../../../store/authStore'

const NAV_CONFIG = {
  admin: [
    { icon: RiDashboardLine, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: RiGroupLine, label: 'Data Pendaftar', path: '/admin/pendaftar' },
    { icon: RiUserSettingsLine, label: 'Kelola Akun', path: '/admin/operator' },
    { icon: RiInformationLine, label: 'Kelola Info', path: '/admin/pengumuman' },
  ],
  operator: [
    { icon: RiDashboardLine, label: 'Dashboard', path: '/operator/dashboard' },
    { icon: RiGroupLine, label: 'Data Pendaftar', path: '/admin/pendaftar' },
    { icon: RiTrophyLine, label: 'Hasil Seleksi', path: '/admin/seleksi' },
  ],
  pendaftar: [
    { icon: RiDashboardLine, label: 'Dashboard', path: '/pendaftar/dashboard' },
    { icon: RiFileList3Line, label: 'Formulir', path: '/pendaftar/formulir' },
    { icon: RiUploadCloud2Line, label: 'Upload Dokumen', path: '/pendaftar/dokumen' },
    { icon: RiTrophyLine, label: 'Hasil Seleksi', path: '/pendaftar/hasil' },
  ],
}

const ROLE_BADGE = {
  admin: { label: 'Administrator', cls: 'bg-amber-500/20 text-amber-300 border border-amber-500/25' },
  operator: { label: 'Operator PPDB', cls: 'bg-success/20 text-green-300 border border-success/25' },
  pendaftar: { label: 'Pendaftar', cls: 'bg-primary/25 text-blue-300 border border-primary/30' },
}

function Sidebar({ role = 'admin', user = {}, activePath = '', onLogout }) {
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()
  const nav = NAV_CONFIG[role] || []
  const badge = ROLE_BADGE[role]


  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error(err)
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <aside className="w-[224px] bg-dark-blue flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto">

      <div className="h-[52px] flex items-center gap-2.5 px-3.5 border-b border-white/10 flex-shrink-0">
        <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center flex-shrink-0">
          <RiSchoolLine size={18} color="#fff" />
        </div>
        <span className="text-[12px] font-bold text-white font-poppins leading-snug">
          SMP N 1 Tumpaan
        </span>
      </div>

      {badge && (
        <div className={`mx-2.5 mt-3 px-3 py-1.5 rounded-pill text-[11px] font-bold text-center tracking-wide ${badge.cls}`}>
          {badge.label}
        </div>
      )}

      <nav className="flex-1 py-1.5">
        <p className="text-[9px] font-bold text-white/28 uppercase tracking-widest px-3.5 pt-2 pb-1">
          Menu
        </p>
        {nav.map(item => {
          const Icon = item.icon
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center gap-2 px-2.5 py-2 mx-2 rounded-sm
                text-[12.5px] font-medium cursor-pointer transition-all duration-150
                ${activePath === item.path
                  ? 'bg-white/12 text-white font-semibold'
                  : 'text-white/60 hover:bg-white/7 hover:text-white/90'}
              `}
            >
              <Icon size={14} className="flex-shrink-0" />
              {item.label}
            </div>
          )
        })}
      </nav>

      <div
        onClick={handleLogout}
        className="mx-3 mb-3 px-3 py-2 rounded-sm flex items-center justify-center gap-1.5
          text-white/80 cursor-pointer hover:bg-red-500/20 hover:text-red-300
          transition-all duration-150 border-t border-white/10 pt-3"
      >
        <RiLogoutBoxRLine size={14} />
        <span className="text-[12px] font-bold">Keluar</span>
      </div>

    </aside>
  )
}

export default Sidebar