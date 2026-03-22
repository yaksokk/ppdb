import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RiArrowLeftLine, RiCheckLine, RiCloseLine, RiTimeLine, RiFileTextLine, RiTrophyLine, RiAlertLine } from 'react-icons/ri'
import { Badge, Button, Modal, Spinner } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'
import operatorService from '../../../services/operator.service'
import adminService from '../../../services/admin.service'
import kriteriaService from '../../../services/kriteria.service'
import useAuthStore from '../../../store/authStore'

const STATUS_BANNER = {
  menunggu: { bg: 'bg-warning-light border-amber-200', textColor: 'text-warning', icon: RiTimeLine, label: 'Menunggu Verifikasi Dokumen' },
  perbaikan: { bg: 'bg-orange-50 border-orange-200', textColor: 'text-orange-600', icon: RiAlertLine, label: 'Perlu Perbaikan Dokumen' },
  diterima: { bg: 'bg-success-light border-green-200', textColor: 'text-success', icon: RiCheckLine, label: 'Pendaftar Diterima' },
  ditolak: { bg: 'bg-danger-light border-red-200', textColor: 'text-danger', icon: RiCloseLine, label: 'Pendaftar Ditolak' },
}

function InfoRow({ label, value }) {
  return (
    <div className="flex py-[7px] border-b border-n200 last:border-0">
      <span className="text-[12px] text-n500 w-[140px] flex-shrink-0">{label}</span>
      <span className="text-[13px] text-n800 flex-1">{value}</span>
    </div>
  )
}

