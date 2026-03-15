import { FormInput, FormSelect, FormTextarea, FormFile } from './components/form'
import { useState } from 'react'

function App() {
  const [file, setFile] = useState(null)

  return (
    <div className="p-8 bg-n100 min-h-screen">
      <div className="max-w-md bg-white rounded-lg border border-n200 p-5">
        <p className="text-[13px] font-bold font-poppins text-n800 mb-4">Form Pendaftaran</p>

        <FormInput label="Nama Lengkap" required placeholder="Masukkan nama lengkap" />
        <FormInput label="NIK" required placeholder="16 digit NIK" error="NIK wajib diisi" />
        <FormInput label="Email" type="email" placeholder="email@contoh.com" />

        <FormSelect label="Jalur Masuk" required>
          <option value="">Pilih jalur</option>
          <option value="zonasi">Zonasi</option>
          <option value="prestasi">Prestasi</option>
          <option value="afirmasi">Afirmasi</option>
        </FormSelect>

        <FormTextarea label="Alamat" required placeholder="Tulis alamat lengkap..." />

        <FormFile
          label="Upload Ijazah"
          required
          hint="Format PDF, JPG — maks. 2MB"
          value={file}
          onChange={setFile}
        />

        <FormFile
          label="Upload KTP Orang Tua"
          note="Catatan admin: foto tidak jelas, harap upload ulang."
        />
      </div>
    </div>
  )
}

export default App