import { useState } from 'react'
import { RiSearchLine, RiDownload2Line, RiCheckLine, RiCloseLine } from 'react-icons/ri'
import { Badge, Button, Table, Tr, Td, EmptyState, Modal } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
  name: 'Mariska Dondokambey',
  avatarStyle: { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
}

const DUMMY_DATA = [
  { id: 1, nama: 'Siti Rahayu',     nisn: '0987654321', jk: 'Perempuan', agama: 'Kristen Protestan', asalSekolah: 'SDN 2 Tumpaan', jalur: 'Zonasi',   status: 'diterima' },
  { id: 2, nama: 'Budi Permana',    nisn: '0111222333', jk: 'Laki-laki', agama: 'Islam',             asalSekolah: 'SDN 3 Tumpaan', jalur: 'Afirmasi', status: 'diterima' },
  { id: 3, nama: 'Ahmad Santoso',   nisn: '0123456789', jk: 'Laki-laki', agama: 'Kristen Protestan', asalSekolah: 'SDN 1 Tumpaan', jalur: 'Prestasi', status: 'diterima' },
  { id: 4, nama: 'Kevin Maramis',   nisn: '0555444333', jk: 'Laki-laki', agama: 'Kristen Protestan', asalSekolah: 'SDN 3 Tumpaan', jalur: 'Mutasi',   status: 'ditolak' },
  { id: 5, nama: 'Fira Nainggolan', nisn: '0888777666', jk: 'Perempuan', agama: 'Kristen Protestan', asalSekolah: 'SDN 2 Tumpaan', jalur: 'Prestasi', status: 'diterima' },
]

const STATUS_LABEL = {
  diterima: 'Diterima',
  ditolak:  'Tidak Diterima',
}

function HasilSeleksi() {
  const [search, setSearch]           = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterJalur, setFilterJalur]   = useState('')
  const [data, setData]               = useState(DUMMY_DATA)
  const [ubahModal, setUbahModal]     = useState({ open: false, item: null })

  const filtered = data.filter(d => {
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase()) ||
                        d.nisn.includes(search)
    const matchStatus = filterStatus ? d.status === filterStatus : true
    const matchJalur  = filterJalur  ? d.jalur  === filterJalur  : true
    return matchSearch && matchStatus && matchJalur
  })

  const handleUbah = (item) => {
    setUbahModal({ open: true, item })
  }

  const handleSimpan = (newStatus) => {
    setData(data.map(d =>
      d.id === ubahModal.item.id ? { ...d, status: newStatus } : d
    ))
    setUbahModal({ open: false, item: null })
  }

  return (
    <AdminLayout role="operator" user={user} activePath="/admin/seleksi">

      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Hasil Seleksi</h1>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-n400" />
          <input
            type="text"
            placeholder="Cari nama / NISN..."
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
          <option value="diterima">Diterima</option>
          <option value="ditolak">Tidak Diterima</option>
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

        <Button onClick={() => alert('Export')} className="ml-auto">
          <RiDownload2Line size={14} /> Export
        </Button>
      </div>

      <Table headers={['No.', 'Nama Siswa', 'NISN', 'Jenis Kelamin', 'Agama', 'Asal Sekolah', 'Jalur', 'Status', 'Aksi']}>
        {filtered.length === 0 ? (
          <tr>
            <td colSpan={9}>
              <EmptyState icon={RiSearchLine} title="Data tidak ditemukan" description="Coba ubah kata kunci pencarian." />
            </td>
          </tr>
        ) : (
          filtered.map((d, i) => (
            <Tr key={d.id}>
              <Td className="text-n500">{i + 1}</Td>
              <Td className="font-semibold text-n800">{d.nama}</Td>
              <Td className="text-n600">{d.nisn}</Td>
              <Td>{d.jk}</Td>
              <Td>{d.agama}</Td>
              <Td>{d.asalSekolah}</Td>
              <Td className="font-semibold">{d.jalur}</Td>
              <Td>
                <div className="flex items-center gap-1">
                  {d.status === 'diterima'
                    ? <RiCheckLine size={13} className="text-success" />
                    : <RiCloseLine size={13} className="text-danger" />
                  }
                  <Badge variant={d.status === 'diterima' ? 'diterima' : 'ditolak'}>
                    {STATUS_LABEL[d.status]}
                  </Badge>
                </div>
              </Td>
              <Td>
                <Button size="xs" variant="ghost" onClick={() => handleUbah(d)}>
                  Ubah
                </Button>
              </Td>
            </Tr>
          ))
        )}
      </Table>

      <div className="mt-3">
        <p className="text-[12px] text-n500">{filtered.length} data ditampilkan</p>
      </div>

      <Modal
        isOpen={ubahModal.open}
        onClose={() => setUbahModal({ open: false, item: null })}
        title="Ubah Status Seleksi"
      >
        {ubahModal.item && (
          <>
            <p className="text-[13px] text-n600 mb-4">
              Ubah status seleksi untuk <strong>{ubahModal.item.nama}</strong>
            </p>
            <div className="flex gap-2">
              <Button variant="success" fullWidth onClick={() => handleSimpan('diterima')}>
                <RiCheckLine size={14} /> Diterima
              </Button>
              <Button variant="danger" fullWidth onClick={() => handleSimpan('ditolak')}>
                <RiCloseLine size={14} /> Tidak Diterima
              </Button>
            </div>
          </>
        )}
      </Modal>

    </AdminLayout>
  )
}

export default HasilSeleksi