function DetailPendaftar() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuthStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [catatanModal, setCatatanModal] = useState({ open: false, id: null, catatan: '' })
  const [konfirmasi, setKonfirmasi] = useState({ open: false, tipe: null })
  const [saving, setSaving] = useState(false)
  const [kriteriaList, setKriteriaList] = useState([])
  const [nilaiForm, setNilaiForm] = useState({})
  const [savingNilai, setSavingNilai] = useState(false)
  const [nilaiSuccess, setNilaiSuccess] = useState('')

  const userObj = {
    name: user?.name || 'Operator',
    avatarStyle: { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
  }

  const fetchData = () => {
    operatorService.getDetailPendaftar(id)
      .then(res => setData(res.data.pendaftaran))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    operatorService.getDetailPendaftar(id)
      .then(res => {
        const p = res.data.pendaftaran
        setData(p)
        if (p?.jalur_id) {
          kriteriaService.getByJalur(p.jalur_id)
            .then(kr => {
              setKriteriaList(kr.data.kriteria)
              const initNilai = {}
              kr.data.kriteria.forEach(k => {
                const existing = p.nilai_kriteria?.find(n => n.kriteria_id === k.id)
                initNilai[k.id] = existing ? existing.nilai : ''
              })
              setNilaiForm(initNilai)
            })
            .catch(() => { })
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleSimpanNilai = async () => {
    setSavingNilai(true)
    try {
      const nilai = Object.keys(nilaiForm).map(kriteriaId => ({
        kriteria_id: parseInt(kriteriaId),
        nilai: parseFloat(nilaiForm[kriteriaId]),
      }))
      await operatorService.inputNilai(id, { nilai })
      setNilaiSuccess('Nilai berhasil disimpan!')
      setTimeout(() => setNilaiSuccess(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingNilai(false)
    }
  }

  const handleVerifikasiDok = async (dokId, status, catatan = null) => {
    setSaving(true)
    try {
      await adminService.verifikasiDokumen(dokId, { status, catatan })
      fetchData()
      setCatatanModal({ open: false, id: null, catatan: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleKeputusan = async (tipe) => {
    setSaving(true)
    try {
      await adminService.updateStatus(id, { status: tipe === 'terima' ? 'diterima' : 'ditolak' })
      fetchData()
      setKonfirmasi({ open: false, tipe: null })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <AdminLayout role="operator" user={userObj} activePath="/admin/pendaftar">
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </AdminLayout>
  )

  if (!data) return (
    <AdminLayout role="operator" user={userObj} activePath="/admin/pendaftar">
      <p className="text-n500 text-[13px]">Data tidak ditemukan.</p>
    </AdminLayout>
  )

  const bannerConfig = STATUS_BANNER[data.status] || STATUS_BANNER['menunggu']
  const BannerIcon = bannerConfig.icon
  const dokumenWajib = data.dokumen?.filter(d => ['akta', 'kk', 'ijazah', 'rapor'].includes(d.jenis)) || []
  const dokumenPendukung = data.dokumen?.filter(d => !['akta', 'kk', 'ijazah', 'rapor'].includes(d.jenis)) || []
  const totalDok = data.dokumen?.length || 0
  const diperiksa = data.dokumen?.filter(d => d.status !== 'belum').length || 0

  const renderDokItem = (dok) => (
    <div key={dok.id} className={`border rounded-md p-3 mb-2 last:mb-0 transition-all
      ${dok.status === 'valid' ? 'border-green-200 bg-success-light' : ''}
      ${dok.status === 'perbaikan' ? 'border-orange-200 bg-orange-50' : ''}
      ${dok.status === 'belum' ? 'border-n200 bg-white' : ''}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <RiFileTextLine size={16} className="text-n400 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-n400 uppercase tracking-wide">{dok.jenis}</p>
            <p className="text-[12px] font-semibold text-primary cursor-pointer hover:underline">
              {dok.file_path?.split('/').pop()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={() => handleVerifikasiDok(dok.id, 'valid')}
            className={`w-7 h-7 rounded-xs border flex items-center justify-center transition-all
              ${dok.status === 'valid' ? 'bg-success border-success text-white' : 'border-green-300 text-success hover:bg-success-light'}`}>
            <RiCheckLine size={13} />
          </button>
          <button onClick={() => setCatatanModal({ open: true, id: dok.id, catatan: '' })}
            className={`w-7 h-7 rounded-xs border flex items-center justify-center transition-all
              ${dok.status === 'perbaikan' ? 'bg-danger border-danger text-white' : 'border-red-300 text-danger hover:bg-danger-light'}`}>
            <RiCloseLine size={13} />
          </button>
          <span className={`text-[11px] font-semibold ml-1
            ${dok.status === 'valid' ? 'text-success' : ''}
            ${dok.status === 'perbaikan' ? 'text-orange-500' : ''}
            ${dok.status === 'belum' ? 'text-n400' : ''}
          `}>
            {dok.status === 'valid' ? <span className="flex items-center gap-0.5"><RiCheckLine size={11} /> Valid</span> : ''}
            {dok.status === 'perbaikan' ? <span className="flex items-center gap-0.5"><RiAlertLine size={11} /> Perbaikan</span> : ''}
            {dok.status === 'belum' ? <span className="flex items-center gap-0.5"><RiTimeLine size={11} /> Belum</span> : ''}
          </span>
        </div>
      </div>
      {dok.catatan && (
        <div className="mt-2 flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xs px-2 py-1.5">
          <RiAlertLine size={12} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-orange-800">{dok.catatan}</p>
        </div>
      )}
    </div>
  )

  return (
    <AdminLayout role="operator" user={userObj} activePath="/admin/pendaftar">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[19px] font-extrabold font-poppins text-n800">Detail & Verifikasi</h1>
          <div className="flex items-center gap-1.5 mt-1 text-[12px] text-n500">
            <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/admin/pendaftar')}>
              ← Data Pendaftar
            </span>
            <span>·</span>
            <span>{data.data_diri?.nama_lengkap}</span>
            <span>·</span>
            <span>{data.no_pendaftaran}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/pendaftar')}>
          <RiArrowLeftLine size={14} /> Kembali
        </Button>
      </div>

      <div className={`flex items-center gap-3 p-4 rounded-lg border mb-5 ${bannerConfig.bg}`}>
        <BannerIcon size={20} className={`flex-shrink-0 ${bannerConfig.textColor}`} />
        <div>
          <p className={`text-[14px] font-bold ${bannerConfig.textColor}`}>{bannerConfig.label}</p>
          <p className="text-[12px] text-n600">
            {data.no_pendaftaran} · Jalur: <strong>{data.jalur?.nama}</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
            <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Data Siswa</p>
            <InfoRow label="Nama Lengkap" value={data.data_diri?.nama_lengkap} />
            <InfoRow label="NISN" value={data.data_diri?.nisn} />
            <InfoRow label="Jenis Kelamin" value={data.data_diri?.jenis_kelamin} />
            <InfoRow label="Tempat/Tgl Lahir" value={`${data.data_diri?.tempat_lahir}, ${data.data_diri?.tgl_lahir
                ? new Date(data.data_diri.tgl_lahir).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })
                : '-'
              }`} />
            <InfoRow label="Agama" value={data.data_diri?.agama} />
            <InfoRow label="Asal Sekolah" value={data.data_diri?.asal_sekolah} />
            <InfoRow label="Tahun Lulus" value={data.data_diri?.tahun_lulus} />
            <InfoRow label="Jalur Dipilih" value={
              <span className="flex items-center gap-1 font-semibold">
                <RiTrophyLine size={13} className="text-warning" /> {data.jalur?.nama}
              </span>
            } />
          </div>

          <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
            <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Data Orang Tua / Wali</p>
            <InfoRow label="Nama" value={data.data_orang_tua?.nama} />
            <InfoRow label="Hubungan" value={data.data_orang_tua?.hubungan} />
            <InfoRow label="Pekerjaan" value={data.data_orang_tua?.pekerjaan} />
            <InfoRow label="No. Telepon" value={data.data_orang_tua?.no_telepon} />
          </div>

          {kriteriaList.length > 0 && (
            <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
              <p className="text-[15px] font-bold font-poppins text-n800 mb-3">
                Input Nilai Kriteria SAW
              </p>
              {nilaiSuccess && (
                <div className="mb-3 text-[12px] text-success font-semibold">{nilaiSuccess}</div>
              )}
              <div className="flex flex-col gap-3">
                {kriteriaList.map(k => (
                  <div key={k.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-[12px] font-semibold text-n700">{k.nama}</p>
                      <p className="text-[11px] text-n400">{k.deskripsi} · {k.jenis === 'benefit' ? 'Benefit' : 'Cost'} · Bobot {k.bobot}%</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={nilaiForm[k.id] || ''}
                      onChange={e => setNilaiForm({ ...nilaiForm, [k.id]: e.target.value })}
                      className="w-24 px-3 py-1.5 text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary text-center"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button size="sm" onClick={handleSimpanNilai} disabled={savingNilai}>
                  {savingNilai ? <Spinner size="sm" color="white" /> : 'Simpan Nilai'}
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
            <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Keputusan Akhir</p>
            <div className="flex gap-2 mb-3">
              <Button variant="success" fullWidth onClick={() => setKonfirmasi({ open: true, tipe: 'terima' })}>
                <RiCheckLine size={14} /> Terima Pendaftar
              </Button>
              <Button variant="danger" fullWidth onClick={() => setKonfirmasi({ open: true, tipe: 'tolak' })}>
                <RiCloseLine size={14} /> Tolak Pendaftar
              </Button>
            </div>
            <div className="bg-n50 border border-n200 rounded-sm px-3 py-2 text-[12px] text-n600">
              <strong>Terima</strong> → pindah ke Hasil Seleksi · <strong>Tolak</strong> → tidak diterima
            </div>
          </div>
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs h-fit">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[15px] font-bold font-poppins text-n800">Dokumen Pendaftar</p>
            <span className="text-[12px] text-n500">{diperiksa}/{totalDok} diperiksa</span>
          </div>

          <p className="text-[10px] font-bold text-n400 uppercase tracking-widest mb-2">Dokumen Wajib</p>
          {dokumenWajib.length > 0 ? dokumenWajib.map(renderDokItem) : <p className="text-[12px] text-n400">Belum ada dokumen</p>}

          <p className="text-[10px] font-bold text-n400 uppercase tracking-widest mt-4 mb-2">Dokumen Pendukung</p>
          {dokumenPendukung.length > 0 ? dokumenPendukung.map(renderDokItem) : <p className="text-[12px] text-n400">Belum ada dokumen</p>}
        </div>
      </div>

      <Modal isOpen={catatanModal.open} onClose={() => setCatatanModal({ open: false, id: null, catatan: '' })} title="Catatan Perbaikan">
        <p className="text-[12px] text-n500 mb-3">Tulis catatan untuk pendaftar mengenai dokumen yang perlu diperbaiki.</p>
        <textarea rows={3} value={catatanModal.catatan}
          onChange={e => setCatatanModal({ ...catatanModal, catatan: e.target.value })}
          placeholder="Contoh: Foto KTP tidak jelas, harap upload ulang..."
          className="w-full px-3 py-2 text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary resize-none"
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="ghost" onClick={() => setCatatanModal({ open: false, id: null, catatan: '' })}>Batal</Button>
          <Button variant="danger" disabled={saving} onClick={() => handleVerifikasiDok(catatanModal.id, 'perbaikan', catatanModal.catatan)}>
            {saving ? <Spinner size="sm" color="white" /> : 'Tandai Perbaikan'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={konfirmasi.open} onClose={() => setKonfirmasi({ open: false, tipe: null })}
        title={konfirmasi.tipe === 'terima' ? 'Terima Pendaftar' : 'Tolak Pendaftar'}>
        <p className="text-[13px] text-n600 mb-4">
          {konfirmasi.tipe === 'terima'
            ? 'Apakah kamu yakin ingin menerima pendaftar ini?'
            : 'Apakah kamu yakin ingin menolak pendaftar ini? Tindakan ini tidak bisa dibatalkan.'}
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setKonfirmasi({ open: false, tipe: null })}>Batal</Button>
          <Button variant={konfirmasi.tipe === 'terima' ? 'success' : 'danger'} disabled={saving}
            onClick={() => handleKeputusan(konfirmasi.tipe)}>
            {saving ? <Spinner size="sm" color="white" /> : konfirmasi.tipe === 'terima' ? 'Ya, Terima' : 'Ya, Tolak'}
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}

export default DetailPendaftar