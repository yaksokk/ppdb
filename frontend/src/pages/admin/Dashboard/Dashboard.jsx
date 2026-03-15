import { RiGroupLine, RiCheckLine, RiUserLine, RiCloseLine } from 'react-icons/ri'
import { StatCard, BarChartCSS, PieChartCSS } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const dataBar = [
  { jalur: 'Zonasi',   total: 51, color: '#2563EB' },
  { jalur: 'Prestasi', total: 43, color: '#7C3AED' },
  { jalur: 'Afirmasi', total: 26, color: '#16A34A' },
  { jalur: 'Mutasi',   total: 8,  color: '#D97706' },
]

const dataPie = [
  { name: 'Terverifikasi',   value: 87, color: '#16A34A' },
  { name: 'Belum Periksa',   value: 7,  color: '#D97706' },
  { name: 'Perlu Perbaikan', value: 12, color: '#DC2626' },
]

const user = {
  name: 'Administrator',
  avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
}

function Dashboard() {
  return (
    <AdminLayout
      role="admin"
      user={user}
      activePath="/admin/dashboard"
      pageTitle="Dashboard"
    >
      <div
        className="rounded-lg px-5 py-4 mb-5 flex justify-between items-center overflow-hidden relative"
        style={{ background: 'linear-gradient(130deg, #1A3A6B, #1E3A8A)' }}
      >
        <div>
          <h2 className="text-[15px] font-bold text-white font-poppins mb-1">
            Selamat Datang, Administrator!
          </h2>
          <p className="text-[12px] text-white/70">
            Pantau dan kelola seluruh proses PPDB 2025/2026.
          </p>
        </div>
        <RiUserLine size={64} className="text-white/10 flex-shrink-0" />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon={RiGroupLine} label="Total Pendaftar" value="128" sub="TA 2025/2026"   iconBg="bg-primary-light" />
        <StatCard icon={RiCheckLine} label="Diterima"        value="87"  sub="54% dari kuota" iconBg="bg-success-light" />
        <StatCard icon={RiUserLine}  label="Jumlah Operator" value="3"   sub="akun operator"  iconBg="bg-warning-light" />
        <StatCard icon={RiCloseLine} label="Ditolak"         value="22"  sub="dari seleksi"   iconBg="bg-danger-light" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-n800 mb-4">Rekap per Jalur</p>
          <BarChartCSS data={dataBar} />
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-n800 mb-4">Status Verifikasi</p>
          <PieChartCSS data={dataPie} />
        </div>
      </div>

    </AdminLayout>
  )
}

export default Dashboard