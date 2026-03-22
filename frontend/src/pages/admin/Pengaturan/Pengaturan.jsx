import { useState, useEffect } from 'react'
import { RiInformationLine } from 'react-icons/ri'
import { Button, Spinner, Alert } from '../../../components/common'
import { FormInput } from '../../../components/form'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import adminService from '../../../services/admin.service'
import useAuthStore from '../../../store/authStore'

function Pengaturan() {
  const { user }              = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [ppdbBuka, setPpdbBuka]     = useState(true)

  const [jadwal, setJadwal] = useState({
    tgl_buka: '', tgl_tutup: '', tgl_verifikasi: '',
    tgl_pengumuman: '', tgl_daftar_ulang: '',
  })

  const userObj = {
    name: user?.name || 'Administrator',
    avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
  }

  useEffect(() => {
    adminService.getSetting()
      .then(res => {
        const s = res.data.settings
        setJadwal({
          tgl_buka:         s.tgl_buka         || '',
          tgl_tutup:        s.tgl_tutup        || '',
          tgl_verifikasi:   s.tgl_verifikasi   || '',
          tgl_pengumuman:   s.tgl_pengumuman   || '',
          tgl_daftar_ulang: s.tgl_daftar_ulang || '',
        })
        setPpdbBuka(s.status_ppdb === 'buka')
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleSimpanJadwal = async () => {
    setSaving(true)
    try {
      await adminService.updateSetting(jadwal)
      setSuccessMsg('Jadwal berhasil disimpan!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async (status) => {
    setPpdbBuka(status)
    try {
      await adminService.updateSetting({ status_ppdb: status ? 'buka' : 'tutup' })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <DashboardLayout role="admin" user={userObj} activePath="/admin/pengaturan">
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout role="admin" user={userObj} activePath="/admin/pengaturan">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Pengaturan</h1>
      </div>

      {successMsg && <div className="mb-4"><Alert variant="green">{successMsg}</Alert></div>}

      <div className="grid grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">Jadwal PPDB</p>
          <FormInput label="Tanggal Mulai"      name="tgl_buka"         type="date" value={jadwal.tgl_buka}         onChange={e => setJadwal({ ...jadwal, tgl_buka: e.target.value })} />
          <FormInput label="Tanggal Penutupan"  name="tgl_tutup"        type="date" value={jadwal.tgl_tutup}        onChange={e => setJadwal({ ...jadwal, tgl_tutup: e.target.value })} />
          <FormInput label="Tanggal Verifikasi" name="tgl_verifikasi"   type="date" value={jadwal.tgl_verifikasi}   onChange={e => setJadwal({ ...jadwal, tgl_verifikasi: e.target.value })} />
          <FormInput label="Pengumuman Hasil"   name="tgl_pengumuman"   type="date" value={jadwal.tgl_pengumuman}   onChange={e => setJadwal({ ...jadwal, tgl_pengumuman: e.target.value })} />
          <FormInput label="Daftar Ulang"       name="tgl_daftar_ulang" type="date" value={jadwal.tgl_daftar_ulang} onChange={e => setJadwal({ ...jadwal, tgl_daftar_ulang: e.target.value })} />
          <div className="flex justify-end mt-4">
            <Button onClick={handleSimpanJadwal} disabled={saving}>
              {saving ? <Spinner size="sm" color="white" /> : 'Simpan Jadwal'}
            </Button>
          </div>
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-3">Status Pendaftaran</p>
          <p className="text-[12px] text-n500 mb-3">Status saat ini:</p>

          <div className="flex gap-2 mb-4">
            <button onClick={() => handleToggleStatus(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm border text-[13px] font-semibold transition-all
                ${ppdbBuka ? 'bg-success-light border-green-300 text-success' : 'bg-white border-n200 text-n500 hover:bg-n50'}`}>
              <div className={`w-2 h-2 rounded-full ${ppdbBuka ? 'bg-success' : 'bg-n300'}`} />
              PPDB Dibuka
            </button>
            <button onClick={() => handleToggleStatus(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm border text-[13px] font-semibold transition-all
                ${!ppdbBuka ? 'bg-danger-light border-red-300 text-danger' : 'bg-white border-n200 text-n500 hover:bg-n50'}`}>
              <div className={`w-2 h-2 rounded-full ${!ppdbBuka ? 'bg-danger' : 'bg-n300'}`} />
              PPDB Ditutup
            </button>
          </div>

          <div className={`px-3 py-2.5 rounded-sm text-[12px] leading-relaxed border mb-3
            ${ppdbBuka ? 'bg-success-light border-green-200 text-green-800' : 'bg-danger-light border-red-200 text-red-800'}`}>
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
    </DashboardLayout>
  )
}

export default Pengaturan