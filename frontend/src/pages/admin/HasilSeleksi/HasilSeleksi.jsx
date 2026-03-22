import { useState, useEffect } from 'react'
import { RiSearchLine, RiDownload2Line, RiCheckLine, RiCloseLine } from 'react-icons/ri'
import { Badge, Button, Table, Tr, Td, EmptyState, Modal, Spinner } from '../../../components/common'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import operatorService from '../../../services/operator.service'
import useAuthStore from '../../../store/authStore'
import sawService from '../../../services/saw.service'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const STATUS_LABEL = {
  diterima: 'Diterima',
  ditolak: 'Tidak Diterima',
}

function HasilSeleksi() {
  const { user } = useAuthStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterJalur, setFilterJalur] = useState('')
  const [ubahModal, setUbahModal] = useState({ open: false, item: null })
  const [saving, setSaving] = useState(false)
  const [jalurList, setJalurList] = useState([])
  const [hitungModal, setHitungModal] = useState({ open: false, jalur_id: '', jalur_nama: '' })
  const [hitungLoading, setHitungLoading] = useState(false)
  const [hitungSuccess, setHitungSuccess] = useState('')

  const userObj = {
    name: user?.name || 'Operator',
    avatarStyle: { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
  }

  const fetchData = () => {
    setLoading(true)
    operatorService.getHasilSeleksi({ status: filterStatus, jalur_id: filterJalur })
      .then(res => setData(res.data.hasil))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    import('../../../services/api').then(({ default: api }) => {
      api.get('/jalur-masuk').then(res => setJalurList(res.data.jalur))
    })
    fetchData()
  }, [filterStatus, filterJalur])

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

  const handleUbah = async (newStatus) => {
    setSaving(true)
    try {
      await operatorService.updateHasil(ubahModal.item.pendaftaran_id, {
        status_lulus: newStatus === 'diterima'
      })
      fetchData()
      setUbahModal({ open: false, item: null })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    const exportData = filtered.map((d, i) => ({
      'No': i + 1,
      'Ranking': d.ranking ? `#${d.ranking}` : '-',
      'Nama Siswa': d.nama,
      'NISN': d.data_diri?.nisn ?? '-',
      'Jenis Kelamin': d.data_diri?.jenis_kelamin ?? '-',
      'Agama': d.data_diri?.agama ?? '-',
      'Asal Sekolah': d.data_diri?.asal_sekolah ?? '-',
      'Jalur': d.jalur?.nama ?? '-',
      'Skor SAW': d.skor_saw ? parseFloat(d.skor_saw).toFixed(4) : '-',
      'Status': d.status_lulus ? 'Diterima' : 'Tidak Diterima',
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Hasil Seleksi')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, `Hasil_Seleksi_PPDB_${new Date().toLocaleDateString('id-ID')}.xlsx`)
  }

  const filtered = data.filter(d => {
    const matchSearch = d.nama?.toLowerCase().includes(search.toLowerCase()) ||
      d.nisn?.includes(search)
    return matchSearch
  })

  return (
    <DashboardLayout role="operator" user={userObj} activePath="/admin/seleksi">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Hasil Seleksi</h1>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-n400" />
          <input type="text" placeholder="Cari nama / NISN..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary placeholder:text-n400"
          />
        </div>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary bg-white cursor-pointer">
          <option value="">Semua Status</option>
          <option value="diterima">Diterima</option>
          <option value="ditolak">Tidak Diterima</option>
        </select>

        <select value={filterJalur} onChange={e => setFilterJalur(e.target.value)}
          className="px-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary bg-white cursor-pointer">
          <option value="">Semua Jalur</option>
          <option value="1">Zonasi</option>
          <option value="2">Prestasi</option>
          <option value="3">Afirmasi</option>
          <option value="4">Mutasi</option>
        </select>

        <Button onClick={handleExport} className="ml-auto">
          <RiDownload2Line size={14} /> Export
        </Button>
      </div>

      {hitungSuccess && (
        <div className="mb-3 text-[12px] text-success font-semibold">{hitungSuccess}</div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {jalurList.map(j => (
          <Button key={j.id} size="sm" variant="ghost"
            onClick={() => setHitungModal({ open: true, jalur_id: j.id, jalur_nama: j.nama })}>
            Hitung SAW — {j.nama}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <Table headers={['No.', 'Ranking', 'Nama Siswa', 'NISN', 'Jenis Kelamin', 'Agama', 'Asal Sekolah', 'Jalur', 'Skor SAW', 'Status', 'Aksi']}>
            {filtered.length === 0 ? (
              <tr><td colSpan={9}>
                <EmptyState icon={RiSearchLine} title="Data tidak ditemukan" description="Belum ada hasil seleksi." />
              </td></tr>
            ) : (
              filtered.map((d, i) => (
                <Tr key={d.pendaftaran_id}>
                  <Td className="text-n500">{i + 1}</Td>
                  <Td className="font-bold text-primary text-center">
                    {d.ranking ? `#${d.ranking}` : '-'}
                  </Td>
                  <Td className="font-semibold text-n800">{d.nama}</Td>
                  <Td className="text-n600">{d.data_diri?.nisn ?? '-'}</Td>
                  <Td>{d.data_diri?.jenis_kelamin ?? '-'}</Td>
                  <Td>{d.data_diri?.agama ?? '-'}</Td>
                  <Td>{d.data_diri?.asal_sekolah ?? '-'}</Td>
                  <Td className="font-semibold">{d.jalur?.nama ?? '-'}</Td>
                  <Td className="text-center font-semibold">
                    {d.skor_saw ? parseFloat(d.skor_saw).toFixed(4) : '-'}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      {d.status_lulus
                        ? <RiCheckLine size={13} className="text-success" />
                        : <RiCloseLine size={13} className="text-danger" />}
                      <Badge variant={d.status_lulus ? 'diterima' : 'ditolak'}>
                        {d.status_lulus ? 'Diterima' : 'Tidak Diterima'}
                      </Badge>
                    </div>
                  </Td>
                  <Td>
                    <Button size="xs" variant="ghost" onClick={() => setUbahModal({ open: true, item: d })}>
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

        </>
      )}

      <Modal isOpen={ubahModal.open} onClose={() => setUbahModal({ open: false, item: null })} title="Ubah Status Seleksi">
        {ubahModal.item && (
          <>
            <p className="text-[13px] text-n600 mb-4">
              Ubah status seleksi untuk <strong>{ubahModal.item.nama}</strong>
            </p>
            <div className="flex gap-2">
              <Button variant="success" fullWidth disabled={saving} onClick={() => handleUbah('diterima')}>
                {saving ? <Spinner size="sm" color="white" /> : <><RiCheckLine size={14} /> Diterima</>}
              </Button>
              <Button variant="danger" fullWidth disabled={saving} onClick={() => handleUbah('ditolak')}>
                {saving ? <Spinner size="sm" color="white" /> : <><RiCloseLine size={14} /> Tidak Diterima</>}
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Modal isOpen={hitungModal.open} onClose={() => setHitungModal({ open: false, jalur_id: '', jalur_nama: '' })}
        title="Hitung Ranking SAW">
        <p className="text-[13px] text-n600 mb-4">
          Hitung ranking SAW untuk jalur <strong>{hitungModal.jalur_nama}</strong>? Semua pendaftar jalur ini yang sudah diinput nilainya akan diranking ulang.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setHitungModal({ open: false, jalur_id: '', jalur_nama: '' })}>Batal</Button>
          <Button variant="primary" disabled={hitungLoading} onClick={handleHitungSAW}>
            {hitungLoading ? <Spinner size="sm" color="white" /> : 'Ya, Hitung Sekarang'}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default HasilSeleksi