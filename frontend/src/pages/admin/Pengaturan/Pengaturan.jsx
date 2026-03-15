import { useState } from 'react'
import { RiInformationLine } from 'react-icons/ri'
import { Button } from '../../../components/common'
import { FormInput } from '../../../components/form'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
  name: 'Administrator',
  avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
}

function Pengaturan() {
  const [jadwal, setJadwal] = useState({
    tglMulai:      '2025-01-15',
    tglPenutupan:  '2025-02-28',
    tglVerifikasi: '2025-03-01',
    tglPengumuman: '2025-03-15',
    tglDaftarUlang:'2025-03-16',
  })
  const [ppdbBuka, setPpdbBuka] = useState(true)

  const handleJadwal = (e) => setJadwal({ ...jadwal, [e.target.name]: e.target.value })

  return (
    <AdminLayout role="admin" user={user} activePath="/admin/setting">

      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Pengaturan</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">Jadwal PPDB</p>

          <FormInput label="Tanggal Mulai"      name="tglMulai"       type="date" value={jadwal.tglMulai}       onChange={handleJadwal} />
          <FormInput label="Tanggal Penutupan"  name="tglPenutupan"   type="date" value={jadwal.tglPenutupan}   onChange={handleJadwal} />
          <FormInput label="Tanggal Verifikasi" name="tglVerifikasi"  type="date" value={jadwal.tglVerifikasi}  onChange={handleJadwal} />
          <FormInput label="Pengumuman Hasil"   name="tglPengumuman"  type="date" value={jadwal.tglPengumuman}  onChange={handleJadwal} />
          <FormInput label="Daftar Ulang"       name="tglDaftarUlang" type="date" value={jadwal.tglDaftarUlang} onChange={handleJadwal} />

          <div className="flex justify-end mt-4">
            <Button onClick={() => alert('Jadwal disimpan!')}>Simpan Jadwal</Button>
          </div>
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-3">Status Pendaftaran</p>

          <p className="text-[12px] text-n500 mb-3">Status saat ini:</p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPpdbBuka(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm border text-[13px] font-semibold transition-all
                ${ppdbBuka
                  ? 'bg-success-light border-green-300 text-success'
                  : 'bg-white border-n200 text-n500 hover:bg-n50'}`}
            >
              <div className={`w-2 h-2 rounded-full ${ppdbBuka ? 'bg-success' : 'bg-n300'}`} />
              PPDB Dibuka
            </button>
            <button
              onClick={() => setPpdbBuka(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm border text-[13px] font-semibold transition-all
                ${!ppdbBuka
                  ? 'bg-danger-light border-red-300 text-danger'
                  : 'bg-white border-n200 text-n500 hover:bg-n50'}`}
            >
              <div className={`w-2 h-2 rounded-full ${!ppdbBuka ? 'bg-danger' : 'bg-n300'}`} />
              PPDB Ditutup
            </button>
          </div>

          <div className={`px-3 py-2.5 rounded-sm text-[12px] leading-relaxed border mb-3
            ${ppdbBuka
              ? 'bg-success-light border-green-200 text-green-800'
              : 'bg-danger-light border-red-200 text-red-800'}`}
          >
            {ppdbBuka
              ? 'Pendaftar dapat mendaftar, isi formulir, dan upload dokumen.'
              : 'Pendaftaran ditutup. Pendaftar tidak dapat mendaftar baru.'}
          </div>

          <div className="bg-primary-light border border-blue-200 rounded-sm px-3 py-2.5 flex gap-2">
            <RiInformationLine size={14} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-800 leading-relaxed">
              Jika ditutup, tombol daftar di halaman publik nonaktif. Login tetap bisa dilakukan.
            </p>
          </div>
        </div>

      </div>

    </AdminLayout>
  )
}

export default Pengaturan