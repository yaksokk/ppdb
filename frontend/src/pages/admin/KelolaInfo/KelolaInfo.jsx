import { useState, useEffect } from 'react'
import { Button, Spinner, Alert } from '../../../components/common'
import { FormInput } from '../../../components/form'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'
import adminService from '../../../services/admin.service'
import useAuthStore from '../../../store/authStore'

function KelolaInfo() {
  const { user }              = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [profil, setProfil] = useState({
    nama_sekolah: '', alamat: '', email: '', no_telepon: '', kuota_total: '',
  })

  const [jadwal, setJadwal] = useState({
    tahun_ajaran: '', tgl_buka: '', tgl_tutup: '',
    tgl_verifikasi: '', tgl_pengumuman: '', tgl_daftar_ulang: '',
  })

  const userObj = {
    name: user?.name || 'Administrator',
    avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
  }

  useEffect(() => {
    adminService.getSetting()
      .then(res => {
        const s = res.data.settings
        setProfil({
          nama_sekolah: s.nama_sekolah || '',
          alamat:       s.alamat       || '',
          email:        s.email        || '',
          no_telepon:   s.no_telepon   || '',
          kuota_total:  s.kuota_total  || '',
        })
        setJadwal({
          tahun_ajaran:    s.tahun_ajaran    || '',
          tgl_buka:        s.tgl_buka        || '',
          tgl_tutup:       s.tgl_tutup       || '',
          tgl_verifikasi:  s.tgl_verifikasi  || '',
          tgl_pengumuman:  s.tgl_pengumuman  || '',
          tgl_daftar_ulang:s.tgl_daftar_ulang|| '',
        })
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleSimpan = async (data) => {
    setSaving(true)
    try {
      await adminService.updateSetting(data)
      setSuccessMsg('Berhasil disimpan!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <AdminLayout role="admin" user={userObj} activePath="/admin/pengumuman">
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </AdminLayout>
  )

  return (
    <AdminLayout role="admin" user={userObj} activePath="/admin/pengumuman">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Kelola Info</h1>
      </div>

      {successMsg && <div className="mb-4"><Alert variant="green">{successMsg}</Alert></div>}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">Profil Sekolah</p>
          <FormInput label="Nama Sekolah"   name="nama_sekolah" value={profil.nama_sekolah} onChange={e => setProfil({ ...profil, nama_sekolah: e.target.value })} />
          <FormInput label="Alamat"         name="alamat"       value={profil.alamat}       onChange={e => setProfil({ ...profil, alamat: e.target.value })} />
          <FormInput label="Email"          name="email"        type="email" value={profil.email} onChange={e => setProfil({ ...profil, email: e.target.value })} />
          <FormInput label="No. Telepon"    name="no_telepon"   value={profil.no_telepon}   onChange={e => setProfil({ ...profil, no_telepon: e.target.value })} />
          <FormInput label="Kuota Siswa Baru" name="kuota_total" type="number" value={profil.kuota_total} onChange={e => setProfil({ ...profil, kuota_total: e.target.value })} />
          <div className="flex justify-end mt-4">
            <Button onClick={() => handleSimpan(profil)} disabled={saving}>
              {saving ? <Spinner size="sm" color="white" /> : 'Simpan'}
            </Button>
          </div>
        </div>

        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
          <p className="text-[15px] font-bold font-poppins text-primary mb-4">Jadwal PPDB</p>
          <FormInput label="Tahun Ajaran"              name="tahun_ajaran"     value={jadwal.tahun_ajaran}     onChange={e => setJadwal({ ...jadwal, tahun_ajaran: e.target.value })} />
          <FormInput label="Tanggal Buka Pendaftaran"  name="tgl_buka"         type="date" value={jadwal.tgl_buka}     onChange={e => setJadwal({ ...jadwal, tgl_buka: e.target.value })} />
          <FormInput label="Tanggal Tutup Pendaftaran" name="tgl_tutup"        type="date" value={jadwal.tgl_tutup}    onChange={e => setJadwal({ ...jadwal, tgl_tutup: e.target.value })} />
          <FormInput label="Tanggal Verifikasi Berkas" name="tgl_verifikasi"   type="date" value={jadwal.tgl_verifikasi} onChange={e => setJadwal({ ...jadwal, tgl_verifikasi: e.target.value })} />
          <FormInput label="Tanggal Pengumuman Hasil"  name="tgl_pengumuman"   type="date" value={jadwal.tgl_pengumuman} onChange={e => setJadwal({ ...jadwal, tgl_pengumuman: e.target.value })} />
          <FormInput label="Tanggal Daftar Ulang"      name="tgl_daftar_ulang" type="date" value={jadwal.tgl_daftar_ulang} onChange={e => setJadwal({ ...jadwal, tgl_daftar_ulang: e.target.value })} />
          <div className="flex justify-end mt-4">
            <Button onClick={() => handleSimpan(jadwal)} disabled={saving}>
              {saving ? <Spinner size="sm" color="white" /> : 'Simpan'}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default KelolaInfo