import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiSearchLine } from 'react-icons/ri'
import { Badge, Button, Table, Tr, Td, Pagination, EmptyState } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
  name: 'Mariska Dondokambey',
  avatarStyle: { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
}

const DUMMY_DATA = [
  { id: 1, noDaftar: 'PPDB-2025-001', nama: 'Ahmad Santoso',    jk: 'Laki-laki',  asalSekolah: 'SDN 1 Tumpaan', jalur: 'Prestasi', status: 'menunggu' },
  { id: 2, noDaftar: 'PPDB-2025-002', nama: 'Dewi Kusuma',      jk: 'Perempuan',  asalSekolah: 'SDN 1 Tumpaan', jalur: 'Prestasi', status: 'perbaikan' },
  { id: 3, noDaftar: 'PPDB-2025-003', nama: 'Rizky Alamsyah',   jk: 'Laki-laki',  asalSekolah: 'MI Tumpaan',    jalur: 'Zonasi',   status: 'menunggu' },
  { id: 4, noDaftar: 'PPDB-2025-004', nama: 'Fira Nainggolan',  jk: 'Perempuan',  asalSekolah: 'SDN 2 Tumpaan', jalur: 'Prestasi', status: 'perbaikan' },
  { id: 5, noDaftar: 'PPDB-2025-005', nama: 'Kevin Maramis',    jk: 'Laki-laki',  asalSekolah: 'SDN 3 Tumpaan', jalur: 'Zonasi',   status: 'menunggu' },
  { id: 6, noDaftar: 'PPDB-2025-006', nama: 'Siti Rahayu',      jk: 'Perempuan',  asalSekolah: 'SDN 2 Tumpaan', jalur: 'Zonasi',   status: 'diterima' },
]

const STATUS_LABEL = {
  menunggu:  'Menunggu',
  perbaikan: 'Perbaikan',
  diterima:  'Diterima',
  ditolak:   'Ditolak',
  draft:     'Belum Mengisi',
}

function DataPendaftar() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterJalur, setFilterJalur]   = useState('')
  const [page, setPage]           = useState(1)

  const filtered = DUMMY_DATA.filter(d => {
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase()) ||
                        d.noDaftar.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus ? d.status === filterStatus : true
    const matchJalur  = filterJalur  ? d.jalur === filterJalur   : true
    return matchSearch && matchStatus && matchJalur
  })

  return (
    <AdminLayout role="operator" user={user} activePath="/admin/pendaftar">

      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Data Pendaftar</h1>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-n400" />
          <input
            type="text"
            placeholder="Cari nama / No. Daftar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)] placeholder:text-n400"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary bg-white cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="perbaikan">Perbaikan</option>
          <option value="diterima">Diterima</option>
          <option value="ditolak">Ditolak</option>
          <option value="draft">Belum Mengisi</option>
        </select>

        <select
          value={filterJalur}
          onChange={e => setFilterJalur(e.target.value)}
          className="px-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary bg-white cursor-pointer"
        >
          <option value="">Semua Jalur</option>
          <option value="Zonasi">Zonasi</option>
          <option value="Prestasi">Prestasi</option>
          <option value="Afirmasi">Afirmasi</option>
          <option value="Mutasi">Mutasi</option>
        </select>
      </div>

      <Table headers={['No.', 'No. Daftar', 'Nama Siswa', 'Jenis Kelamin', 'Asal Sekolah', 'Jalur', 'Status', 'Aksi']}>
        {filtered.length === 0 ? (
          <tr>
            <td colSpan={8}>
              <EmptyState icon={RiSearchLine} title="Data tidak ditemukan" description="Coba ubah kata kunci pencarian." />
            </td>
          </tr>
        ) : (
          filtered.map((d, i) => (
            <Tr key={d.id}>
              <Td className="text-n500">{i + 1}</Td>
              <Td className="font-semibold">{d.noDaftar}</Td>
              <Td className="font-semibold text-n800">{d.nama}</Td>
              <Td>{d.jk}</Td>
              <Td>{d.asalSekolah}</Td>
              <Td className="font-semibold">{d.jalur}</Td>
              <Td><Badge variant={d.status}>{STATUS_LABEL[d.status]}</Badge></Td>
              <Td>
                <Button
                  size="xs"
                  variant={d.status === 'diterima' ? 'ghost' : 'primary'}
                  onClick={() => navigate(`/admin/pendaftar/${d.id}`)}
                >
                  {d.status === 'diterima' ? 'Detail' : 'Verifikasi'}
                </Button>
              </Td>
            </Tr>
          ))
        )}
      </Table>

      <div className="flex items-center justify-between mt-3">
        <p className="text-[12px] text-n500">{filtered.length} dari {DUMMY_DATA.length} pendaftar ditampilkan</p>
        <Pagination current={page} total={2} onChange={setPage} />
      </div>

    </AdminLayout>
  )
}

export default DataPendaftar