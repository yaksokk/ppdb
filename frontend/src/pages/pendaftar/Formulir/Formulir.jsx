import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiHomeSmileLine, RiTrophyLine, RiHeartLine,
  RiExchangeLine, RiMapPinLine,
} from 'react-icons/ri'
import { Button, Spinner, Alert } from '../../../components/common'
import { FormInput, FormSelect } from '../../../components/form'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import pendaftarService from '../../../services/pendaftar.service'
import api from '../../../services/api'
import useAuthStore from '../../../store/authStore'

const user_avatarStyle = { background: 'rgba(37,99,235,.25)', color: '#93C5FD' }

const JALUR_ICONS = {
  zonasi:   { icon: RiHomeSmileLine, color: 'text-primary' },
  prestasi: { icon: RiTrophyLine,    color: 'text-warning' },
  afirmasi: { icon: RiHeartLine,     color: 'text-amber-500' },
  mutasi:   { icon: RiExchangeLine,  color: 'text-cyan' },
}

const SEMESTERS = [
  { key: '4a', label: 'Kelas 4 Sem 1' },
  { key: '4b', label: 'Kelas 4 Sem 2' },
  { key: '5a', label: 'Kelas 5 Sem 1' },
  { key: '5b', label: 'Kelas 5 Sem 2' },
  { key: '6a', label: 'Kelas 6 Sem 1' },
]

