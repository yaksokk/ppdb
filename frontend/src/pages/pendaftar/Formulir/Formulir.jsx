import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiHomeSmileLine, RiTrophyLine, RiHeartLine, RiExchangeLine } from 'react-icons/ri'
import { Button, Spinner, Alert } from '../../../components/common'
import { FormInput, FormSelect, FormTextarea } from '../../../components/form'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'
import pendaftarService from '../../../services/pendaftar.service'
import useAuthStore from '../../../store/authStore'

const user_avatarStyle = { background: 'rgba(37,99,235,.25)', color: '#93C5FD' }

const JALUR_ICONS = {
  zonasi: { icon: RiHomeSmileLine, color: 'text-primary' },
  prestasi: { icon: RiTrophyLine, color: 'text-warning' },
  afirmasi: { icon: RiHeartLine, color: 'text-amber-500' },
  mutasi: { icon: RiExchangeLine, color: 'text-cyan' },
}

function Formulir() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [jalurList, setJalurList] = useState([])
  const [jalurId, setJalurId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingInit, setLoadingInit] = useState(true)
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')

  const [form, setForm] = useState({
    nama_lengkap: '', nisn: '', jenis_kelamin: 'Laki-laki',
    agama: 'Kristen Protestan', tempat_lahir: '', tgl_lahir: '',
    asal_sekolah: '', tahun_lulus: '', nama_ortu: '',
    hubungan: 'Ayah', pekerjaan: '', no_telepon: '', alamat: '',
  })

  useEffect(() => {
    import('../../../services/api').then(({ default: api }) => {
      api.get('/jalur-masuk').then(res => {
        setJalurList(res.data.jalur)
      }).catch(() => { })

      pendaftarService.getStatus().then(res => {
        const p = res.data.pendaftaran
        if (p) {
          setJalurId(p.jalur_id)
          if (p.data_diri) {
            setForm({
              nama_lengkap: p.data_diri.nama_lengkap || '',
              nisn: p.data_diri.nisn || '',
              jenis_kelamin: p.data_diri.jenis_kelamin || 'Laki-laki',
              agama: p.data_diri.agama || 'Kristen Protestan',
              tempat_lahir: p.data_diri.tempat_lahir || '',
              tgl_lahir:     p.data_diri.tgl_lahir
                         ? p.data_diri.tgl_lahir.substring(0, 10)
                         : '',
              asal_sekolah: p.data_diri.asal_sekolah || '',
              tahun_lulus: p.data_diri.tahun_lulus || '',
              nama_ortu: p.data_orang_tua?.nama || '',
              hubungan: p.data_orang_tua?.hubungan || 'Ayah',
              pekerjaan: p.data_orang_tua?.pekerjaan || '',
              no_telepon: p.data_orang_tua?.no_telepon || '',
              alamat: p.data_orang_tua?.alamat || '',
            })
          }
        }
      }).catch(() => { })
        .finally(() => setLoadingInit(false))
    })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const errs = {}
    if (!form.nama_lengkap) errs.nama_lengkap = 'Wajib diisi'
    if (!form.nisn) errs.nisn = 'Wajib diisi'
    if (!form.tempat_lahir) errs.tempat_lahir = 'Wajib diisi'
    if (!form.tgl_lahir) errs.tgl_lahir = 'Wajib diisi'
    if (!form.asal_sekolah) errs.asal_sekolah = 'Wajib diisi'
    if (!form.tahun_lulus) errs.tahun_lulus = 'Wajib diisi'
    if (!form.nama_ortu) errs.nama_ortu = 'Wajib diisi'
    if (!form.no_telepon) errs.no_telepon = 'Wajib diisi'
    if (!jalurId) errs.jalur = 'Pilih jalur pendaftaran'
    return errs
  }

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft) {
      const errs = validate()
      if (Object.keys(errs).length) return setErrors(errs)
    }

    setLoading(true)
    try {
      await pendaftarService.submitFormulir({ ...form, jalur_id: jalurId })
      if (!isDraft) {
        navigate('/pendaftar/dokumen')
      } else {
        setSuccessMsg('Draft berhasil disimpan!')
        setTimeout(() => setSuccessMsg(''), 3000)
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
    <AdminLayout role="pendaftar" user={userObj} activePath="/pendaftar/formulir">
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </AdminLayout>
  )

  return (
    <AdminLayout role="pendaftar" user={userObj} activePath="/pendaftar/formulir">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Formulir Pendaftaran</h1>
      </div>

      {successMsg && <div className="mb-4"><Alert variant="green">{successMsg}</Alert></div>}

      <div className="flex flex-col gap-4">
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

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">B · Data Orang Tua / Wali</p>
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
          <FormTextarea label="Alamat Lengkap Domisili" name="alamat" placeholder="Jl. ..., Desa/Kel, Kecamatan, Kota/Kab" value={form.alamat} onChange={handleChange} />
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-1">C · Jalur Pendaftaran</p>
          <p className="text-[12px] text-n500 mb-4">Pilih satu jalur yang paling sesuai kondisi Anda</p>
          {errors.jalur && <p className="text-[11px] text-danger mb-2">{errors.jalur}</p>}
          <div className="grid grid-cols-2 gap-3">
            {jalurList.map(j => {
              const config = JALUR_ICONS[j.kode] || { icon: RiHomeSmileLine, color: 'text-primary' }
              const Icon = config.icon
              return (
                <div
                  key={j.id}
                  onClick={() => { setJalurId(j.id); setErrors({ ...errors, jalur: '' }) }}
                  className={`
                    flex items-center gap-3 p-4 rounded-sm border-2 cursor-pointer transition-all
                    ${jalurId === j.id ? 'border-primary bg-primary-light' : 'border-n200 bg-white hover:border-blue-200'}
                  `}
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
    </AdminLayout>
  )
}

export default Formulir