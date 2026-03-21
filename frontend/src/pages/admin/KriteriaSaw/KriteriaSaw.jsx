import { useState, useEffect } from 'react'
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from 'react-icons/ri'
import { Button, Table, Tr, Td, Modal, EmptyState, Spinner, Alert, Badge } from '../../../components/common'
import { FormInput, FormSelect } from '../../../components/form'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'
import kriteriaService from '../../../services/kriteria.service'
import useAuthStore from '../../../store/authStore'

const FORM_INIT = { jalur_id: '', nama: '', kode: '', bobot: '', jenis: 'benefit', deskripsi: '' }

function KriteriaSAW() {
    const { user } = useAuthStore()
    const [jalurList, setJalurList] = useState([])
    const [kriteria, setKriteria] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [formModal, setFormModal] = useState({ open: false, mode: 'tambah', item: null })
    const [form, setForm] = useState(FORM_INIT)
    const [errors, setErrors] = useState({})
    const [hapusModal, setHapusModal] = useState({ open: false, item: null })
    const [validasi, setValidasi] = useState({})

    const userObj = {
        name: user?.name || 'Administrator',
        avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
    }

    const fetchData = () => {
        setLoading(true)
        Promise.all([
            import('../../../services/api').then(({ default: api }) => api.get('/jalur-masuk')),
            kriteriaService.getAll(),
        ])
            .then(([jalurRes, kriteriaRes]) => {
                setJalurList(jalurRes.data.jalur)
                setKriteria(kriteriaRes.data.kriteria)
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }

    const fetchValidasi = (jalurId) => {
        kriteriaService.validasiBobot(jalurId)
            .then(res => setValidasi(prev => ({ ...prev, [jalurId]: res.data })))
            .catch(() => { })
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (jalurList.length > 0) {
            jalurList.forEach(j => fetchValidasi(j.id))
        }
    }, [jalurList])

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
        setForm({
            jalur_id: item.jalur_id,
            nama: item.nama,
            kode: item.kode,
            bobot: item.bobot,
            jenis: item.jenis,
            deskripsi: item.deskripsi || '',
        })
        setErrors({})
        setFormModal({ open: true, mode: 'edit', item })
    }

    const handleSimpan = async () => {
        const errs = {}
        if (!form.jalur_id) errs.jalur_id = 'Wajib dipilih'
        if (!form.nama) errs.nama = 'Wajib diisi'
        if (!form.kode) errs.kode = 'Wajib diisi'
        if (!form.bobot) errs.bobot = 'Wajib diisi'
        if (Object.keys(errs).length) return setErrors(errs)

        setSaving(true)
        try {
            if (formModal.mode === 'tambah') {
                await kriteriaService.store(form)
            } else {
                await kriteriaService.update(formModal.item.id, form)
            }
            setSuccessMsg(formModal.mode === 'tambah' ? 'Kriteria berhasil ditambahkan!' : 'Kriteria berhasil diupdate!')
            setTimeout(() => setSuccessMsg(''), 3000)
            fetchData()
            setFormModal({ open: false, mode: 'tambah', item: null })
        } catch (err) {
            const errData = err.response?.data?.errors
            if (errData) {
                const mapped = {}
                Object.keys(errData).forEach(k => { mapped[k] = errData[k][0] })
                setErrors(mapped)
            } else {
                setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan')
                setTimeout(() => setErrorMsg(''), 3000)
            }
        } finally {
            setSaving(false)
        }
    }

    const handleHapus = async () => {
        setSaving(true)
        try {
            await kriteriaService.destroy(hapusModal.item.id)
            setSuccessMsg('Kriteria berhasil dihapus!')
            setTimeout(() => setSuccessMsg(''), 3000)
            fetchData()
            setHapusModal({ open: false, item: null })
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <AdminLayout role="admin" user={userObj} activePath="/admin/kriteria">
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        </AdminLayout>
    )

    return (
        <AdminLayout role="admin" user={userObj} activePath="/admin/kriteria">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-[19px] font-extrabold font-poppins text-n800">Kriteria SAW</h1>
                <Button onClick={handleTambah}>
                    <RiAddLine size={14} /> Tambah Kriteria
                </Button>
            </div>

            {successMsg && <div className="mb-4"><Alert variant="green">{successMsg}</Alert></div>}
            {errorMsg && <div className="mb-4"><Alert variant="red">{errorMsg}</Alert></div>}

            <div className="flex flex-col gap-5">
                {jalurList.map(jalur => {
                    const kriteriaJalur = kriteria[jalur.id] || []
                    const val = validasi[jalur.id]

                    return (
                        <div key={jalur.id} className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[15px] font-bold font-poppins text-n800">
                                    Jalur {jalur.nama}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] text-n500">Total bobot:</span>
                                    <span className={`text-[13px] font-bold ${val?.valid ? 'text-success' : 'text-danger'}`}>
                                        {val?.total_bobot ?? 0}%
                                    </span>
                                    {val?.valid
                                        ? <Badge variant="diterima">Valid</Badge>
                                        : <Badge variant="ditolak">Belum 100%</Badge>
                                    }
                                </div>
                            </div>

                            <Table headers={['Nama Kriteria', 'Kode', 'Bobot (%)', 'Jenis', 'Deskripsi', 'Aksi']}>
                                {kriteriaJalur.length === 0 ? (
                                    <tr><td colSpan={6}>
                                        <EmptyState icon={RiAddLine} title="Belum ada kriteria" description="Tambah kriteria untuk jalur ini." />
                                    </td></tr>
                                ) : (
                                    kriteriaJalur.map(k => (
                                        <Tr key={k.id}>
                                            <Td className="font-semibold text-n800">{k.nama}</Td>
                                            <Td className="text-n500 font-mono text-[11px]">{k.kode}</Td>
                                            <Td className="font-bold text-primary">{k.bobot}%</Td>
                                            <Td>
                                                <Badge variant={k.jenis === 'benefit' ? 'diterima' : 'perbaikan'}>
                                                    {k.jenis === 'benefit' ? 'Benefit' : 'Cost'}
                                                </Badge>
                                            </Td>
                                            <Td className="text-n500 text-[12px]">{k.deskripsi || '-'}</Td>
                                            <Td>
                                                <div className="flex gap-1.5">
                                                    <Button size="xs" variant="warning" onClick={() => handleEdit(k)}>
                                                        <RiPencilLine size={12} /> Edit
                                                    </Button>
                                                    <button
                                                        onClick={() => setHapusModal({ open: true, item: k })}
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
                        </div>
                    )
                })}
            </div>

            <Modal
                isOpen={formModal.open}
                onClose={() => setFormModal({ open: false, mode: 'tambah', item: null })}
                title={formModal.mode === 'tambah' ? 'Tambah Kriteria' : 'Edit Kriteria'}
            >
                <FormSelect label="Jalur" name="jalur_id" value={form.jalur_id} onChange={handleChange} error={errors.jalur_id} required>
                    <option value="">Pilih Jalur</option>
                    {jalurList.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
                </FormSelect>
                <FormInput label="Nama Kriteria" name="nama" placeholder="contoh: Nilai Rapor" value={form.nama} onChange={handleChange} error={errors.nama} required />
                <FormInput label="Kode" name="kode" placeholder="contoh: prestasi_rapor" value={form.kode} onChange={handleChange} error={errors.kode} required />
                <FormInput label="Bobot (%)" name="bobot" type="number" placeholder="contoh: 60" value={form.bobot} onChange={handleChange} error={errors.bobot} required />
                <FormSelect label="Jenis" name="jenis" value={form.jenis} onChange={handleChange} required>
                    <option value="benefit">Benefit (semakin tinggi semakin baik)</option>
                    <option value="cost">Cost (semakin rendah semakin baik)</option>
                </FormSelect>
                <FormInput label="Deskripsi" name="deskripsi" placeholder="Deskripsi kriteria (opsional)" value={form.deskripsi} onChange={handleChange} />
                <div className="flex gap-2 justify-end mt-4">
                    <Button variant="ghost" onClick={() => setFormModal({ open: false, mode: 'tambah', item: null })}>Batal</Button>
                    <Button onClick={handleSimpan} disabled={saving}>
                        {saving ? <Spinner size="sm" color="white" /> : 'Simpan'}
                    </Button>
                </div>
            </Modal>

            <Modal
                isOpen={hapusModal.open}
                onClose={() => setHapusModal({ open: false, item: null })}
                title="Hapus Kriteria"
            >
                <p className="text-[13px] text-n600 mb-4">
                    Apakah kamu yakin ingin menghapus kriteria <strong>{hapusModal.item?.nama}</strong>?
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

export default KriteriaSAW