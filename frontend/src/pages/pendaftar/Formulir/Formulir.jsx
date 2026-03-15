import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiHomeSmileLine, RiTrophyLine, RiHeartLine, RiExchangeLine } from 'react-icons/ri'
import { Button } from '../../../components/common'
import { FormInput, FormSelect, FormTextarea } from '../../../components/form'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
  name: 'Ahmad Santoso',
  avatarStyle: { background: 'rgba(37,99,235,.25)', color: '#93C5FD' },
}

const JALUR = [
  { id: 'zonasi',   label: 'Zonasi',   desc: 'Berdasarkan jarak domisili ke sekolah',   icon: RiHomeSmileLine,  color: 'text-primary' },
  { id: 'prestasi', label: 'Prestasi', desc: 'Berdasarkan nilai rapor atau sertifikat',  icon: RiTrophyLine,     color: 'text-warning' },
  { id: 'afirmasi', label: 'Afirmasi', desc: 'Untuk siswa dari keluarga tidak mampu',    icon: RiHeartLine,      color: 'text-amber-500' },
  { id: 'mutasi',   label: 'Mutasi',   desc: 'Perpindahan tugas orang tua/wali',        icon: RiExchangeLine,   color: 'text-cyan' },
]

function Formulir() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    namaLengkap: 'Ahmad Santoso',
    nisn: '0123456789',
    jenisKelamin: 'Laki-laki',
    agama: 'Kristen Protestan',
    tempatLahir: 'Manado',
    tglLahir: '2012-05-14',
    asalSekolah: 'SDN 1 Tumpaan',
    tahunLulus: '2025',
    namaOrtu: '',
    hubungan: 'Ayah',
    pekerjaan: '',
    noTelepon: '',
    alamat: '',
  })
  const [jalur, setJalur] = useState('prestasi')
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const errs = {}
    if (!form.namaLengkap) errs.namaLengkap = 'Wajib diisi'
    if (!form.nisn)        errs.nisn        = 'Wajib diisi'
    if (!form.tempatLahir) errs.tempatLahir = 'Wajib diisi'
    if (!form.tglLahir)    errs.tglLahir    = 'Wajib diisi'
    if (!form.asalSekolah) errs.asalSekolah = 'Wajib diisi'
    if (!form.tahunLulus)  errs.tahunLulus  = 'Wajib diisi'
    if (!form.namaOrtu)    errs.namaOrtu    = 'Wajib diisi'
    if (!form.noTelepon)   errs.noTelepon   = 'Wajib diisi'
    if (!jalur)            errs.jalur       = 'Pilih jalur pendaftaran'
    return errs
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    navigate('/pendaftar/dokumen')
  }

  const handleDraft = () => {
    alert('Draft disimpan!')
  }

  return (
    <AdminLayout role="pendaftar" user={user} activePath="/pendaftar/formulir">

      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Formulir Pendaftaran</h1>
      </div>

      <div className="flex flex-col gap-4">

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">A · Data Identitas Calon Siswa</p>
          <div className="grid grid-cols-2 gap-x-4">
            <FormInput label="Nama Lengkap"    name="namaLengkap" value={form.namaLengkap} onChange={handleChange} error={errors.namaLengkap} required />
            <FormInput label="NISN"            name="nisn"        value={form.nisn}        onChange={handleChange} error={errors.nisn}        required />
            <FormSelect label="Jenis Kelamin"  name="jenisKelamin" value={form.jenisKelamin} onChange={handleChange} required>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </FormSelect>
            <FormSelect label="Agama" name="agama" value={form.agama} onChange={handleChange} required>
              <option>Islam</option>
              <option>Kristen Protestan</option>
              <option>Katolik</option>
              <option>Hindu</option>
              <option>Buddha</option>
              <option>Konghucu</option>
            </FormSelect>
            <FormInput label="Tempat Lahir"    name="tempatLahir" value={form.tempatLahir} onChange={handleChange} error={errors.tempatLahir} required />
            <FormInput label="Tanggal Lahir"   name="tglLahir"    type="date" value={form.tglLahir} onChange={handleChange} error={errors.tglLahir} required />
            <FormInput label="Asal Sekolah SD/MI" name="asalSekolah" value={form.asalSekolah} onChange={handleChange} error={errors.asalSekolah} required />
            <FormInput label="Tahun Lulus SD"  name="tahunLulus"  value={form.tahunLulus}  onChange={handleChange} error={errors.tahunLulus}  required />
          </div>
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">B · Data Orang Tua / Wali</p>
          <div className="grid grid-cols-2 gap-x-4">
            <FormInput label="Nama Orang Tua / Wali" name="namaOrtu"   placeholder="Nama lengkap"      value={form.namaOrtu}   onChange={handleChange} error={errors.namaOrtu} required />
            <FormSelect label="Hubungan" name="hubungan" value={form.hubungan} onChange={handleChange} required>
              <option>Ayah</option>
              <option>Ibu</option>
              <option>Wali</option>
            </FormSelect>
            <FormInput label="Pekerjaan"  name="pekerjaan"  placeholder="Jenis pekerjaan"          value={form.pekerjaan}  onChange={handleChange} />
            <FormInput label="No. Telepon" name="noTelepon" placeholder="0812-XXXX-XXXX"            value={form.noTelepon}  onChange={handleChange} error={errors.noTelepon} required />
          </div>
          <FormTextarea label="Alamat Lengkap Domisili" name="alamat" placeholder="Jl. ..., Desa/Kel, Kecamatan, Kota/Kab" value={form.alamat} onChange={handleChange} />
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-1">C · Jalur Pendaftaran</p>
          <p className="text-[12px] text-n500 mb-4">Pilih satu jalur yang paling sesuai kondisi Anda</p>
          {errors.jalur && <p className="text-[11px] text-danger mb-2">{errors.jalur}</p>}
          <div className="grid grid-cols-2 gap-3">
            {JALUR.map(j => {
              const Icon = j.icon
              return (
                <div
                  key={j.id}
                  onClick={() => { setJalur(j.id); setErrors({ ...errors, jalur: '' }) }}
                  className={`
                    flex items-center gap-3 p-4 rounded-sm border-2 cursor-pointer transition-all duration-150
                    ${jalur === j.id
                      ? 'border-primary bg-primary-light'
                      : 'border-n200 bg-white hover:border-blue-200 hover:bg-primary-light/50'}
                  `}
                >
                  <Icon size={20} className={`flex-shrink-0 ${j.color}`} />
                  <div>
                    <p className="text-[13px] font-bold text-n800">{j.label}</p>
                    <p className="text-[11px] text-n500">{j.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-2 mt-5">
        <Button variant="ghost" onClick={handleDraft}>Simpan Draft</Button>
        <Button onClick={handleSubmit}>Simpan & Lanjutkan →</Button>
      </div>

    </AdminLayout>
  )
}

export default Formulir