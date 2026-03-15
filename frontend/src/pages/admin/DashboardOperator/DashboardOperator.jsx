import { RiGroupLine, RiTimeLine, RiAlertLine, RiCheckLine } from 'react-icons/ri'
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
  name: 'Mariska Dondokambey',
  avatarStyle: { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
}

function DashboardOperator() {
  return (
    <AdminLayout
      role="operator"
      user={user}
      activePath="/admin/dashboard"
      pageTitle="Dashboard"
    >
      <div
        className="rounded-lg px-5 py-4 mb-5 flex justify-between items-center overflow-hidden relative"
        style={{ background: 'linear-gradient(130deg, #15803D, #22C55E)' }}
      >
        <div>
          <h2 className="text-[15px] font-bold text-white font-poppins mb-1">
            Selamat Datang, Mariska Dondokambey!
          </h2>
          <p className="text-[12px] text-white/70">
            Segera periksa dan verifikasi dokumen yang masuk hari ini.
          </p>
        </div>
        <RiCheckLine size={64} className="text-white/10 flex-shrink-0" />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon={RiGroupLine} label="Total Pendaftar"     value="128" sub="TA 2025/2026"    iconBg="bg-primary-light" />
        <StatCard icon={RiTimeLine}  label="Belum Diverifikasi"  value="7"   sub="Perlu diproses"  iconBg="bg-warning-light" />
        <StatCard icon={RiAlertLine} label="Perlu Perbaikan"     value="12"  sub="Dikembalikan"    iconBg="bg-danger-light" />
        <StatCard icon={RiCheckLine} label="Terverifikasi"       value="87"  sub="Selesai diproses" iconBg="bg-success-light" />
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

export default DashboardOperator