import { useState, useEffect } from 'react'
import { RiSearchLine, RiDeleteBinLine, RiToggleLine, RiToggleFill } from 'react-icons/ri'
import { Button, Table, Tr, Td, Modal, EmptyState, Spinner, Alert, Badge, Pagination } from '../../../components/common'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import adminService from '../../../services/admin.service'
import useAuthStore from '../../../store/authStore'

function KelolaPendaftar() {
    const { user } = useAuthStore()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [successMsg, setSuccessMsg] = useState('')
    const [hapusModal, setHapusModal] = useState({ open: false, item: null })

    const userObj = {
        name: user?.name || 'Administrator',
        avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
    }

    const fetchData = (params = {}) => {
        setLoading(true)
        adminService.listPendaftarAkun({ search, page, ...params })
            .then(res => {
                setData(res.data.pendaftar.data)
                setMeta(res.data.pendaftar)
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [page])

    const handleSearch = () => {
        setPage(1)
        fetchData({ page: 1 })
    }

    const handleToggle = async (item) => {
        setSaving(true)
        try {
            const res = await adminService.toggleAktifPendaftar(item.id)
            setSuccessMsg(res.data.message)
            setTimeout(() => setSuccessMsg(''), 3000)
            fetchData({ page })
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    const handleHapus = async () => {
        setSaving(true)
        try {
            await adminService.hapusPendaftarAkun(hapusModal.item.id)
            setSuccessMsg('Akun pendaftar berhasil dihapus!')
            setTimeout(() => setSuccessMsg(''), 3000)
            fetchData({ page: 1 })
            setHapusModal({ open: false, item: null })
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    return (
        <DashboardLayout role="admin" user={userObj} activePath="/admin/pendaftar-akun">
            <div className="mb-5">
                <h1 className="text-[19px] font-extrabold font-poppins text-n800">Kelola Akun Pendaftar</h1>
            </div>

            {successMsg && <div className="mb-4"><Alert variant="green">{successMsg}</Alert></div>}

            <div className="flex gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                    <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-n400" />
                    <input
                        type="text"
                        placeholder="Cari nama / email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-8 pr-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary placeholder:text-n400"
                    />
                </div>
                <Button size="sm" onClick={handleSearch}>Cari</Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : (
                <>
                    <Table headers={['No.', 'Nama', 'Email', 'Tgl Register', 'Akun', 'Aksi']}>
                        {data.length === 0 ? (
                            <tr><td colSpan={7}>
                                <EmptyState icon={RiSearchLine} title="Belum ada pendaftar" description="Belum ada akun pendaftar terdaftar." />
                            </td></tr>
                        ) : (
                            data.map((d, i) => (
                                <Tr key={d.id}>
                                    <Td className="text-n500">{(page - 1) * 10 + i + 1}</Td>
                                    <Td className="font-semibold text-n800">{d.name}</Td>
                                    <Td className="text-n500">{d.email}</Td>
                                    <Td className="text-n500">
                                        {new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </Td>
                                    <Td>
                                        <Badge variant={d.is_active ? 'diterima' : 'ditolak'}>
                                            {d.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <div className="flex items-center gap-1.5">
                                            <Button size="xs" variant={d.is_active ? 'warning' : 'success'}
                                                onClick={() => handleToggle(d)} disabled={saving}>
                                                {d.is_active
                                                    ? <><RiToggleFill size={13} /> Nonaktifkan</>
                                                    : <><RiToggleLine size={13} /> Aktifkan</>}
                                            </Button>
                                            <button
                                                onClick={() => setHapusModal({ open: true, item: d })}
                                                className="w-7 h-7 rounded-xs bg-danger-light border border-red-200 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-all">
                                                <RiDeleteBinLine size={13} />
                                            </button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </Table>

                    <div className="flex items-center justify-between mt-3">
                        <p className="text-[12px] text-n500">{meta.total ?? 0} akun pendaftar</p>
                        <Pagination current={page} total={meta.last_page ?? 1} onChange={setPage} />
                    </div>
                </>
            )}

            <Modal isOpen={hapusModal.open} onClose={() => setHapusModal({ open: false, item: null })} title="Hapus Akun Pendaftar">
                <p className="text-[13px] text-n600 mb-2">
                    Apakah kamu yakin ingin menghapus akun <strong>{hapusModal.item?.name}</strong>?
                </p>
                <p className="text-[12px] text-danger mb-4">
                    Semua data pendaftaran akan ikut terhapus dan tidak bisa dikembalikan!
                </p>
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setHapusModal({ open: false, item: null })}>Batal</Button>
                    <Button variant="danger" onClick={handleHapus} disabled={saving}>
                        {saving ? <Spinner size="sm" color="white" /> : 'Hapus'}
                    </Button>
                </div>
            </Modal>
        </DashboardLayout>
    )
}

export default KelolaPendaftar