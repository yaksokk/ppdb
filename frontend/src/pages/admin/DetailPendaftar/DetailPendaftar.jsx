import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  RiArrowLeftLine, RiCheckLine, RiCloseLine, RiTimeLine,
  RiFileTextLine, RiTrophyLine, RiAlertLine, RiShieldCheckLine,
  RiMapPinLine, RiHomeSmileLine,
} from 'react-icons/ri'
import { Badge, Button, Modal, Spinner } from '../../../components/common'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import operatorService from '../../../services/operator.service'
import adminService from '../../../services/admin.service'
import kriteriaService from '../../../services/kriteria.service'
import useAuthStore from '../../../store/authStore'

const STATUS_BANNER = {
  menunggu:      { bg: 'bg-warning-light border-amber-200',  textColor: 'text-warning',     icon: RiTimeLine,        label: 'Menunggu Verifikasi Dokumen' },
  perbaikan:     { bg: 'bg-orange-50 border-orange-200',     textColor: 'text-orange-600',   icon: RiAlertLine,       label: 'Perlu Perbaikan Dokumen' },
  terverifikasi: { bg: 'bg-blue-50 border-blue-200',         textColor: 'text-blue-600',     icon: RiShieldCheckLine, label: 'Terverifikasi — Menunggu Seleksi SAW' },
  diterima:      { bg: 'bg-success-light border-green-200',  textColor: 'text-success',      icon: RiCheckLine,       label: 'Pendaftar Diterima' },
  ditolak:       { bg: 'bg-danger-light border-red-200',     textColor: 'text-danger',       icon: RiCloseLine,       label: 'Pendaftar Ditolak' },
}

const SEMESTER_LABEL = {
  '4a': 'Kls 4 Sem 1', '4b': 'Kls 4 Sem 2',
  '5a': 'Kls 5 Sem 1', '5b': 'Kls 5 Sem 2',
  '6a': 'Kls 6 Sem 1',
}

function InfoRow({ label, value }) {
  return (
    <div className="flex py-[7px] border-b border-n200 last:border-0">
      <span className="text-[12px] text-n500 w-[160px] flex-shrink-0">{label}</span>
      <span className="text-[13px] text-n800 flex-1">{value}</span>
    </div>
  )
}

