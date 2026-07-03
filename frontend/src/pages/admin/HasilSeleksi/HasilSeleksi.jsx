import { useState, useEffect } from 'react'
import {
  RiSearchLine, RiDownload2Line, RiCheckLine,
  RiCloseLine, RiTimeLine, RiBarChartLine,
} from 'react-icons/ri'
import { Badge, Button, Table, Tr, Td, EmptyState, Modal, Spinner } from '../../../components/common'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import operatorService from '../../../services/operator.service'
import useAuthStore from '../../../store/authStore'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// R3: Konfigurasi label dan warna per hasil_status
const HASIL_STATUS_CONFIG = {
  belum_diproses: {
    label:   'Belum Diproses',
    variant: 'belum_diproses',
    icon:    RiTimeLine,
  },
  sudah_saw: {
    label:   'Sudah Diranking',
    variant: 'sudah_saw',
    icon:    RiBarChartLine,
  },
  diterima: {
    label:   'Diterima',
    variant: 'diterima',
    icon:    RiCheckLine,
  },
  ditolak: {
    label:   'Tidak Diterima',
    variant: 'ditolak',
    icon:    RiCloseLine,
  },
}

function HasilStatusBadge({ hasilStatus }) {
  const config = HASIL_STATUS_CONFIG[hasilStatus] || HASIL_STATUS_CONFIG['belum_diproses']
  const Icon   = config.icon
  return (
    <div className="flex items-center gap-1">
      <Icon size={13} className={
        hasilStatus === 'diterima'      ? 'text-success'   :
        hasilStatus === 'ditolak'       ? 'text-danger'    :
        hasilStatus === 'sudah_saw'     ? 'text-blue-600'  :
        'text-n400'
      } />
      <Badge variant={config.variant}>{config.label}</Badge>
    </div>
  )
}

