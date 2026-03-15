import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiInformationLine, RiAlertLine, RiCheckLine, RiFileTextLine, RiHomeSmileLine, RiTrophyLine, RiBankCardLine } from 'react-icons/ri'
import { Button } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
  name: 'Ahmad Santoso',
  avatarStyle: { background: 'rgba(37,99,235,.25)', color: '#93C5FD' },
}

const DOKUMEN_WAJIB = [
  { id: 'akta',   nama: 'Akta Kelahiran',         icon: RiFileTextLine,  wajib: true  },
  { id: 'kk',     nama: 'Kartu Keluarga',          icon: RiHomeSmileLine, wajib: true  },
  { id: 'ijazah', nama: 'Ijazah / Surat Keterangan Lulus', icon: RiFileTextLine, wajib: true },
  { id: 'rapor',  nama: 'Rapor Kelas 4-6 SD',      icon: RiFileTextLine,  wajib: true  },
]

const DOKUMEN_OPSIONAL = [
  { id: 'kip',       nama: 'Kartu KIP / PKH',          jalur: 'Jalur Afirmasi',  icon: RiBankCardLine },
  { id: 'sertifikat',nama: 'Sertifikat / Piagam Prestasi', jalur: 'Jalur Prestasi', icon: RiTrophyLine },
  { id: 'surattugas',nama: 'Surat Tugas Orang Tua',    jalur: 'Jalur Mutasi',    icon: RiFileTextLine },
]

const DUMMY_STATUS = {
  kk:     { file: 'kk_ahmad.jpg',  size: '320 KB', status: 'perbaikan', catatan: 'Foto KK tidak jelas (blur). Harap upload ulang dengan gambar yang lebih jelas.' },
  ijazah: { file: 'skl_ahmad.pdf', size: '450 KB', status: 'tersimpan', catatan: null },
}

function DokItem({ dok, statusData, onUpload }) {
  const ref = useRef()
  const Icon = dok.icon
  const s = statusData[dok.id]

  const bgClass = s?.status === 'tersimpan'  ? 'border-green-200 bg-success-light'
                : s?.status === 'perbaikan'  ? 'border-orange-200 bg-orange-50'
                : 'border-dashed border-n300 bg-white hover:border-primary hover:bg-primary-light/30'

  return (
    <div className={`border-2 rounded-md p-4 transition-all duration-150 cursor-pointer ${bgClass}`}
      onClick={() => ref.current.click()}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon size={20} className={`flex-shrink-0 ${s?.status === 'tersimpan' ? 'text-success' : s?.status === 'perbaikan' ? 'text-orange-500' : 'text-n400'}`} />
          <div>
            <p className="text-[13px] font-semibold text-n800">
              {dok.nama} {dok.wajib && <span className="text-danger">*</span>}
              {dok.jalur && <span className="text-[11px] font-normal text-n500 ml-1">({dok.jalur})</span>}
            </p>
            <p className="text-[11px] text-n500">
              {s?.file ? `${s.file} · ${s.size} — klik untuk ${s.status === 'tersimpan' ? 'ganti' : 'upload ulang'}` : 'Klik untuk pilih file · JPG / PNG / PDF · Maks. 2 MB'}
            </p>
          </div>
        </div>
        {s?.status === 'tersimpan' && (
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
  const navigate = useNavigate()
  const [statusData, setStatusData] = useState(DUMMY_STATUS)

  const handleUpload = (id, file) => {
    if (!file) return
    setStatusData(prev => ({
      ...prev,
      [id]: { file: file.name, size: `${Math.round(file.size / 1024)} KB`, status: 'tersimpan', catatan: null }
    }))
  }

  return (
    <AdminLayout role="pendaftar" user={user} activePath="/pendaftar/dokumen">

      <div className="mb-4">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Upload Dokumen</h1>
      </div>

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
              <DokItem key={dok.id} dok={dok} statusData={statusData} onUpload={handleUpload} />
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
              <DokItem key={dok.id} dok={dok} statusData={statusData} onUpload={handleUpload} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate('/pendaftar/formulir')}>
          ← Kembali ke Formulir
        </Button>
        <Button onClick={() => navigate('/pendaftar/dashboard')}>
          <RiCheckLine size={14} /> Kirim Dokumen
        </Button>
      </div>

    </AdminLayout>
  )
}

export default UploadDokumen