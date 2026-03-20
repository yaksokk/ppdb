import { useState, useEffect } from 'react'
import { RiPencilLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri'
import { Button, Table, Tr, Td, Modal, EmptyState, Spinner, Alert } from '../../../components/common'
import { FormInput } from '../../../components/form'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'
import adminService from '../../../services/admin.service'
import useAuthStore from '../../../store/authStore'

const FORM_INIT = { nama: '', email: '', password: '' }

function KelolaAkun() {
  const { user }              = useAuthStore()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [formModal, setFormModal]   = useState({ open: false, mode: 'tambah', item: null })
  const [form, setForm]             = useState(FORM_INIT)
  const [errors, setErrors]         = useState({})
  const [hapusModal, setHapusModal] = useState({ open: false, item: null })
  const [detailModal, setDetailModal] = useState({ open: false, item: null })

  const userObj = {
    name: user?.name || 'Administrator',
    avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
  }

  const fetchData = () => {
    setLoading(true)
    adminService.getListOperator()
      .then(res => setData(res.data.operators))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleTambah = () => {
    setForm(FORM_INIT)
    setErrors({})
    setFormModal({ open: true, mode: 'tambah', item: null })
  }

  const handleEdit = (item) => {
    setForm({ nama: item.name, email: item.email, password: '' })
    setErrors({})
    setFormModal({ open: true, mode: 'edit', item })
  }

  const handleSimpan = async () => {
    const errs = {}
    if (!form.nama)  errs.nama  = 'Nama wajib diisi'
    if (!form.email) errs.email = 'Email wajib diisi'
    if (formModal.mode === 'tambah' && !form.password) errs.password = 'Password wajib diisi'
    if (Object.keys(errs).length) return setErrors(errs)

    setSaving(true)
    try {
      if (formModal.mode === 'tambah') {
        await adminService.tambahOperator({ name: form.nama, email: form.email, password: form.password })
      } else {
        await adminService.updateOperator(formModal.item.id, { name: form.nama, email: form.email, password: form.password || undefined })
      }
      setSuccessMsg(formModal.mode === 'tambah' ? 'Operator berhasil ditambahkan!' : 'Operator berhasil diupdate!')
      setTimeout(() => setSuccessMsg(''), 3000)
      fetchData()
      setFormModal({ open: false, mode: 'tambah', item: null })
    } catch (err) {
      const errData = err.response?.data?.errors
      if (errData) {
        const mapped = {}
        Object.keys(errData).forEach(k => { mapped[k] = errData[k][0] })
        setErrors(mapped)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleHapus = async () => {
    setSaving(true)
    try {
      await adminService.hapusOperator(hapusModal.item.id)
      setSuccessMsg('Operator berhasil dihapus!')
      setTimeout(() => setSuccessMsg(''), 3000)
      fetchData()
      setHapusModal({ open: false, item: null })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout role="admin" user={userObj} activePath="/admin/operator">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Kelola Akun</h1>
      </div>

      {successMsg && <div className="mb-4"><Alert variant="green">{successMsg}</Alert></div>}

      <div className="mb-4">
        <Button onClick={handleTambah}>
          <RiAddLine size={14} /> Tambah Operator
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <Table headers={['Nama', 'Email / Username', 'Aksi']}>
          {data.length === 0 ? (
            <tr><td colSpan={3}>
              <EmptyState icon={RiAddLine} title="Belum ada operator" description="Tambah akun operator baru." />
            </td></tr>
          ) : (
            data.map(d => (
              <Tr key={d.id}>
                <Td className="font-semibold text-n800">{d.name}</Td>
                <Td className="text-n500">{d.email}</Td>
                <Td>
                  <div className="flex items-center gap-1.5">
                    <Button size="xs" variant="ghost" onClick={() => setDetailModal({ open: true, item: d })}>Detail</Button>
                    <Button size="xs" variant="warning" onClick={() => handleEdit(d)}>
                      <RiPencilLine size={12} /> Edit
                    </Button>
                    <button onClick={() => setHapusModal({ open: true, item: d })}
                      className="w-7 h-7 rounded-xs bg-danger-light border border-red-200 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-all">
                      <RiDeleteBinLine size={13} />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Table>
      )}

      <Modal isOpen={formModal.open} onClose={() => setFormModal({ open: false, mode: 'tambah', item: null })}
        title={formModal.mode === 'tambah' ? 'Tambah Operator' : 'Edit Operator'}>
        <FormInput label="Nama" name="nama" placeholder="Nama lengkap operator" value={form.nama} onChange={handleChange} error={errors.nama} required />
        <FormInput label="Email" name="email" type="email" placeholder="email@smpn1tumpaan.sch.id" value={form.email} onChange={handleChange} error={errors.email} required />
        <FormInput
          label={formModal.mode === 'tambah' ? 'Password' : 'Password Baru (kosongkan jika tidak diubah)'}
          name="password" type="password" placeholder="Masukkan password"
          value={form.password} onChange={handleChange} error={errors.password}
          required={formModal.mode === 'tambah'}
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="ghost" onClick={() => setFormModal({ open: false, mode: 'tambah', item: null })}>Batal</Button>
          <Button onClick={handleSimpan} disabled={saving}>
            {saving ? <Spinner size="sm" color="white" /> : 'Simpan'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={detailModal.open} onClose={() => setDetailModal({ open: false, item: null })} title="Detail Operator">
        {detailModal.item && (
          <div>
            <div className="flex py-2 border-b border-n200">
              <span className="text-[12px] text-n500 w-32">Nama</span>
              <span className="text-[13px] font-semibold text-n800">{detailModal.item.name}</span>
            </div>
            <div className="flex py-2">
              <span className="text-[12px] text-n500 w-32">Email</span>
              <span className="text-[13px] text-n800">{detailModal.item.email}</span>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="ghost" onClick={() => setDetailModal({ open: false, item: null })}>Tutup</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={hapusModal.open} onClose={() => setHapusModal({ open: false, item: null })} title="Hapus Operator">
        <p className="text-[13px] text-n600 mb-4">
          Apakah kamu yakin ingin menghapus akun <strong>{hapusModal.item?.name}</strong>? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setHapusModal({ open: false, item: null })}>Batal</Button>
          <Button variant="danger" onClick={handleHapus} disabled={saving}>
            {saving ? <Spinner size="sm" color="white" /> : 'Hapus'}
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}

export default KelolaAkun