function DetailPendaftar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { id }    = useParams()
  const { user }  = useAuthStore()

  const [data,         setData]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [catatanModal, setCatatanModal] = useState({ open: false, id: null, catatan: '' })
  const [konfirmasi,   setKonfirmasi]   = useState({ open: false, tipe: null })
  const [saving,       setSaving]       = useState(false)
  const [kriteriaList, setKriteriaList] = useState([])

  const isAdmin    = user?.role === 'admin'
  const isOperator = user?.role === 'operator'
  const fromPath   = location.state?.from || '/admin/pendaftar'

  const userObj = {
    name: user?.name || (isAdmin ? 'Admin' : 'Operator'),
    avatarStyle: isAdmin
      ? { background: 'rgba(217,119,6,.2)', color: '#FCD34D' }
      : { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
  }

  const fetchData = () => {
    const svc = isAdmin
      ? adminService.getDetailPendaftar(id)
      : operatorService.getDetailPendaftar(id)

    svc
      .then(res => {
        const p = res.data.pendaftaran
        setData(p)
        if (p?.jalur_id) {
          kriteriaService.getByJalur(p.jalur_id)
            .then(kr => setKriteriaList(kr.data.kriteria))
            .catch(() => {})
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [id])

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

  const handleSetValid = async () => {
    setSaving(true)
    try {
      await operatorService.setValid(id)
      fetchData()
      setKonfirmasi({ open: false, tipe: null })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleKirimPerbaikan = async () => {
    setSaving(true)
    try {
      await operatorService.kirimPerbaikan(id)
      fetchData()
      setKonfirmasi({ open: false, tipe: null })
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
    <DashboardLayout role={user?.role || 'operator'} user={userObj} activePath="/admin/pendaftar">
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </DashboardLayout>
  )

  if (!data) return (
    <DashboardLayout role={user?.role || 'operator'} user={userObj} activePath="/admin/pendaftar">
      <p className="text-n500 text-[13px]">Data tidak ditemukan.</p>
    </DashboardLayout>
  )

  const bannerConfig     = STATUS_BANNER[data.status] || STATUS_BANNER['menunggu']
  const BannerIcon       = bannerConfig.icon
  const dokumenWajib     = data.dokumen?.filter(d => ['akta', 'kk', 'ijazah', 'rapor'].includes(d.jenis)) || []
  const dokumenPendukung = data.dokumen?.filter(d => !['akta', 'kk', 'ijazah', 'rapor'].includes(d.jenis)) || []
  const totalDok         = data.dokumen?.length || 0
  const diperiksa        = data.dokumen?.filter(d => d.status !== 'belum').length || 0
  const allDocsChecked   = totalDok > 0 && data.dokumen?.every(d => d.status !== 'belum')

  const showOperatorButtons = isOperator && ['menunggu', 'perbaikan'].includes(data.status)

  // R2: ambil nilai kriteria dari data (read-only)
  const nilaiRaporArr  = data.nilai_rapor || []
  const rataRataRapor  = nilaiRaporArr.length
    ? (nilaiRaporArr.reduce((s, r) => s + parseFloat(r.nilai), 0) / nilaiRaporArr.length).toFixed(2)
    : null

  // R3: keputusan final admin hanya boleh jika sudah_saw
  const hasilStatus      = data.seleksi?.hasil_status
  const canAdminDecide   = isAdmin && hasilStatus === 'sudah_saw'

  const backPath = data.status === 'terverifikasi' ? '/admin/seleksi-saw' : '/admin/pendaftar'

  const renderDokItem = (dok) => (
    <div key={dok.id} className={`border rounded-md p-3 mb-2 last:mb-0 transition-all
      ${dok.status === 'valid'     ? 'border-green-200 bg-success-light' : ''}
      ${dok.status === 'perbaikan' ? 'border-orange-200 bg-orange-50'    : ''}
      ${dok.status === 'belum'     ? 'border-n200 bg-white'              : ''}
    `}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <RiFileTextLine size={14} className="text-n400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-n700 capitalize">
              {dok.jenis.replace('_', ' ')}
              {dok.sub_kategori && (
                <span className="ml-1 text-[11px] font-normal text-n500">({dok.sub_kategori})</span>
              )}
            </p>
            <a
              href={`http://127.0.0.1:8000/storage/${dok.file_path}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-primary hover:underline truncate block"
            >
              {dok.nama_file || dok.file_path?.split('/').pop()}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => handleVerifikasiDok(dok.id, 'valid')}
            className={`w-7 h-7 rounded-xs border flex items-center justify-center transition-all
              ${dok.status === 'valid' ? 'bg-success border-success text-white' : 'border-green-300 text-success hover:bg-success-light'}`}
          >
            <RiCheckLine size={13} />
          </button>
          <button
            onClick={() => setCatatanModal({ open: true, id: dok.id, catatan: '' })}
            className={`w-7 h-7 rounded-xs border flex items-center justify-center transition-all
              ${dok.status === 'perbaikan' ? 'bg-danger border-danger text-white' : 'border-red-300 text-danger hover:bg-danger-light'}`}
          >
            <RiCloseLine size={13} />
          </button>
          <span className={`text-[11px] font-semibold ml-1
            ${dok.status === 'valid'     ? 'text-success'    : ''}
            ${dok.status === 'perbaikan' ? 'text-orange-500' : ''}
            ${dok.status === 'belum'     ? 'text-n400'       : ''}
          `}>
            {dok.status === 'valid'     && <span className="flex items-center gap-0.5"><RiCheckLine size={11}/> Valid</span>}
            {dok.status === 'perbaikan' && <span className="flex items-center gap-0.5"><RiAlertLine size={11}/> Perbaikan</span>}
            {dok.status === 'belum'     && <span className="flex items-center gap-0.5"><RiTimeLine  size={11}/> Belum</span>}
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
    <DashboardLayout role={user?.role || 'operator'} user={userObj} activePath="/admin/pendaftar">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[19px] font-extrabold font-poppins text-n800">Detail & Verifikasi</h1>
          <div className="flex items-center gap-1.5 mt-1 text-[12px] text-n500">
            <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate(backPath)}>
              ← {data.status === 'terverifikasi' ? 'Seleksi SAW' : 'Data Pendaftar'}
            </span>
            <span>·</span><span>{data.data_diri?.nama_lengkap}</span>
            <span>·</span><span>{data.no_pendaftaran}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate(backPath)}>
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

          {/* Data Siswa */}
          <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
            <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Data Siswa</p>
            <InfoRow label="Nama Lengkap"     value={data.data_diri?.nama_lengkap} />
            <InfoRow label="NISN"             value={data.data_diri?.nisn} />
            <InfoRow label="Jenis Kelamin"    value={data.data_diri?.jenis_kelamin} />
            <InfoRow label="Tempat/Tgl Lahir" value={`${data.data_diri?.tempat_lahir}, ${data.data_diri?.tgl_lahir
              ? new Date(data.data_diri.tgl_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : '-'}`} />
            <InfoRow label="Agama"         value={data.data_diri?.agama} />
            <InfoRow label="Asal Sekolah"  value={data.data_diri?.asal_sekolah} />
            <InfoRow label="Tahun Lulus"   value={data.data_diri?.tahun_lulus} />
            <InfoRow label="Jalur Dipilih" value={
              <span className="flex items-center gap-1 font-semibold">
                <RiTrophyLine size={13} className="text-warning" /> {data.jalur?.nama}
              </span>
            } />
            {/* R1: Tampilkan nama_desa dan jarak_km */}
            {data.data_diri?.nama_desa && (
              <InfoRow label="Desa Domisili" value={
                <span className="flex items-center gap-1">
                  <RiHomeSmileLine size={13} className="text-primary flex-shrink-0" />
                  {data.data_diri.nama_desa}
                </span>
              } />
            )}
            {data.data_diri?.jarak_km != null && (
              <InfoRow label="Jarak ke Sekolah" value={
                <span className="font-semibold text-primary">{data.data_diri.jarak_km} km</span>
              } />
            )}
          </div>

          {/* Nilai Rapor */}
          {nilaiRaporArr.length > 0 && (
            <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
              <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Nilai Rapor Per Semester</p>
              <div className="grid grid-cols-5 gap-3 mb-3">
                {nilaiRaporArr
                  .slice()
                  .sort((a, b) => a.semester.localeCompare(b.semester))
                  .map(r => (
                    <div key={r.semester} className="bg-n50 border border-n200 rounded-sm p-2.5 text-center">
                      <p className="text-[10px] font-bold text-n500 uppercase tracking-wide mb-1">
                        {SEMESTER_LABEL[r.semester] || r.semester}
                      </p>
                      <p className="text-[18px] font-extrabold text-n800">{parseFloat(r.nilai).toFixed(1)}</p>
                    </div>
                  ))}
              </div>
              {rataRataRapor && (
                <div className="flex items-center justify-between px-3 py-2 bg-primary-light border border-blue-200 rounded-sm">
                  <span className="text-[12px] text-n600">Rata-rata dari {nilaiRaporArr.length} semester</span>
                  <span className="text-[15px] font-extrabold text-primary">{rataRataRapor}</span>
                </div>
              )}
            </div>
          )}

          {/* Data Orang Tua */}
          <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
            <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Data Orang Tua / Wali</p>
            <InfoRow label="Nama"        value={data.data_orang_tua?.nama} />
            <InfoRow label="Hubungan"    value={data.data_orang_tua?.hubungan} />
            <InfoRow label="Pekerjaan"   value={data.data_orang_tua?.pekerjaan} />
            <InfoRow label="No. Telepon" value={data.data_orang_tua?.no_telepon} />
          </div>

          {/* R2: Nilai Kriteria SAW — READ ONLY, tanpa form input */}
          {kriteriaList.length > 0 && (
            <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[15px] font-bold font-poppins text-n800">Nilai Kriteria SAW</p>
                <span className="text-[11px] text-n400 bg-n50 border border-n200 px-2 py-0.5 rounded-pill">
                  Diisi otomatis oleh sistem
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {kriteriaList.map(k => {
                  const nilaiObj = data.nilai_kriteria?.find(n => n.kriteria_id === k.id)
                  const nilai    = nilaiObj ? parseFloat(nilaiObj.nilai) : null

                  return (
                    <div key={k.id} className="flex items-center gap-3 py-2 border-b border-n100 last:border-0">
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold text-n700">{k.nama}</p>
                        <p className="text-[11px] text-n400">
                          {k.deskripsi} · {k.jenis === 'benefit' ? 'Benefit' : 'Cost'} · Bobot {k.bobot}%
                        </p>
                      </div>
                      <div className={`w-20 text-center px-3 py-1.5 rounded-sm text-[13px] font-bold
                        ${nilai !== null
                          ? 'bg-primary-light text-primary border border-blue-200'
                          : 'bg-n100 text-n400 border border-n200'}`}>
                        {nilai !== null ? nilai.toFixed(2) : '—'}
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-[11px] text-n400 mt-3">
                Nilai diisi otomatis dari data formulir (rapor, desa, dokumen). Tidak dapat diubah manual.
              </p>
            </div>
          )}

          {/* O2: Tombol operator */}
          {showOperatorButtons && (
            <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
              <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Verifikasi Pendaftaran</p>
              <div className="flex gap-2 mb-3">
                <Button
                  variant="success" fullWidth
                  disabled={!allDocsChecked}
                  onClick={() => setKonfirmasi({ open: true, tipe: 'valid' })}
                >
                  <RiCheckLine size={14} /> Valid
                </Button>
                <Button
                  variant="warning" fullWidth
                  onClick={() => setKonfirmasi({ open: true, tipe: 'perbaikan' })}
                >
                  <RiAlertLine size={14} /> Kirim Perbaikan
                </Button>
              </div>
              {!allDocsChecked && (
                <p className="text-[11px] text-n500">
                  Tombol <strong>Valid</strong> aktif setelah semua dokumen ({totalDok}) diperiksa ({diperiksa}/{totalDok}).
                </p>
              )}
            </div>
          )}

          {/* R3: Admin — Keputusan Akhir hanya jika sudah_saw */}
          {isAdmin && (
            <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
              <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Keputusan Akhir</p>
              {canAdminDecide ? (
                <>
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
                </>
              ) : (
                <div className="bg-n50 border border-n200 rounded-sm px-3 py-2 text-[12px] text-n600">
                  {!hasilStatus || hasilStatus === 'belum_diproses'
                    ? 'Keputusan final dapat ditetapkan setelah ranking SAW dihitung oleh operator.'
                    : hasilStatus === 'diterima' || hasilStatus === 'ditolak'
                      ? `Keputusan sudah ditetapkan: ${hasilStatus === 'diterima' ? 'Diterima' : 'Ditolak'}.`
                      : '—'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Kolom dokumen */}
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

      {/* Modal catatan perbaikan */}
      <Modal isOpen={catatanModal.open} onClose={() => setCatatanModal({ open: false, id: null, catatan: '' })} title="Catatan Perbaikan">
        <p className="text-[12px] text-n500 mb-3">Tulis catatan untuk pendaftar mengenai dokumen yang perlu diperbaiki.</p>
        <textarea rows={3} value={catatanModal.catatan}
          onChange={e => setCatatanModal({ ...catatanModal, catatan: e.target.value })}
          placeholder="Contoh: Foto KTP tidak jelas, harap upload ulang..."
          className="w-full px-3 py-2 text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary resize-none"
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="ghost" onClick={() => setCatatanModal({ open: false, id: null, catatan: '' })}>Batal</Button>
          <Button variant="danger" disabled={saving}
            onClick={() => handleVerifikasiDok(catatanModal.id, 'perbaikan', catatanModal.catatan)}>
            {saving ? <Spinner size="sm" color="white" /> : 'Tandai Perbaikan'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={konfirmasi.open && konfirmasi.tipe === 'valid'}
        onClose={() => setKonfirmasi({ open: false, tipe: null })} title="Verifikasi Pendaftar">
        <p className="text-[13px] text-n600 mb-4">
          Tandai pendaftar ini sebagai <strong>terverifikasi</strong>? Data akan dipindahkan ke menu Seleksi SAW.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setKonfirmasi({ open: false, tipe: null })}>Batal</Button>
          <Button variant="success" disabled={saving} onClick={handleSetValid}>
            {saving ? <Spinner size="sm" color="white" /> : 'Ya, Valid'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={konfirmasi.open && konfirmasi.tipe === 'perbaikan'}
        onClose={() => setKonfirmasi({ open: false, tipe: null })} title="Kirim Perbaikan">
        <p className="text-[13px] text-n600 mb-4">
          Kirim notifikasi perbaikan ke pendaftar? Status akan berubah menjadi <strong>Perbaikan</strong>.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setKonfirmasi({ open: false, tipe: null })}>Batal</Button>
          <Button variant="warning" disabled={saving} onClick={handleKirimPerbaikan}>
            {saving ? <Spinner size="sm" color="white" /> : 'Ya, Kirim Perbaikan'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={konfirmasi.open && (konfirmasi.tipe === 'terima' || konfirmasi.tipe === 'tolak')}
        onClose={() => setKonfirmasi({ open: false, tipe: null })}
        title={konfirmasi.tipe === 'terima' ? 'Terima Pendaftar' : 'Tolak Pendaftar'}>
        <p className="text-[13px] text-n600 mb-4">
          {konfirmasi.tipe === 'terima'
            ? 'Apakah kamu yakin ingin menerima pendaftar ini?'
            : 'Apakah kamu yakin ingin menolak pendaftar ini?'}
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setKonfirmasi({ open: false, tipe: null })}>Batal</Button>
          <Button variant={konfirmasi.tipe === 'terima' ? 'success' : 'danger'} disabled={saving}
            onClick={() => handleKeputusan(konfirmasi.tipe)}>
            {saving ? <Spinner size="sm" color="white" /> : konfirmasi.tipe === 'terima' ? 'Ya, Terima' : 'Ya, Tolak'}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default DetailPendaftar
