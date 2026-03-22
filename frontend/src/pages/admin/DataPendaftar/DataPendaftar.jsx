import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiSearchLine } from 'react-icons/ri'
import { Badge, Button, Table, Tr, Td, Pagination, EmptyState, Spinner } from '../../../components/common'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import operatorService from '../../../services/operator.service'
import useAuthStore from '../../../store/authStore'
import adminService from '../../../services/admin.service'
import sawService from '../../../services/saw.service'
import { Modal } from '../../../components/common'

const STATUS_LABEL = {
  menunggu: 'Menunggu',
  perbaikan: 'Perbaikan',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
  draft: 'Belum Mengisi',
}

function DataPendaftar() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [data, setData] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterJalur, setFilterJalur] = useState('')
  const [page, setPage] = useState(1)
  const [jalurList, setJalurList] = useState([])
  const [hitungModal, setHitungModal] = useState({ open: false, jalur_id: '', jalur_nama: '' })
  const [hitungLoading, setHitungLoading] = useState(false)
  const [hitungSuccess, setHitungSuccess] = useState('')

  const userObj = {
    name: user?.name || 'Operator',
    avatarStyle: user?.role === 'admin'
      ? { background: 'rgba(217,119,6,.2)', color: '#FCD34D' }
      : { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
  }

  const fetchData = (params = {}) => {
    setLoading(true)
    const service = user?.role === 'admin'
      ? adminService.getListPendaftar({ search, status: filterStatus, page, ...params })
      : operatorService.getListPendaftar({ search, status: filterStatus, page, ...params })

    service
      .then(res => {
        setData(res.data.data)
        setMeta(res.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    import('../../../services/api').then(({ default: api }) => {
      api.get('/jalur-masuk').then(res => setJalurList(res.data.jalur))
    })
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchData({ page: 1 })
  }

  const handleHitungSAW = async () => {
    setHitungLoading(true)
    try {
      await sawService.hitung({ jalur_id: hitungModal.jalur_id })
      setHitungSuccess(`Ranking SAW jalur ${hitungModal.jalur_nama} berhasil dihitung!`)
      setTimeout(() => setHitungSuccess(''), 3000)
      fetchData()
      setHitungModal({ open: false, jalur_id: '', jalur_nama: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setHitungLoading(false)
    }
  }

  return (
    <DashboardLayout role={user?.role || 'operator'} user={userObj} activePath="/admin/pendaftar">
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
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-8 pr-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary placeholder:text-n400"
          />
        </div>

        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); fetchData({ status: e.target.value, page: 1 }) }}
          className="px-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary bg-white cursor-pointer">
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="perbaikan">Perbaikan</option>
          <option value="diterima">Diterima</option>
          <option value="ditolak">Ditolak</option>
          <option value="draft">Belum Mengisi</option>
        </select>

        <select value={filterJalur} onChange={e => { setFilterJalur(e.target.value); setPage(1); fetchData({ jalur_id: e.target.value, page: 1 }) }}
          className="px-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary bg-white cursor-pointer">
          <option value="">Semua Jalur</option>
          <option value="1">Zonasi</option>
          <option value="2">Prestasi</option>
          <option value="3">Afirmasi</option>
          <option value="4">Mutasi</option>
        </select>
      </div>

      {user?.role === 'operator' && (
        <div className="flex flex-col gap-2 mb-4">
          {hitungSuccess && (
            <p className="text-[12px] text-success font-semibold">{hitungSuccess}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            {jalurList.map(j => (
              <Button key={j.id} size="sm" variant="ghost"
                onClick={() => setHitungModal({ open: true, jalur_id: j.id, jalur_nama: j.nama })}>
                Hitung SAW — {j.nama}
              </Button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <Table headers={['No.', 'No. Daftar', 'Nama Siswa', 'Jenis Kelamin', 'Asal Sekolah', 'Jalur', 'Ranking', 'Skor SAW', 'Status', 'Aksi']}>
            {data.length === 0 ? (
              <tr><td colSpan={8}>
                <EmptyState icon={RiSearchLine} title="Data tidak ditemukan" description="Coba ubah kata kunci pencarian." />
              </td></tr>
            ) : (
              data.map((d, i) => (
                <Tr key={d.id}>
                  <Td className="text-n500">{(page - 1) * 10 + i + 1}</Td>
                  <Td className="font-semibold">{d.no_pendaftaran}</Td>
                  <Td className="font-semibold text-n800">{d.data_diri?.nama_lengkap ?? '-'}</Td>
                  <Td>{d.data_diri?.jenis_kelamin ?? '-'}</Td>
                  <Td>{d.data_diri?.asal_sekolah ?? '-'}</Td>
                  <Td className="font-semibold">{d.jalur?.nama ?? '-'}</Td>
                  <Td className="font-bold text-primary text-center">
                    {d.seleksi?.ranking ? `#${d.seleksi.ranking}` : '-'}
                  </Td>
                  <Td className="text-center font-semibold">
                    {d.seleksi?.skor_saw ? parseFloat(d.seleksi.skor_saw).toFixed(4) : '-'}
                  </Td>
                  <Td><Badge variant={d.status}>{STATUS_LABEL[d.status]}</Badge></Td>
                  <Td>
                    <Button size="xs" variant={d.status === 'diterima' || d.status === 'ditolak' ? 'ghost' : 'primary'}
                      onClick={() => navigate(`/admin/pendaftar/${d.id}`)}>
                      {d.status === 'diterima' || d.status === 'ditolak' ? 'Detail' : 'Verifikasi'}
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Table>

          <div className="flex items-center justify-between mt-3">
            <p className="text-[12px] text-n500">{meta.total ?? 0} pendaftar ditemukan</p>
            <Pagination current={page} total={meta.last_page ?? 1} onChange={setPage} />
          </div>
        </>
      )}

      <Modal isOpen={hitungModal.open} onClose={() => setHitungModal({ open: false, jalur_id: '', jalur_nama: '' })}
        title="Hitung Ranking SAW">
        <p className="text-[13px] text-n600 mb-4">
          Hitung ranking SAW untuk jalur <strong>{hitungModal.jalur_nama}</strong>? Semua pendaftar jalur ini yang sudah diinput nilainya akan diranking ulang.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setHitungModal({ open: false, jalur_id: '', jalur_nama: '' })}>Batal</Button>
          <Button disabled={hitungLoading} onClick={handleHitungSAW}>
            {hitungLoading ? <Spinner size="sm" color="white" /> : 'Ya, Hitung Sekarang'}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default DataPendaftar