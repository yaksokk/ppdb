import { useEffect, useState } from 'react'
import { RiGroupLine, RiTimeLine, RiAlertLine, RiCheckLine } from 'react-icons/ri'
import { StatCard, BarChartCSS, PieChartCSS, Spinner } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'
import adminService from '../../../services/admin.service'
import useAuthStore from '../../../store/authStore'

const COLORS = ['#2563EB', '#7C3AED', '#16A34A', '#D97706']

function DashboardOperator() {
  const { user }              = useAuthStore()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const userObj = {
    name: user?.name || 'Operator',
    avatarStyle: { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
  }

  if (loading) return (
    <AdminLayout role="operator" user={userObj} activePath="/operator/dashboard">
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    </AdminLayout>
  )

  const dataBar = data?.per_jalur?.map((item, i) => ({
    jalur: item.jalur,
    total: item.total,
    color: COLORS[i % COLORS.length],
  })) || []

  const dataPie = data?.status_verifikasi || []

  return (
    <AdminLayout role="operator" user={userObj} activePath="/operator/dashboard">
      <div
        className="rounded-lg px-5 py-4 mb-5 flex justify-between items-center overflow-hidden relative"
        style={{ background: 'linear-gradient(130deg, #15803D, #22C55E)' }}
      >
        <div>
          <h2 className="text-[15px] font-bold text-white font-poppins mb-1">
            Selamat Datang, {user?.name}!
          </h2>
          <p className="text-[12px] text-white/70">
            Segera periksa dan verifikasi dokumen yang masuk hari ini.
          </p>
        </div>
        <RiCheckLine size={64} className="text-white/10 flex-shrink-0" />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon={RiGroupLine} label="Total Pendaftar"    value={data?.total ?? 0}    sub="TA 2025/2026"     iconBg="bg-primary-light" />
        <StatCard icon={RiTimeLine}  label="Belum Diverifikasi" value={data?.menunggu ?? 0} sub="Perlu diproses"   iconBg="bg-warning-light" />
        <StatCard icon={RiAlertLine} label="Perlu Perbaikan"    value={data?.perbaikan ?? 0} sub="Dikembalikan"    iconBg="bg-danger-light" />
        <StatCard icon={RiCheckLine} label="Terverifikasi"      value={data?.diterima ?? 0} sub="Selesai diproses" iconBg="bg-success-light" />
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