function HasilSeleksi() {
  const { user } = useAuthStore()

  const [data,          setData]          = useState([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [filterStatus,  setFilterStatus]  = useState('')
  const [filterJalur,   setFilterJalur]   = useState('')
  const [ubahModal,     setUbahModal]     = useState({ open: false, item: null })
  const [saving,        setSaving]        = useState(false)
  const [errorMsg,      setErrorMsg]      = useState('')

  const userObj = {
    name: user?.name || 'Operator',
    avatarStyle: { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
  }

  const fetchData = () => {
    setLoading(true)
    operatorService.getHasilSeleksi({ hasil_status: filterStatus, jalur_id: filterJalur })
      .then(res => setData(res.data.hasil))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [filterStatus, filterJalur])

  const handleUbah = async (newStatus) => {
    setErrorMsg('')
    setSaving(true)
    try {
      await operatorService.updateHasil(ubahModal.item.pendaftaran_id, {
        status_lulus: newStatus === 'diterima',
      })
      fetchData()
      setUbahModal({ open: false, item: null })
    } catch (err) {
      // R3: tampilkan pesan error jika belum sudah_saw
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan.')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    const exportData = filtered.map((d, i) => ({
      'No':            i + 1,
      'Ranking':       d.ranking ? `#${d.ranking}` : '-',
      'Nama Siswa':    d.nama,
      'NISN':          d.data_diri?.nisn ?? '-',
      'Jenis Kelamin': d.data_diri?.jenis_kelamin ?? '-',
      'Agama':         d.data_diri?.agama ?? '-',
      'Asal Sekolah':  d.data_diri?.asal_sekolah ?? '-',
      'Jalur':         d.jalur?.nama ?? '-',
      'Skor SAW':      d.skor_saw ? parseFloat(d.skor_saw).toFixed(4) : '-',
      'Status':        HASIL_STATUS_CONFIG[d.hasil_status]?.label ?? d.hasil_status,
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

  // Hitung ringkasan per status
  const summary = data.reduce((acc, d) => {
    const s = d.hasil_status || 'belum_diproses'
    acc[s]  = (acc[s] || 0) + 1
    return acc
  }, {})

  return (
    <DashboardLayout role="operator" user={userObj} activePath="/admin/seleksi">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Hasil Seleksi</h1>
        <p className="text-[12px] text-n500 mt-0.5">
          Kelola keputusan final pendaftar yang sudah diranking SAW
        </p>
      </div>

      {/* R3: Ringkasan status */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {Object.entries(HASIL_STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="bg-white border border-n200 rounded-lg p-3 shadow-xs">
            <p className="text-[11px] text-n500 mb-1">{cfg.label}</p>
            <p className="text-[22px] font-extrabold text-n800">{summary[key] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-n400" />
          <input type="text" placeholder="Cari nama / NISN..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary placeholder:text-n400"
          />
        </div>

        {/* R3: Filter berdasarkan hasil_status */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary bg-white cursor-pointer">
          <option value="">Semua Status</option>
          <option value="belum_diproses">Belum Diproses</option>
          <option value="sudah_saw">Sudah Diranking</option>
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

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <Table headers={['No.', 'Ranking', 'Nama Siswa', 'NISN', 'Jenis Kelamin', 'Asal Sekolah', 'Jalur', 'Skor SAW', 'Status', 'Aksi']}>
            {filtered.length === 0 ? (
              <tr><td colSpan={10}>
                <EmptyState icon={RiSearchLine} title="Data tidak ditemukan" description="Belum ada pendaftar yang tampil di halaman ini." />
              </td></tr>
            ) : (
              filtered.map((d, i) => (
                <Tr key={d.pendaftaran_id}>
                  <Td className="text-n500">{i + 1}</Td>
                  <Td className="font-bold text-primary text-center">
                    {d.ranking ? `#${d.ranking}` : '—'}
                  </Td>
                  <Td className="font-semibold text-n800">{d.nama}</Td>
                  <Td className="text-n600">{d.data_diri?.nisn ?? '-'}</Td>
                  <Td>{d.data_diri?.jenis_kelamin ?? '-'}</Td>
                  <Td>{d.data_diri?.asal_sekolah ?? '-'}</Td>
                  <Td className="font-semibold">{d.jalur?.nama ?? '-'}</Td>
                  <Td className="text-center font-semibold">
                    {d.skor_saw ? parseFloat(d.skor_saw).toFixed(4) : '—'}
                  </Td>
                  <Td>
                    <HasilStatusBadge hasilStatus={d.hasil_status} />
                  </Td>
                  <Td>
                    {/* R3: Tombol Ubah hanya aktif jika sudah_saw */}
                    <Button
                      size="xs"
                      variant={d.hasil_status === 'sudah_saw' ? 'primary' : 'ghost'}
                      disabled={d.hasil_status !== 'sudah_saw'}
                      onClick={() => { setErrorMsg(''); setUbahModal({ open: true, item: d }) }}
                    >
                      Keputusan
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

      <Modal isOpen={ubahModal.open} onClose={() => { setUbahModal({ open: false, item: null }); setErrorMsg('') }} title="Keputusan Final Seleksi">
        {ubahModal.item && (
          <>
            <p className="text-[13px] text-n600 mb-1">
              Tetapkan keputusan final untuk <strong>{ubahModal.item.nama}</strong>
            </p>
            <p className="text-[12px] text-n500 mb-4">
              Ranking: <strong>#{ubahModal.item.ranking}</strong> · Skor SAW: <strong>{ubahModal.item.skor_saw ? parseFloat(ubahModal.item.skor_saw).toFixed(4) : '—'}</strong>
            </p>
            {errorMsg && (
              <div className="mb-3 px-3 py-2 bg-danger-light border border-red-200 rounded-sm text-[12px] text-danger">
                {errorMsg}
              </div>
            )}
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
    </DashboardLayout>
  )
}

export default HasilSeleksi