function Formulir() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [jalurList,    setJalurList]    = useState([])
  const [jalurId,      setJalurId]      = useState(null)
  const [loading,      setLoading]      = useState(false)
  const [loadingInit,  setLoadingInit]  = useState(true)
  const [errors,       setErrors]       = useState({})
  const [successMsg,   setSuccessMsg]   = useState('')

  // R1: Daftar desa dari tabel desa_zonasi
  const [desaList,    setDesaList]    = useState([])
  const [selectedDesa, setSelectedDesa] = useState({ nama_desa: '', jarak_km: null })

  const [form, setForm] = useState({
    nama_lengkap: '', nisn: '', jenis_kelamin: 'Laki-laki',
    agama: 'Kristen Protestan', tempat_lahir: '', tgl_lahir: '',
    asal_sekolah: '', tahun_lulus: '',
    nama_ortu: '', hubungan: 'Ayah', pekerjaan: '', no_telepon: '',
  })

  const [nilaiRapor, setNilaiRapor] = useState({
    '4a': '', '4b': '', '5a': '', '5b': '', '6a': '',
  })

  const rataRataRapor = useMemo(() => {
    const vals = Object.values(nilaiRapor).filter(v => v !== '' && !isNaN(parseFloat(v)))
    if (!vals.length) return null
    return (vals.reduce((a, b) => a + parseFloat(b), 0) / vals.length).toFixed(2)
  }, [nilaiRapor])

  // Muat daftar desa aktif dari backend
  useEffect(() => {
    api.get('/desa-zonasi/aktif')
      .then(res => setDesaList(res.data.desa))
      .catch(() => {})
  }, [])

  // Muat data draft saat init
  useEffect(() => {
    const init = async () => {
      try {
        const [jalurRes, statusRes] = await Promise.all([
          api.get('/jalur-masuk'),
          pendaftarService.getStatus(),
        ])
        setJalurList(jalurRes.data.jalur)

        const p = statusRes.data.pendaftaran
        if (!p) return

        setJalurId(p.jalur_id)

        if (p.data_diri) {
          const d = p.data_diri
          setForm({
            nama_lengkap:  d.nama_lengkap  || '',
            nisn:          d.nisn          || '',
            jenis_kelamin: d.jenis_kelamin || 'Laki-laki',
            agama:         d.agama         || 'Kristen Protestan',
            tempat_lahir:  d.tempat_lahir  || '',
            tgl_lahir:     d.tgl_lahir ? d.tgl_lahir.substring(0, 10) : '',
            asal_sekolah:  d.asal_sekolah  || '',
            tahun_lulus:   d.tahun_lulus   || '',
            nama_ortu:     p.data_orang_tua?.nama       || '',
            hubungan:      p.data_orang_tua?.hubungan   || 'Ayah',
            pekerjaan:     p.data_orang_tua?.pekerjaan  || '',
            no_telepon:    p.data_orang_tua?.no_telepon || '',
          })

          // R1: Pre-populate nama_desa dari data_diri
          if (d.nama_desa) {
            setSelectedDesa({ nama_desa: d.nama_desa, jarak_km: d.jarak_km })
          }
        }

        // Pre-populate nilai rapor
        if (p.nilai_rapor?.length) {
          const mapped = { '4a': '', '4b': '', '5a': '', '5b': '', '6a': '' }
          p.nilai_rapor.forEach(r => { mapped[r.semester] = String(r.nilai) })
          setNilaiRapor(mapped)
        }
      } catch (_) {
        // silent
      } finally {
        setLoadingInit(false)
      }
    }
    init()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  // R1: Saat desa dipilih, otomatis set jarak_km dari data desa_zonasi
  const handleDesaChange = (e) => {
    const desaId = parseInt(e.target.value)
    const desa   = desaList.find(d => d.id === desaId)
    if (desa) {
      setSelectedDesa({ nama_desa: desa.nama_desa, jarak_km: parseFloat(desa.jarak_km) })
    } else {
      setSelectedDesa({ nama_desa: '', jarak_km: null })
    }
    setErrors({ ...errors, nama_desa: '' })
  }

  const validate = () => {
    const errs = {}
    if (!form.nama_lengkap)       errs.nama_lengkap  = 'Wajib diisi'
    if (!form.nisn)                errs.nisn          = 'Wajib diisi'
    if (!form.tempat_lahir)        errs.tempat_lahir  = 'Wajib diisi'
    if (!form.tgl_lahir)           errs.tgl_lahir     = 'Wajib diisi'
    if (!form.asal_sekolah)        errs.asal_sekolah  = 'Wajib diisi'
    if (!form.tahun_lulus)         errs.tahun_lulus   = 'Wajib diisi'
    if (!form.nama_ortu)           errs.nama_ortu     = 'Wajib diisi'
    if (!form.no_telepon)          errs.no_telepon    = 'Wajib diisi'
    if (!jalurId)                  errs.jalur         = 'Pilih jalur pendaftaran'
    if (!selectedDesa.nama_desa)   errs.nama_desa     = 'Pilih desa domisili'
    return errs
  }

  const buildPayload = () => {
    const nilaiRaporPayload = Object.entries(nilaiRapor)
      .filter(([, v]) => v !== '' && !isNaN(parseFloat(v)))
      .map(([semester, nilai]) => ({ semester, nilai: parseFloat(nilai) }))

    return {
      ...form,
      jalur_id:  jalurId,
      // R1: kirim nama_desa dan jarak_km (bukan cascade wilayah)
      nama_desa: selectedDesa.nama_desa,
      jarak_km:  selectedDesa.jarak_km,
      // Nilai rapor
      nilai_rapor: nilaiRaporPayload,
    }
  }

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft) {
      const errs = validate()
      if (Object.keys(errs).length) return setErrors(errs)
    }

    setLoading(true)
    try {
      if (isDraft) {
        await pendaftarService.saveDraft(buildPayload())
        setSuccessMsg('Draft berhasil disimpan!')
        setTimeout(() => setSuccessMsg(''), 3000)
      } else {
        await pendaftarService.submitFormulir(buildPayload())
        navigate('/pendaftar/dokumen')
      }
    } catch (err) {
      const errData = err.response?.data?.errors
      if (errData) {
        const mapped = {}
        Object.keys(errData).forEach(k => { mapped[k] = errData[k][0] })
        setErrors(mapped)
      }
    } finally {
      setLoading(false)
    }
  }

  const selectedDesaId = desaList.find(d => d.nama_desa === selectedDesa.nama_desa)?.id ?? ''
  const userObj = { name: user?.name || 'Pendaftar', avatarStyle: user_avatarStyle }

  if (loadingInit) return (
    <DashboardLayout role="pendaftar" user={userObj} activePath="/pendaftar/formulir">
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout role="pendaftar" user={userObj} activePath="/pendaftar/formulir">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Formulir Pendaftaran</h1>
      </div>

      {successMsg && <div className="mb-4"><Alert variant="green">{successMsg}</Alert></div>}

      <div className="flex flex-col gap-4">

        {/* A — Data Identitas */}
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">A · Data Identitas Calon Siswa</p>
          <div className="grid grid-cols-2 gap-x-4">
            <FormInput label="Nama Lengkap" name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} error={errors.nama_lengkap} required />
            <FormInput label="NISN" name="nisn" value={form.nisn} onChange={handleChange} error={errors.nisn} required />
            <FormSelect label="Jenis Kelamin" name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} required>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </FormSelect>
            <FormSelect label="Agama" name="agama" value={form.agama} onChange={handleChange} required>
              <option>Islam</option>
              <option>Kristen Protestan</option>
              <option>Katolik</option>
              <option>Hindu</option>
              <option>Buddha</option>
              <option>Konghucu</option>
            </FormSelect>
            <FormInput label="Tempat Lahir" name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} error={errors.tempat_lahir} required />
            <FormInput label="Tanggal Lahir" name="tgl_lahir" type="date" value={form.tgl_lahir} onChange={handleChange} error={errors.tgl_lahir} required />
            <FormInput label="Asal Sekolah SD/MI" name="asal_sekolah" value={form.asal_sekolah} onChange={handleChange} error={errors.asal_sekolah} required />
            <FormInput label="Tahun Lulus SD" name="tahun_lulus" value={form.tahun_lulus} onChange={handleChange} error={errors.tahun_lulus} required />
          </div>
        </div>

        {/* B — Domisili Siswa (R1: single dropdown desa) */}
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-1">B · Desa Domisili Siswa</p>
          <p className="text-[12px] text-n500 mb-4">
            Pilih nama desa sesuai tempat tinggal. Jarak ke sekolah akan terisi otomatis.
          </p>

          <div className="mb-3">
            <label className="block text-[11px] font-bold text-n600 uppercase tracking-wide mb-1.5">
              Desa / Kelurahan <span className="text-danger">*</span>
            </label>
            <select
              value={selectedDesaId}
              onChange={handleDesaChange}
              className={`w-full px-3 py-[9px] text-[13px] text-n800 border-[1.5px] rounded-sm bg-white outline-none transition-all cursor-pointer focus:border-primary
                ${errors.nama_desa ? 'border-danger' : 'border-n200'}`}
            >
              <option value="">-- Pilih Desa --</option>
              {desaList.map(d => (
                <option key={d.id} value={d.id}>{d.nama_desa}</option>
              ))}
            </select>
            {errors.nama_desa && <p className="mt-1 text-[11px] text-danger">{errors.nama_desa}</p>}
          </div>

          {/* Info jarak otomatis */}
          {selectedDesa.nama_desa && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary-light border border-blue-200 rounded-sm">
              <RiMapPinLine size={14} className="text-primary flex-shrink-0" />
              <p className="text-[12px] text-blue-800">
                <strong>Jarak ke Sekolah: {selectedDesa.jarak_km} km</strong>
                <span className="text-[11px] font-normal text-n500 ml-1">— berdasarkan data zonasi sekolah</span>
              </p>
            </div>
          )}
        </div>

        {/* C — Nilai Rapor */}
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-1">C · Nilai Rata-rata Rapor</p>
          <p className="text-[12px] text-n500 mb-4">Input nilai rata-rata dari semua mata pelajaran per semester</p>
          <div className="grid grid-cols-5 gap-x-3">
            {SEMESTERS.map(s => (
              <div key={s.key} className="mb-3">
                <label className="block text-[11px] font-bold text-n600 uppercase tracking-wide mb-1.5">{s.label}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0–100"
                  value={nilaiRapor[s.key]}
                  onChange={e => setNilaiRapor(prev => ({ ...prev, [s.key]: e.target.value }))}
                  className="w-full px-3 py-[9px] text-[13px] text-n800 border-[1.5px] border-n200 rounded-sm bg-white outline-none transition-all text-center focus:border-primary"
                />
              </div>
            ))}
          </div>
          {rataRataRapor !== null && (
            <div className="mt-1 px-3 py-2 bg-success-light border border-green-200 rounded-sm">
              <p className="text-[12px] text-success font-semibold">
                Rata-rata dari {Object.values(nilaiRapor).filter(v => v !== '').length} semester:{' '}
                <strong>{rataRataRapor}</strong>
                <span className="text-[11px] font-normal text-n500 ml-1">— akan menjadi nilai kriteria rapor otomatis</span>
              </p>
            </div>
          )}
        </div>

        {/* D — Data Orang Tua */}
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">D · Data Orang Tua / Wali</p>
          <div className="grid grid-cols-2 gap-x-4">
            <FormInput label="Nama Orang Tua / Wali" name="nama_ortu" placeholder="Nama lengkap" value={form.nama_ortu} onChange={handleChange} error={errors.nama_ortu} required />
            <FormSelect label="Hubungan" name="hubungan" value={form.hubungan} onChange={handleChange} required>
              <option>Ayah</option>
              <option>Ibu</option>
              <option>Wali</option>
            </FormSelect>
            <FormInput label="Pekerjaan" name="pekerjaan" placeholder="Jenis pekerjaan" value={form.pekerjaan} onChange={handleChange} />
            <FormInput label="No. Telepon" name="no_telepon" placeholder="0812-XXXX-XXXX" value={form.no_telepon} onChange={handleChange} error={errors.no_telepon} required />
          </div>
        </div>

        {/* E — Jalur Pendaftaran */}
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-1">E · Jalur Pendaftaran</p>
          <p className="text-[12px] text-n500 mb-4">Pilih satu jalur yang paling sesuai kondisi Anda</p>
          {errors.jalur && <p className="text-[11px] text-danger mb-2">{errors.jalur}</p>}
          <div className="grid grid-cols-2 gap-3">
            {jalurList.map(j => {
              const config = JALUR_ICONS[j.kode] || { icon: RiHomeSmileLine, color: 'text-primary' }
              const Icon   = config.icon
              return (
                <div
                  key={j.id}
                  onClick={() => { setJalurId(j.id); setErrors({ ...errors, jalur: '' }) }}
                  className={`flex items-center gap-3 p-4 rounded-sm border-2 cursor-pointer transition-all
                    ${jalurId === j.id ? 'border-primary bg-primary-light' : 'border-n200 bg-white hover:border-blue-200'}`}
                >
                  <Icon size={20} className={`flex-shrink-0 ${config.color}`} />
                  <div>
                    <p className="text-[13px] font-bold text-n800">{j.nama}</p>
                    <p className="text-[11px] text-n500">{j.deskripsi}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <Button variant="ghost" onClick={() => handleSubmit(true)} disabled={loading}>
          Simpan Draft
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={loading}>
          {loading ? <><Spinner size="sm" color="white" /> Menyimpan...</> : 'Simpan & Lanjutkan →'}
        </Button>
      </div>
    </DashboardLayout>
  )
}

export default Formulir
