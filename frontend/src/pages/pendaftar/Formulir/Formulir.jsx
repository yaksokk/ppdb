import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiHomeSmileLine, RiTrophyLine, RiHeartLine, RiExchangeLine, RiMapPinLine } from 'react-icons/ri'
import { Button, Spinner, Alert } from '../../../components/common'
import { FormInput, FormSelect } from '../../../components/form'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import pendaftarService from '../../../services/pendaftar.service'
import useAuthStore from '../../../store/authStore'

const user_avatarStyle = { background: 'rgba(37,99,235,.25)', color: '#93C5FD' }

const WILAYAH_API = 'https://www.emsifa.com/api-wilayah-indonesia/api'

const JALUR_ICONS = {
  zonasi:   { icon: RiHomeSmileLine, color: 'text-primary' },
  prestasi: { icon: RiTrophyLine,    color: 'text-warning' },
  afirmasi: { icon: RiHeartLine,     color: 'text-amber-500' },
  mutasi:   { icon: RiExchangeLine,  color: 'text-cyan' },
}

const SEMESTERS = [
  { key: '4a', label: 'Kelas 4 Semester 1' },
  { key: '4b', label: 'Kelas 4 Semester 2' },
  { key: '5a', label: 'Kelas 5 Semester 1' },
  { key: '5b', label: 'Kelas 5 Semester 2' },
  { key: '6a', label: 'Kelas 6 Semester 1' },
]

