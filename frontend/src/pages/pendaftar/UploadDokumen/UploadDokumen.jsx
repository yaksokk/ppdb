import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiInformationLine, RiAlertLine, RiCheckLine, RiFileTextLine, RiHomeSmileLine, RiTrophyLine, RiBankCardLine } from 'react-icons/ri'
import { Button, Spinner, Alert } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'
import pendaftarService from '../../../services/pendaftar.service'
import useAuthStore from '../../../store/authStore'

const DOKUMEN_WAJIB = [
  { id: 'akta',   nama: 'Akta Kelahiran',                  icon: RiFileTextLine,  wajib: true },
  { id: 'kk',     nama: 'Kartu Keluarga',                  icon: RiHomeSmileLine, wajib: true },
  { id: 'ijazah', nama: 'Ijazah / Surat Keterangan Lulus', icon: RiFileTextLine,  wajib: true },
  { id: 'rapor',  nama: 'Rapor Kelas 4-6 SD',              icon: RiFileTextLine,  wajib: true },
]

const DOKUMEN_OPSIONAL = [
  { id: 'kip',        nama: 'Kartu KIP / PKH',           jalur: 'Jalur Afirmasi',  icon: RiBankCardLine  },
  { id: 'sertifikat', nama: 'Sertifikat / Piagam Prestasi', jalur: 'Jalur Prestasi', icon: RiTrophyLine  },
  { id: 'surattugas', nama: 'Surat Tugas Orang Tua',     jalur: 'Jalur Mutasi',    icon: RiFileTextLine  },
]

function DokItem({ dok, statusData, onUpload, loading }) {
  const ref  = useRef()
  const Icon = dok.icon
  const s    = statusData[dok.id]

  const bgClass = s?.status === 'valid'      ? 'border-green-200 bg-success-light'
                : s?.status === 'perbaikan'  ? 'border-orange-200 bg-orange-50'
                : 'border-dashed border-n300 bg-white hover:border-primary hover:bg-primary-light/30'

  return (
    <div className={`border-2 rounded-md p-4 transition-all duration-150 ${bgClass} ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !loading && ref.current.click()}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon size={20} className={`flex-shrink-0 ${s?.status === 'valid' ? 'text-success' : s?.status === 'perbaikan' ? 'text-orange-500' : 'text-n400'}`} />
          <div>
            <p className="text-[13px] font-semibold text-n800">
              {dok.nama} {dok.wajib && <span className="text-danger">*</span>}
              {dok.jalur && <span className="text-[11px] font-normal text-n500 ml-1">({dok.jalur})</span>}
            </p>
            <p className="text-[11px] text-n500">
              {s?.file_path ? `${s.file_path.split('/').pop()} — klik untuk ganti` : 'Klik untuk pilih file · JPG / PNG / PDF · Maks. 2 MB'}
            </p>
          </div>
        </div>
        {s?.status === 'valid' && (
          <span className="text-[12px] font-semibold text-success flex items-center gap-1">
            <RiCheckLine size={13} /> Tersimpan
          </span>
        )}
        {s?.status === 'perbaikan' && (
          <span className="text-[12px] font-semibold text-orange-500 flex items-center gap-1">
            <RiAlertLine size={13} /> Perbaikan
          </span>
        )}
      </div>
      {s?.catatan && (
        <div className="mt-3 flex items-start gap-2 bg-orange-100 border border-orange-200 rounded-xs px-3 py-2">
          <RiAlertLine size={13} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-orange-800 leading-snug">
            <strong>Catatan Operator:</strong> {s.catatan}
          </p>
        </div>
      )}
      <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
        onChange={e => onUpload(dok.id, e.target.files[0])} />
    </div>
  )
}

function UploadDokumen() {
  const navigate              = useNavigate()
  const { user }              = useAuthStore()
  const [statusData, setStatusData] = useState({})
  const [loading, setLoading]       = useState(false)
  const [loadingInit, setLoadingInit] = useState(true)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg]     = useState('')

  useEffect(() => {
    pendaftarService.getStatus()
      .then(res => {
        const dokumen = res.data.pendaftaran?.dokumen || []
        const mapped  = {}
        dokumen.forEach(d => { mapped[d.jenis] = d })
        setStatusData(mapped)
      })
      .catch(() => {})
      .finally(() => setLoadingInit(false))
  }, [])

  const handleUpload = async (jenis, file) => {
    if (!file) return
    setLoading(true)
    setErrorMsg('')
    try {
      const formData = new FormData()
      formData.append('jenis', jenis)
      formData.append('file', file)
      await pendaftarService.uploadDokumen(formData)
      setStatusData(prev => ({
        ...prev,
        [jenis]: { ...prev[jenis], file_path: file.name, status: 'belum', catatan: null }
      }))
      setSuccessMsg('Dokumen berhasil diupload!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal upload dokumen')
    } finally {
      setLoading(false)
    }
  }

  const handleKirim = async () => {
    setLoading(true)
    try {
      await pendaftarService.submit()
      navigate('/pendaftar/dashboard')
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal mengirim dokumen')
    } finally {
      setLoading(false)
    }
  }

  const userObj = { name: user?.name || 'Pendaftar', avatarStyle: { background: 'rgba(37,99,235,.25)', color: '#93C5FD' } }

  if (loadingInit) return (
    <AdminLayout role="pendaftar" user={userObj} activePath="/pendaftar/dokumen">
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </AdminLayout>
  )

  return (
    <AdminLayout role="pendaftar" user={userObj} activePath="/pendaftar/dokumen">
      <div className="mb-4">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Upload Dokumen</h1>
      </div>

      {successMsg && <div className="mb-3"><Alert variant="green">{successMsg}</Alert></div>}
      {errorMsg   && <div className="mb-3"><Alert variant="red">{errorMsg}</Alert></div>}

      <div className="flex items-center gap-2 bg-primary-light border border-blue-200 rounded-sm px-4 py-3 mb-4">
        <RiInformationLine size={15} className="text-primary flex-shrink-0" />
        <p className="text-[12px] text-blue-800">
          Format JPG, PNG, atau PDF · Maksimal 2 MB per file · Pastikan dokumen terbaca jelas.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[14px] font-bold font-poppins text-n800 mb-3">Dokumen Wajib</p>
          <div className="flex flex-col gap-3">
            {DOKUMEN_WAJIB.map(dok => (
              <DokItem key={dok.id} dok={dok} statusData={statusData} onUpload={handleUpload} loading={loading} />
            ))}
          </div>
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[14px] font-bold font-poppins text-n800 mb-1">
            Dokumen Opsional
            <span className="text-[12px] font-normal text-n500 ml-1">(unggah sesuai jalur yang dipilih)</span>
          </p>
          <div className="flex flex-col gap-3 mt-3">
            {DOKUMEN_OPSIONAL.map(dok => (
              <DokItem key={dok.id} dok={dok} statusData={statusData} onUpload={handleUpload} loading={loading} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate('/pendaftar/formulir')}>
          ← Kembali ke Formulir
        </Button>
        <Button onClick={handleKirim} disabled={loading}>
          {loading ? <><Spinner size="sm" color="white" /> Memproses...</> : <><RiCheckLine size={14} /> Kirim Dokumen</>}
        </Button>
      </div>
    </AdminLayout>
  )
}

export default UploadDokumen