import { AdminLayout } from './components/layout'
import { StatCard, Table, Tr, Td, Badge } from './components/common'

const user = { name: 'Ahmad Santoso', avatarStyle: { background: 'rgba(37,99,235,.25)', color: '#93C5FD' } }

function App() {
  return (
    <AdminLayout
      role="pendaftar"
      user={user}
      activePath="/pendaftar/dashboard"
      pageTitle="Dashboard"
    >
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard icon="👥" label="Total Pendaftar" value="128" sub="TA 2025/2026" />
        <StatCard icon="✅" label="Diterima"        value="87"  sub="68%" iconBg="bg-success-light" />
        <StatCard icon="⏳" label="Menunggu"        value="24"  sub="Perlu verifikasi" iconBg="bg-warning-light" />
        <StatCard icon="❌" label="Ditolak"         value="17"  sub="Dokumen tidak valid" iconBg="bg-danger-light" />
      </div>

      <Table headers={['No', 'Nama', 'Jalur', 'Status']}>
        <Tr><Td>1</Td><Td>Ahmad Santoso</Td><Td>Zonasi</Td><Td><Badge variant="menunggu">Menunggu</Badge></Td></Tr>
        <Tr><Td>2</Td><Td>Mariska Dondokambey</Td><Td>Prestasi</Td><Td><Badge variant="diterima">Diterima</Badge></Td></Tr>
        <Tr><Td>3</Td><Td>Budi Santoso</Td><Td>Afirmasi</Td><Td><Badge variant="perbaikan">Perbaikan</Badge></Td></Tr>
      </Table>
    </AdminLayout>
  )
}

export default App