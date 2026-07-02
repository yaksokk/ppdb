import { useState, useEffect } from 'react'
import { RiSearchLine, RiAddLine, RiEditLine, RiDeleteBinLine, RiMapPin2Line, RiToggleLine } from 'react-icons/ri'
import { Button, Table, Tr, Td, EmptyState, Modal, Spinner, Badge } from '../../../components/common'
import { FormInput } from '../../../components/form'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import adminService from '../../../services/admin.service'
import useAuthStore from '../../../store/authStore'

const EMPTY_FORM = { nama_desa: '', jarak_km: '', is_active: true }

function KelolaDesaZonasi() {
  const { user } = useAuthStore()

  const [data,        setData]        = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [formModal,   setFormModal]   = useState({ open: false, mode: 'add', id: null })
  const [form,         setForm]        = useState(EMPTY_FORM)
  const [errors,       setErrors]      = useState({})
  const [saving,       setSaving]      = useState(false)
  const [deleteModal,  setDeleteModal] = useState({ open: false, id: null, nama: '' })

  const userObj = {
    name: user?.name || 'Admin',
    avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
  }

  const fetchData = () => {
    setLoading(true)
    adminService.getDesaZonasi({ search })
      .then(res => setData(res.data.desa))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleSearch = () => fetchData()

  const openAddModal = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setFormModal({ open: true, mode: 'add', id: null })
  }

  const openEditModal = (desa) => {
    setForm({ nama_desa: desa.nama_desa, jarak_km: String(desa.jarak_km), is_active: desa.is_active })
    setErrors({})
    setFormModal({ open: true, mode: 'edit', id: desa.id })
  }

  const validate = () => {
    const errs = {}
    if (!form.nama_desa) errs.nama_desa = 'Nama desa wajib diisi'
    if (!form.jarak_km || isNaN(parseFloat(form.jarak_km)) || parseFloat(form.jarak_km) < 0) {
      errs.jarak_km = 'Jarak harus berupa angka positif'
    }
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setSaving(true)
    try {
      const payload = {
        nama_desa: form.nama_desa,
        jarak_km:  parseFloat(form.jarak_km),
        is_active: form.is_active,
      }

      if (formModal.mode === 'add') {
        await adminService.tambahDesa(payload)
      } else {
        await adminService.updateDesa(formModal.id, payload)
      }

      fetchData()
      setFormModal({ open: false, mode: 'add', id: null })
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

  const handleToggle = async (id) => {
    try {
      await adminService.toggleDesa(id)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await adminService.hapusDesa(deleteModal.id)
      fetchData()
      setDeleteModal({ open: false, id: null, nama: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout role="admin" user={userObj} activePath="/admin/desa-zonasi">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[19px] font-extrabold font-poppins text-n800">Kelola Desa Zonasi</h1>
          <p className="text-[12px] text-n500 mt-0.5">
            Atur daftar desa dan jarak ke sekolah untuk dropdown formulir pendaftar
          </p>
        </div>
        <Button onClick={openAddModal}>
          <RiAddLine size={14} /> Tambah Desa
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-n400" />
          <input
            type="text"
            placeholder="Cari nama desa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-8 pr-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary placeholder:text-n400"
          />
        </div>
        <Button variant="ghost" onClick={handleSearch}>Cari</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <Table headers={['No.', 'Nama Desa', 'Jarak ke Sekolah (km)', 'Status', 'Aksi']}>
          {data.length === 0 ? (
            <tr><td colSpan={5}>
              <EmptyState
                icon={RiMapPin2Line}
                title="Belum ada data desa"
                description="Tambahkan desa beserta jarak ke sekolah untuk digunakan di formulir pendaftar."
              />
            </td></tr>
          ) : (
            data.map((d, i) => (
              <Tr key={d.id}>
                <Td className="text-n500">{i + 1}</Td>
                <Td className="font-semibold text-n800">{d.nama_desa}</Td>
                <Td className="text-center font-semibold">{parseFloat(d.jarak_km).toFixed(2)} km</Td>
                <Td>
                  <Badge variant={d.is_active ? 'diterima' : 'slate'}>
                    {d.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex items-center gap-1.5">
                    <Button size="xs" variant="ghost" onClick={() => openEditModal(d)}>
                      <RiEditLine size={13} /> Edit
                    </Button>
                    <Button size="xs" variant="ghost" onClick={() => handleToggle(d.id)}>
                      <RiToggleLine size={13} /> {d.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                    <Button size="xs" variant="ghost"
                      onClick={() => setDeleteModal({ open: true, id: d.id, nama: d.nama_desa })}>
                      <RiDeleteBinLine size={13} className="text-danger" />
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Table>
      )}

      {/* Modal tambah/edit */}
      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, mode: 'add', id: null })}
        title={formModal.mode === 'add' ? 'Tambah Desa' : 'Edit Desa'}
      >
        <div className="flex flex-col gap-3">
          <FormInput
            label="Nama Desa"
            value={form.nama_desa}
            onChange={e => { setForm({ ...form, nama_desa: e.target.value }); setErrors({ ...errors, nama_desa: '' }) }}
            error={errors.nama_desa}
            required
          />
          <FormInput
            label="Jarak ke Sekolah (km)"
            type="number"
            step="0.01"
            min="0"
            value={form.jarak_km}
            onChange={e => { setForm({ ...form, jarak_km: e.target.value }); setErrors({ ...errors, jarak_km: '' }) }}
            error={errors.jarak_km}
            required
          />
          <label className="flex items-center gap-2 text-[13px] text-n700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={e => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            Aktif (tampil di dropdown formulir pendaftar)
          </label>
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <Button variant="ghost" onClick={() => setFormModal({ open: false, mode: 'add', id: null })}>
            Batal
          </Button>
          <Button disabled={saving} onClick={handleSubmit}>
            {saving ? <Spinner size="sm" color="white" /> : 'Simpan'}
          </Button>
        </div>
      </Modal>

      {/* Modal konfirmasi hapus */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, nama: '' })}
        title="Hapus Desa"
      >
        <p className="text-[13px] text-n600 mb-4">
          Yakin ingin menghapus desa <strong>{deleteModal.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setDeleteModal({ open: false, id: null, nama: '' })}>
            Batal
          </Button>
          <Button variant="danger" disabled={saving} onClick={handleDelete}>
            {saving ? <Spinner size="sm" color="white" /> : 'Ya, Hapus'}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default KelolaDesaZonasi
