import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiSearchLine, RiCalculatorLine } from 'react-icons/ri'
import { Badge, Button, Table, Tr, Td, Pagination, EmptyState, Spinner, Modal } from '../../../components/common'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import operatorService from '../../../services/operator.service'
import adminService from '../../../services/admin.service'
import sawService from '../../../services/saw.service'
import api from '../../../services/api'
import useAuthStore from '../../../store/authStore'

// R3: Label dan warna badge untuk hasil_status
const HASIL_STATUS_LABEL = {
  belum_diproses: { label: 'Belum Diproses',  variant: 'belum_diproses' },
  sudah_saw:      { label: 'Sudah Diranking', variant: 'sudah_saw' },
  diterima:       { label: 'Diterima',        variant: 'diterima' },
  ditolak:        { label: 'Ditolak',         variant: 'ditolak' },
}

function SeleksiSaw() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [data,          setData]          = useState([])
  const [meta,          setMeta]          = useState({})
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [filterJalur,   setFilterJalur]   = useState('')
  const [page,          setPage]          = useState(1)
  const [jalurList,     setJalurList]     = useState([])
  const [hitungModal,   setHitungModal]   = useState({ open: false, jalur_id: '', jalur_nama: '' })
  const [hitungLoading, setHitungLoading] = useState(false)
  const [hitungSuccess, setHitungSuccess] = useState('')

  const isAdmin    = user?.role === 'admin'
  const isOperator = user?.role === 'operator'

  const userObj = {
    name: user?.name || (isAdmin ? 'Admin' : 'Operator'),
    avatarStyle: isAdmin
      ? { background: 'rgba(217,119,6,.2)', color: '#FCD34D' }
      : { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
  }

  const fetchData = (params = {}) => {
    setLoading(true)
    const svc = isAdmin
      ? adminService.getListSeleksiSaw({ search, jalur_id: filterJalur, page, ...params })
      : operatorService.getListSeleksiSaw({ search, jalur_id: filterJalur, page, ...params })

    svc
      .then(res => { setData(res.data.data); setMeta(res.data) })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    api.get('/jalur-masuk').then(res => setJalurList(res.data.jalur))
  }, [page])

  const handleSearch = () => { setPage(1); fetchData({ page: 1 }) }

  const handleHitungSAW = async () => {
    setHitungLoading(true)
    try {
      await sawService.hitung({ jalur_id: hitungModal.jalur_id })
      setHitungSuccess(`Ranking SAW jalur ${hitungModal.jalur_nama} berhasil dihitung!`)
      setTimeout(() => setHitungSuccess(''), 4000)
      fetchData()
      setHitungModal({ open: false, jalur_id: '', jalur_nama: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setHitungLoading(false)
    }
  }

  return (
    <DashboardLayout role={user?.role || 'operator'} user={userObj} activePath="/admin/seleksi-saw">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Seleksi SAW</h1>
        <p className="text-[12px] text-n500 mt-0.5">
          Pendaftar yang telah terverifikasi dan siap dihitung ranking SAW
        </p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-n400" />
          <input
            type="text"
            placeholder="Cari nama / NISN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-8 pr-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary placeholder:text-n400"
          />
        </div>
        <select
          value={filterJalur}
          onChange={e => { setFilterJalur(e.target.value); setPage(1); fetchData({ jalur_id: e.target.value, page: 1 }) }}
          className="px-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary bg-white cursor-pointer"
        >
          <option value="">Semua Jalur</option>
          {jalurList.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
        </select>
      </div>

      {/* O3: Tombol Hitung SAW — hanya operator */}
      {isOperator && (
        <div className="flex flex-col gap-2 mb-4">
          {hitungSuccess && <p className="text-[12px] text-success font-semibold">{hitungSuccess}</p>}
          <div className="flex gap-2 flex-wrap">
            {jalurList.map(j => (
              <Button key={j.id} size="sm" variant="primary"
                onClick={() => setHitungModal({ open: true, jalur_id: j.id, jalur_nama: j.nama })}>
                <RiCalculatorLine size={13} /> Hitung SAW — {j.nama}
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
              <tr><td colSpan={10}>
                <EmptyState
                  icon={RiCalculatorLine}
                  title="Belum ada pendaftar terverifikasi"
                  description="Pendaftar akan muncul di sini setelah diverifikasi oleh operator."
                />
              </td></tr>
            ) : (
              data.map((d, i) => {
                const hasilStatus = d.seleksi?.hasil_status || 'belum_diproses'
                const cfg = HASIL_STATUS_LABEL[hasilStatus] || HASIL_STATUS_LABEL['belum_diproses']
                return (
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
                    <Td>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </Td>
                    <Td>
                      <Button size="xs" variant="ghost"
                        onClick={() => navigate(`/admin/pendaftar/${d.id}`, { state: { from: '/admin/seleksi-saw' } })}>
                        Detail
                      </Button>
                    </Td>
                  </Tr>
                )
              })
            )}
          </Table>

          <div className="flex items-center justify-between mt-3">
            <p className="text-[12px] text-n500">{meta.total ?? 0} pendaftar terverifikasi</p>
            <Pagination current={page} total={meta.last_page ?? 1} onChange={setPage} />
          </div>
        </>
      )}

      {/* Modal konfirmasi Hitung SAW */}
      <Modal
        isOpen={hitungModal.open}
        onClose={() => setHitungModal({ open: false, jalur_id: '', jalur_nama: '' })}
        title="Hitung Ranking SAW"
      >
        <p className="text-[13px] text-n600 mb-4">
          Hitung ranking SAW untuk jalur <strong>{hitungModal.jalur_nama}</strong>?
          Semua pendaftar terverifikasi di jalur ini akan diranking ulang berdasarkan nilai kriteria.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setHitungModal({ open: false, jalur_id: '', jalur_nama: '' })}>
            Batal
          </Button>
          <Button disabled={hitungLoading} onClick={handleHitungSAW}>
            {hitungLoading ? <Spinner size="sm" color="white" /> : <><RiCalculatorLine size={13} /> Ya, Hitung Sekarang</>}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default SeleksiSaw
