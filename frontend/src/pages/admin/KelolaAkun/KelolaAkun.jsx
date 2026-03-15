import { useState } from 'react'
import { RiPencilLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri'
import { Button, Table, Tr, Td, Modal, EmptyState } from '../../../components/common'
import { FormInput } from '../../../components/form'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
  name: 'Administrator',
  avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
}

const DUMMY_DATA = [
  { id: 1, nama: 'Mariska Dondokambey', email: 'mariska@smpn1tumpaan.sch.id' },
  { id: 2, nama: 'Janfer Kumendong',    email: 'janfer@smpn1tumpaan.sch.id' },
  { id: 3, nama: 'Winda Sumolang',      email: 'winda@smpn1tumpaan.sch.id' },
]

const FORM_INIT = { nama: '', email: '', password: '' }

function KelolaAkun() {
  const [data, setData]           = useState(DUMMY_DATA)
  const [formModal, setFormModal] = useState({ open: false, mode: 'tambah', item: null })
  const [form, setForm]           = useState(FORM_INIT)
  const [errors, setErrors]       = useState({})
  const [hapusModal, setHapusModal] = useState({ open: false, item: null })
  const [detailModal, setDetailModal] = useState({ open: false, item: null })

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
    setForm({ nama: item.nama, email: item.email, password: '' })
    setErrors({})
    setFormModal({ open: true, mode: 'edit', item })
  }

  const handleSimpan = () => {
    const errs = {}
    if (!form.nama)  errs.nama  = 'Nama wajib diisi'
    if (!form.email) errs.email = 'Email wajib diisi'
    if (formModal.mode === 'tambah' && !form.password) errs.password = 'Password wajib diisi'
    if (Object.keys(errs).length) return setErrors(errs)

    if (formModal.mode === 'tambah') {
      setData([...data, { id: Date.now(), nama: form.nama, email: form.email }])
    } else {
      setData(data.map(d => d.id === formModal.item.id ? { ...d, nama: form.nama, email: form.email } : d))
    }
    setFormModal({ open: false, mode: 'tambah', item: null })
  }

  const handleHapus = () => {
    setData(data.filter(d => d.id !== hapusModal.item.id))
    setHapusModal({ open: false, item: null })
  }

  return (
    <AdminLayout role="admin" user={user} activePath="/admin/operator">

      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Kelola Akun</h1>
      </div>

      <div className="mb-4">
        <Button onClick={handleTambah}>
          <RiAddLine size={14} /> Tambah Operator
        </Button>
      </div>

      <Table headers={['Nama', 'Email / Username', 'Aksi']}>
        {data.length === 0 ? (
          <tr>
            <td colSpan={3}>
              <EmptyState icon={RiAddLine} title="Belum ada operator" description="Tambah akun operator baru." />
            </td>
          </tr>
        ) : (
          data.map(d => (
            <Tr key={d.id}>
              <Td className="font-semibold text-n800">{d.nama}</Td>
              <Td className="text-n500">{d.email}</Td>
              <Td>
                <div className="flex items-center gap-1.5">
                  <Button size="xs" variant="ghost" onClick={() => setDetailModal({ open: true, item: d })}>
                    Detail
                  </Button>
                  <Button size="xs" variant="warning" onClick={() => handleEdit(d)}>
                    <RiPencilLine size={12} /> Edit
                  </Button>
                  <button
                    onClick={() => setHapusModal({ open: true, item: d })}
                    className="w-7 h-7 rounded-xs bg-danger-light border border-red-200 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-all"
                  >
                    <RiDeleteBinLine size={13} />
                  </button>
                </div>
              </Td>
            </Tr>
          ))
        )}
      </Table>

      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, mode: 'tambah', item: null })}
        title={formModal.mode === 'tambah' ? 'Tambah Operator' : 'Edit Operator'}
      >
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
          <Button onClick={handleSimpan}>Simpan</Button>
        </div>
      </Modal>

      <Modal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, item: null })}
        title="Detail Operator"
      >
        {detailModal.item && (
          <div>
            <div className="flex py-2 border-b border-n200">
              <span className="text-[12px] text-n500 w-32">Nama</span>
              <span className="text-[13px] font-semibold text-n800">{detailModal.item.nama}</span>
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

      <Modal
        isOpen={hapusModal.open}
        onClose={() => setHapusModal({ open: false, item: null })}
        title="Hapus Operator"
      >
        <p className="text-[13px] text-n600 mb-4">
          Apakah kamu yakin ingin menghapus akun <strong>{hapusModal.item?.nama}</strong>? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setHapusModal({ open: false, item: null })}>Batal</Button>
          <Button variant="danger" onClick={handleHapus}>Hapus</Button>
        </div>
      </Modal>

    </AdminLayout>
  )
}

export default KelolaAkun