function hitungHaversine(lat1, lon1, lat2, lon2) {
  const R    = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a    = Math.sin(dLat / 2) ** 2 +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function Formulir() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [jalurList, setJalurList]       = useState([])
  const [jalurId, setJalurId]           = useState(null)
  const [loading, setLoading]           = useState(false)
  const [loadingInit, setLoadingInit]   = useState(true)
  const [errors, setErrors]             = useState({})
  const [successMsg, setSuccessMsg]     = useState('')

  const [form, setForm] = useState({
    nama_lengkap: '', nisn: '', jenis_kelamin: 'Laki-laki',
    agama: 'Kristen Protestan', tempat_lahir: '', tgl_lahir: '',
    asal_sekolah: '', tahun_lulus: '',
    nama_ortu: '', hubungan: 'Ayah', pekerjaan: '', no_telepon: '',
  })

  // P1 — alamat wilayah
  const [alamat, setAlamat] = useState({
    provinsi: '', provinsi_id: '',
    kabupaten: '', kabupaten_id: '',
    kecamatan: '', kecamatan_id: '',
    desa: '', desa_id: '',
    lat: null, lng: null, jarak_km: null,
  })
  const [provinsiList,  setProvinsiList]  = useState([])
  const [kabupatenList, setKabupatenList] = useState([])
  const [kecamatanList, setKecamatanList] = useState([])
  const [desaList,      setDesaList]      = useState([])
  const [loadingKab,  setLoadingKab]  = useState(false)
  const [loadingKec,  setLoadingKec]  = useState(false)
  const [loadingDesa, setLoadingDesa] = useState(false)
  const sekolahRef = useRef({ lat: null, lng: null })

  // P2 — nilai rapor
  const [nilaiRapor, setNilaiRapor] = useState({ '4a': '', '4b': '', '5a': '', '5b': '', '6a': '' })

  const rataRataRapor = useMemo(() => {
    const vals = Object.values(nilaiRapor).filter(v => v !== '' && !isNaN(parseFloat(v)))
    if (!vals.length) return null
    return (vals.reduce((a, b) => a + parseFloat(b), 0) / vals.length).toFixed(2)
  }, [nilaiRapor])

  // Muat provinsi sekali saat mount
  useEffect(() => {
    fetch(`${WILAYAH_API}/provinces.json`)
      .then(r => r.json())
      .then(setProvinsiList)
      .catch(() => {})
  }, [])

  // Muat koordinat sekolah dari setting
  useEffect(() => {
    import('../../../services/api').then(({ default: api }) => {
      api.get('/setting-publik')
        .then(res => {
          const s = res.data.settings
          if (s.sekolah_lat && s.sekolah_lng) {
            sekolahRef.current = { lat: parseFloat(s.sekolah_lat), lng: parseFloat(s.sekolah_lng) }
          }
        })
        .catch(() => {})
    })
  }, [])

  // Muat data draft + cascade wilayah saat init
  useEffect(() => {
    const init = async () => {
      try {
        const [jalurRes, statusRes] = await Promise.all([
          import('../../../services/api').then(({ default: api }) => api.get('/jalur-masuk')),
          pendaftarService.getStatus(),
        ])
        setJalurList(jalurRes.data.jalur)

        const p = statusRes.data.pendaftaran
        if (!p) return

        setJalurId(p.jalur_id)

        if (p.data_diri) {
          const d = p.data_diri
          setForm({
            nama_lengkap: d.nama_lengkap || '',
            nisn:         d.nisn         || '',
            jenis_kelamin:d.jenis_kelamin|| 'Laki-laki',
            agama:        d.agama        || 'Kristen Protestan',
            tempat_lahir: d.tempat_lahir || '',
            tgl_lahir:    d.tgl_lahir    ? d.tgl_lahir.substring(0, 10) : '',
            asal_sekolah: d.asal_sekolah || '',
            tahun_lulus:  d.tahun_lulus  || '',
            nama_ortu:    p.data_orang_tua?.nama       || '',
            hubungan:     p.data_orang_tua?.hubungan   || 'Ayah',
            pekerjaan:    p.data_orang_tua?.pekerjaan  || '',
            no_telepon:   p.data_orang_tua?.no_telepon || '',
          })

          // Set state alamat
          setAlamat({
            provinsi:    d.provinsi    || '',
            provinsi_id: d.provinsi_id || '',
            kabupaten:   d.kabupaten   || '',
            kabupaten_id:d.kabupaten_id|| '',
            kecamatan:   d.kecamatan   || '',
            kecamatan_id:d.kecamatan_id|| '',
            desa:        d.desa        || '',
            desa_id:     d.desa_id     || '',
            lat:         d.lat,
            lng:         d.lng,
            jarak_km:    d.jarak_km,
          })

          // Muat cascade wilayah untuk pre-populate
          if (d.provinsi_id) {
            const kabs = await fetch(`${WILAYAH_API}/regencies/${d.provinsi_id}.json`).then(r => r.json())
            setKabupatenList(kabs)
          }
          if (d.kabupaten_id) {
            const kecs = await fetch(`${WILAYAH_API}/districts/${d.kabupaten_id}.json`).then(r => r.json())
            setKecamatanList(kecs)
          }
          if (d.kecamatan_id) {
            const desas = await fetch(`${WILAYAH_API}/villages/${d.kecamatan_id}.json`).then(r => r.json())
            setDesaList(desas)
          }
        }

        // P2: Pre-populate nilai rapor
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

  // P1 — cascade handlers
  const handleProvinsiChange = (e) => {
    const opt = provinsiList.find(p => p.id === e.target.value)
    setAlamat({ provinsi: opt?.name || '', provinsi_id: e.target.value,
      kabupaten: '', kabupaten_id: '', kecamatan: '', kecamatan_id: '',
      desa: '', desa_id: '', lat: null, lng: null, jarak_km: null })
    setKabupatenList([]); setKecamatanList([]); setDesaList([])
    setErrors({ ...errors, provinsi: '' })
    if (!e.target.value) return
    setLoadingKab(true)
    fetch(`${WILAYAH_API}/regencies/${e.target.value}.json`)
      .then(r => r.json())
      .then(d => { setKabupatenList(d); setLoadingKab(false) })
      .catch(() => setLoadingKab(false))
  }

  const handleKabupatenChange = (e) => {
    const opt = kabupatenList.find(k => k.id === e.target.value)
    setAlamat(a => ({ ...a, kabupaten: opt?.name || '', kabupaten_id: e.target.value,
      kecamatan: '', kecamatan_id: '', desa: '', desa_id: '', lat: null, lng: null, jarak_km: null }))
    setKecamatanList([]); setDesaList([])
    setErrors({ ...errors, kabupaten: '' })
    if (!e.target.value) return
    setLoadingKec(true)
    fetch(`${WILAYAH_API}/districts/${e.target.value}.json`)
      .then(r => r.json())
      .then(d => { setKecamatanList(d); setLoadingKec(false) })
      .catch(() => setLoadingKec(false))
  }

  const handleKecamatanChange = (e) => {
    const opt = kecamatanList.find(k => k.id === e.target.value)
    setAlamat(a => ({ ...a, kecamatan: opt?.name || '', kecamatan_id: e.target.value,
      desa: '', desa_id: '', lat: null, lng: null, jarak_km: null }))
    setDesaList([])
    setErrors({ ...errors, kecamatan: '' })
    if (!e.target.value) return
    setLoadingDesa(true)
    fetch(`${WILAYAH_API}/villages/${e.target.value}.json`)
      .then(r => r.json())
      .then(d => { setDesaList(d); setLoadingDesa(false) })
      .catch(() => setLoadingDesa(false))
  }

  const handleDesaChange = (e) => {
    const opt   = desaList.find(d => d.id === e.target.value)
    const lat   = opt?.latitude  ? parseFloat(opt.latitude)  : null
    const lng   = opt?.longitude ? parseFloat(opt.longitude) : null
    let jarak_km = null

    if (lat && lng && sekolahRef.current.lat && sekolahRef.current.lng) {
      jarak_km = parseFloat(
        hitungHaversine(lat, lng, sekolahRef.current.lat, sekolahRef.current.lng).toFixed(2)
      )
    }

    setAlamat(a => ({ ...a, desa: opt?.name || '', desa_id: e.target.value, lat, lng, jarak_km }))
    setErrors({ ...errors, desa: '' })
  }

  const validate = () => {
    const errs = {}
    if (!form.nama_lengkap) errs.nama_lengkap = 'Wajib diisi'
    if (!form.nisn)          errs.nisn         = 'Wajib diisi'
    if (!form.tempat_lahir)  errs.tempat_lahir = 'Wajib diisi'
    if (!form.tgl_lahir)     errs.tgl_lahir    = 'Wajib diisi'
    if (!form.asal_sekolah)  errs.asal_sekolah = 'Wajib diisi'
    if (!form.tahun_lulus)   errs.tahun_lulus  = 'Wajib diisi'
    if (!form.nama_ortu)     errs.nama_ortu    = 'Wajib diisi'
    if (!form.no_telepon)    errs.no_telepon   = 'Wajib diisi'
    if (!jalurId)            errs.jalur        = 'Pilih jalur pendaftaran'
    // P1 — alamat wajib
    if (!alamat.provinsi_id) errs.provinsi    = 'Pilih provinsi'
    if (!alamat.kabupaten_id)errs.kabupaten   = 'Pilih kabupaten/kota'
    if (!alamat.kecamatan_id)errs.kecamatan   = 'Pilih kecamatan'
    if (!alamat.desa_id)     errs.desa        = 'Pilih desa/kelurahan'
    return errs
  }

  const buildPayload = () => {
    const nilaiRaporPayload = Object.entries(nilaiRapor)
      .filter(([, v]) => v !== '' && !isNaN(parseFloat(v)))
      .map(([semester, nilai]) => ({ semester, nilai: parseFloat(nilai) }))

    return {
      ...form,
      jalur_id: jalurId,
      // P1
      provinsi:     alamat.provinsi,
      provinsi_id:  alamat.provinsi_id,
      kabupaten:    alamat.kabupaten,
      kabupaten_id: alamat.kabupaten_id,
      kecamatan:    alamat.kecamatan,
      kecamatan_id: alamat.kecamatan_id,
      desa:         alamat.desa,
      desa_id:      alamat.desa_id,
      lat:          alamat.lat,
      lng:          alamat.lng,
      jarak_km:     alamat.jarak_km,
      // P2
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

        {/* B — Alamat Domisili (P1) */}
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-1">B · Alamat Domisili Siswa</p>
          <p className="text-[12px] text-n500 mb-4">Pilih berdasarkan wilayah administrasi tempat tinggal</p>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-n600 uppercase tracking-wide mb-1.5">
                Provinsi <span className="text-danger">*</span>
              </label>
              <select
                value={alamat.provinsi_id}
                onChange={handleProvinsiChange}
                className={`w-full px-3 py-[9px] text-[13px] text-n800 border-[1.5px] rounded-sm bg-white outline-none transition-all cursor-pointer focus:border-primary ${errors.provinsi ? 'border-danger' : 'border-n200'}`}
              >
                <option value="">-- Pilih Provinsi --</option>
                {provinsiList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {errors.provinsi && <p className="mt-1 text-[11px] text-danger">{errors.provinsi}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-[11px] font-bold text-n600 uppercase tracking-wide mb-1.5">
                Kabupaten / Kota <span className="text-danger">*</span>
              </label>
              <select
                value={alamat.kabupaten_id}
                onChange={handleKabupatenChange}
                disabled={!alamat.provinsi_id || loadingKab}
                className={`w-full px-3 py-[9px] text-[13px] text-n800 border-[1.5px] rounded-sm bg-white outline-none transition-all cursor-pointer focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${errors.kabupaten ? 'border-danger' : 'border-n200'}`}
              >
                <option value="">{loadingKab ? 'Memuat...' : '-- Pilih Kabupaten/Kota --'}</option>
                {kabupatenList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
              {errors.kabupaten && <p className="mt-1 text-[11px] text-danger">{errors.kabupaten}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-[11px] font-bold text-n600 uppercase tracking-wide mb-1.5">
                Kecamatan <span className="text-danger">*</span>
              </label>
              <select
                value={alamat.kecamatan_id}
                onChange={handleKecamatanChange}
                disabled={!alamat.kabupaten_id || loadingKec}
                className={`w-full px-3 py-[9px] text-[13px] text-n800 border-[1.5px] rounded-sm bg-white outline-none transition-all cursor-pointer focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${errors.kecamatan ? 'border-danger' : 'border-n200'}`}
              >
                <option value="">{loadingKec ? 'Memuat...' : '-- Pilih Kecamatan --'}</option>
                {kecamatanList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
              {errors.kecamatan && <p className="mt-1 text-[11px] text-danger">{errors.kecamatan}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-[11px] font-bold text-n600 uppercase tracking-wide mb-1.5">
                Desa / Kelurahan <span className="text-danger">*</span>
              </label>
              <select
                value={alamat.desa_id}
                onChange={handleDesaChange}
                disabled={!alamat.kecamatan_id || loadingDesa}
                className={`w-full px-3 py-[9px] text-[13px] text-n800 border-[1.5px] rounded-sm bg-white outline-none transition-all cursor-pointer focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${errors.desa ? 'border-danger' : 'border-n200'}`}
              >
                <option value="">{loadingDesa ? 'Memuat...' : '-- Pilih Desa/Kelurahan --'}</option>
                {desaList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.desa && <p className="mt-1 text-[11px] text-danger">{errors.desa}</p>}
            </div>
          </div>

          {/* Tampil jarak otomatis */}
          {alamat.desa_id && (
            <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-primary-light border border-blue-200 rounded-sm">
              <RiMapPinLine size={14} className="text-primary flex-shrink-0" />
              <p className="text-[12px] text-blue-800">
                {alamat.jarak_km !== null
                  ? <><strong>Jarak ke Sekolah: {alamat.jarak_km} km</strong> — dihitung otomatis dari koordinat desa</>
                  : 'Koordinat desa tidak tersedia, jarak tidak dapat dihitung otomatis.'}
              </p>
            </div>
          )}
        </div>

        {/* C — Nilai Rapor (P2) */}
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
                Rata-rata dari {Object.values(nilaiRapor).filter(v => v !== '').length} semester: <strong>{rataRataRapor}</strong>
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
