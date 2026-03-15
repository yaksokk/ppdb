import { useState } from 'react'
import { Button } from '../../../components/common'
import { FormInput } from '../../../components/form'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
  name: 'Administrator',
  avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
}

function KelolaInfo() {
  const [profil, setProfil] = useState({
    namaSekolah: 'SMP Negeri 1 Tumpaan',
    alamat: 'Jl. Trans Sulawesi, Tumpaan, Minahasa Selatan',
    email: 'ppdb@smpn1tumpaan.sch.id',
    noTelepon: '(0431) 888-XXX',
    kuota: '160',
  })

  const [jadwal, setJadwal] = useState({
    tahunAjaran: '2025/2026',
    tglBuka: '2025-01-15',
    tglTutup: '2025-02-28',
    tglVerifikasi: '2025-03-01',
    tglPengumuman: '2025-03-15',
    tglDaftarUlang: '2025-03-16',
  })

  const handleProfil = (e) => setProfil({ ...profil, [e.target.name]: e.target.value })
  const handleJadwal = (e) => setJadwal({ ...jadwal, [e.target.name]: e.target.value })

  return (
    <AdminLayout role="admin" user={user} activePath="/admin/pengumuman">

      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Kelola Info</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">Profil Sekolah</p>

          <FormInput
            label="Nama Sekolah"
            name="namaSekolah"
            value={profil.namaSekolah}
            onChange={handleProfil}
          />
          <FormInput
            label="Alamat"
            name="alamat"
            value={profil.alamat}
            onChange={handleProfil}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={profil.email}
            onChange={handleProfil}
          />
          <FormInput
            label="No. Telepon"
            name="noTelepon"
            value={profil.noTelepon}
            onChange={handleProfil}
          />
          <FormInput
            label="Kuota Siswa Baru"
            name="kuota"
            type="number"
            value={profil.kuota}
            onChange={handleProfil}
          />

          <div className="flex justify-end mt-4">
            <Button onClick={() => alert('Profil disimpan!')}>Simpan</Button>
          </div>
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">Jadwal PPDB</p>

          <FormInput
            label="Tahun Ajaran"
            name="tahunAjaran"
            value={jadwal.tahunAjaran}
            onChange={handleJadwal}
          />
          <FormInput
            label="Tanggal Buka Pendaftaran"
            name="tglBuka"
            type="date"
            value={jadwal.tglBuka}
            onChange={handleJadwal}
          />
          <FormInput
            label="Tanggal Tutup Pendaftaran"
            name="tglTutup"
            type="date"
            value={jadwal.tglTutup}
            onChange={handleJadwal}
          />
          <FormInput
            label="Tanggal Verifikasi Berkas"
            name="tglVerifikasi"
            type="date"
            value={jadwal.tglVerifikasi}
            onChange={handleJadwal}
          />
          <FormInput
            label="Tanggal Pengumuman Hasil"
            name="tglPengumuman"
            type="date"
            value={jadwal.tglPengumuman}
            onChange={handleJadwal}
          />
          <FormInput
            label="Tanggal Daftar Ulang"
            name="tglDaftarUlang"
            type="date"
            value={jadwal.tglDaftarUlang}
            onChange={handleJadwal}
          />

          <div className="flex justify-end mt-4">
            <Button onClick={() => alert('Jadwal disimpan!')}>Simpan</Button>
          </div>
        </div>

      </div>

    </AdminLayout>
  )
}

export default KelolaInfo