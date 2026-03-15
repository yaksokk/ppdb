import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiCheckLine, RiCloseLine, RiTimeLine, RiFileTextLine, RiTrophyLine, RiAlertLine, RiTimerLine } from 'react-icons/ri'
import { Badge, Button, Modal } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
    name: 'Mariska Dondokambey',
    avatarStyle: { background: 'rgba(22,163,74,.2)', color: '#86EFAC' },
}

const DUMMY_PENDAFTAR = {
    id: 1,
    noDaftar: 'PPDB-2025-001',
    status: 'menunggu',
    tanggalDaftar: '20 Januari 2025',
    jalur: 'Prestasi',
    dataSiswa: {
        namaLengkap: 'Ahmad Santoso',
        nisn: '0123456789',
        jenisKelamin: 'Laki-laki',
        tempatTglLahir: 'Manado, 14 Mei 2012',
        agama: 'Kristen Protestan',
        asalSekolah: 'SDN 1 Tumpaan',
        tahunLulus: '2025',
        jalurDipilih: 'Prestasi',
    },
    dataOrangTua: {
        nama: 'Bapak Santoso',
        hubungan: 'Ayah',
        pekerjaan: 'Wiraswasta',
        noTelepon: '0812-3456-7890',
    },
    dokumenWajib: [
        { id: 1, nama: 'IJAZAH / SKL', file: 'skl_ahmad.pdf', status: 'belum' },
        { id: 2, nama: 'KARTU KELUARGA', file: 'kk_ahmad.jpg', status: 'belum' },
        { id: 3, nama: 'AKTA KELAHIRAN', file: 'akta_ahmad.pdf', status: 'belum' },
        { id: 4, nama: 'RAPOR KELAS 4-6 SD', file: 'rapor_ahmad.pdf', status: 'belum' },
    ],
    dokumenPendukung: [
        { id: 5, nama: 'SERTIFIKAT PRESTASI', file: 'sertifikat_ahmad.jpg', status: 'belum' },
    ],
}

const STATUS_BANNER = {
    menunggu: { bg: 'bg-warning-light border-amber-200', textColor: 'text-warning', icon: RiTimeLine, label: 'Menunggu Verifikasi Dokumen' },
    perbaikan: { bg: 'bg-orange-50 border-orange-200', textColor: 'text-orange-600', icon: RiCloseLine, label: 'Perlu Perbaikan Dokumen' },
    diterima: { bg: 'bg-success-light border-green-200', textColor: 'text-success', icon: RiCheckLine, label: 'Pendaftar Diterima' },
    ditolak: { bg: 'bg-danger-light border-red-200', textColor: 'text-danger', icon: RiCloseLine, label: 'Pendaftar Ditolak' },
}

function InfoRow({ label, value }) {
    return (
        <div className="flex py-[7px] border-b border-n200 last:border-0">
            <span className="text-[12px] text-n500 w-[140px] flex-shrink-0">{label}</span>
            <span className="text-[13px] text-n800 flex-1">{value}</span>
        </div>
    )
}

function DetailPendaftar() {
    const navigate = useNavigate()
    const data = DUMMY_PENDAFTAR
    const [dokumenWajib, setDokumenWajib] = useState(data.dokumenWajib)
    const [dokumenPendukung, setDokumenPendukung] = useState(data.dokumenPendukung)
    const [catatanModal, setCatatanModal] = useState({ open: false, id: null, catatan: '' })
    const [konfirmasi, setKonfirmasi] = useState({ open: false, tipe: null })

    const bannerConfig = STATUS_BANNER[data.status]
    const BannerIcon = bannerConfig.icon

    const updateDokStatus = (list, setList, id, status) => {
        setList(list.map(d => d.id === id ? { ...d, status } : d))
    }

    const handlePerbaikan = (id) => {
        setCatatanModal({ open: true, id, catatan: '' })
    }

    const handleSavePerbaikan = () => {
        updateDokStatus(dokumenWajib, setDokumenWajib, catatanModal.id, 'perbaikan')
        updateDokStatus(dokumenPendukung, setDokumenPendukung, catatanModal.id, 'perbaikan')
        setCatatanModal({ open: false, id: null, catatan: '' })
    }

    const totalDok = dokumenWajib.length + dokumenPendukung.length
    const diperiksa = [...dokumenWajib, ...dokumenPendukung].filter(d => d.status !== 'belum').length

    const renderDokItem = (dok, list, setList) => (
        <div
            key={dok.id}
            className={`border rounded-md p-3 mb-2 last:mb-0 transition-all
        ${dok.status === 'valid' ? 'border-green-200 bg-success-light' : ''}
        ${dok.status === 'perbaikan' ? 'border-orange-200 bg-orange-50' : ''}
        ${dok.status === 'belum' ? 'border-n200 bg-white' : ''}
      `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <RiFileTextLine size={16} className="text-n400 flex-shrink-0" />
                    <div>
                        <p className="text-[10px] font-bold text-n400 uppercase tracking-wide">{dok.nama}</p>
                        <p className="text-[12px] font-semibold text-primary cursor-pointer hover:underline">{dok.file}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                        onClick={() => updateDokStatus(list, setList, dok.id, 'valid')}
                        className={`w-7 h-7 rounded-xs border flex items-center justify-center transition-all
              ${dok.status === 'valid' ? 'bg-success border-success text-white' : 'border-green-300 text-success hover:bg-success-light'}`}
                    >
                        <RiCheckLine size={13} />
                    </button>
                    <button
                        onClick={() => handlePerbaikan(dok.id)}
                        className={`w-7 h-7 rounded-xs border flex items-center justify-center transition-all
              ${dok.status === 'perbaikan' ? 'bg-danger border-danger text-white' : 'border-red-300 text-danger hover:bg-danger-light'}`}
                    >
                        <RiCloseLine size={13} />
                    </button>
                    <span className={`text-[11px] font-semibold ml-1
                        ${dok.status === 'valid' ? 'text-success' : ''}
                        ${dok.status === 'perbaikan' ? 'text-orange-500' : ''}
                        ${dok.status === 'belum' ? 'text-n400' : ''}
                        `}>
                        {dok.status === 'valid' ? <span className="flex items-center gap-0.5"><RiCheckLine size={11} /> Valid</span> : ''}
                        {dok.status === 'perbaikan' ? <span className="flex items-center gap-0.5"><RiAlertLine size={11} /> Perbaikan</span> : ''}
                        {dok.status === 'belum' ? <span className="flex items-center gap-0.5"><RiTimerLine size={11} /> Belum</span> : ''}
                    </span>
                </div>
            </div>
        </div>
    )

    return (
        <AdminLayout role="operator" user={user} activePath="/admin/pendaftar">

            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="text-[19px] font-extrabold font-poppins text-n800">Detail & Verifikasi</h1>
                    <div className="flex items-center gap-1.5 mt-1 text-[12px] text-n500">
                        <span
                            className="text-primary cursor-pointer hover:underline"
                            onClick={() => navigate('/admin/pendaftar')}
                        >
                            ← Data Pendaftar
                        </span>
                        <span>·</span>
                        <span>{data.dataSiswa.namaLengkap}</span>
                        <span>·</span>
                        <span>{data.noDaftar}</span>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/pendaftar')}>
                    <RiArrowLeftLine size={14} /> Kembali
                </Button>
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-lg border mb-5 ${bannerConfig.bg}`}>
                <BannerIcon size={20} className={`flex-shrink-0 ${bannerConfig.textColor}`} />
                <div>
                    <p className={`text-[14px] font-bold ${bannerConfig.textColor}`}>{bannerConfig.label}</p>
                    <p className="text-[12px] text-orange-800">
                        {data.noDaftar} · Dikirim {data.tanggalDaftar} · Jalur: <strong>{data.jalur}</strong>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-[1fr_360px] gap-4">

                <div className="flex flex-col gap-4">
                    <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
                        <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Data Siswa</p>
                        <InfoRow label="Nama Lengkap" value={data.dataSiswa.namaLengkap} />
                        <InfoRow label="NISN" value={data.dataSiswa.nisn} />
                        <InfoRow label="Jenis Kelamin" value={data.dataSiswa.jenisKelamin} />
                        <InfoRow label="Tempat/Tgl Lahir" value={data.dataSiswa.tempatTglLahir} />
                        <InfoRow label="Agama" value={data.dataSiswa.agama} />
                        <InfoRow label="Asal Sekolah" value={data.dataSiswa.asalSekolah} />
                        <InfoRow label="Tahun Lulus" value={data.dataSiswa.tahunLulus} />
                        <InfoRow label="Jalur Dipilih" value={
                            <span className="flex items-center gap-1 font-semibold"><RiTrophyLine size={14} className="text-warning" />{data.dataSiswa.jalurDipilih} </span>} />                  </div>

                    <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
                        <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Data Orang Tua / Wali</p>
                        <InfoRow label="Nama" value={data.dataOrangTua.nama} />
                        <InfoRow label="Hubungan" value={data.dataOrangTua.hubungan} />
                        <InfoRow label="Pekerjaan" value={data.dataOrangTua.pekerjaan} />
                        <InfoRow label="No. Telepon" value={data.dataOrangTua.noTelepon} />
                    </div>

                    <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
                        <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Keputusan Akhir</p>
                        <div className="flex gap-2 mb-3">
                            <Button variant="success" fullWidth onClick={() => setKonfirmasi({ open: true, tipe: 'terima' })}>
                                <RiCheckLine size={14} /> Terima Pendaftar
                            </Button>
                            <Button variant="danger" fullWidth onClick={() => setKonfirmasi({ open: true, tipe: 'tolak' })}>
                                <RiCloseLine size={14} /> Tolak Pendaftar
                            </Button>
                        </div>
                        <div className="bg-n50 border border-n200 rounded-sm px-3 py-2 text-[12px] text-n600">
                            <strong>Terima</strong> → pindah ke Hasil Seleksi · <strong>Tolak</strong> → tidak diterima
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs h-fit">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[15px] font-bold font-poppins text-n800">Dokumen Pendaftar</p>
                        <span className="text-[12px] text-n500">{diperiksa}/{totalDok} diperiksa</span>
                    </div>

                    <p className="text-[10px] font-bold text-n400 uppercase tracking-widest mb-2">Dokumen Wajib</p>
                    {dokumenWajib.map(dok => renderDokItem(dok, dokumenWajib, setDokumenWajib))}

                    <p className="text-[10px] font-bold text-n400 uppercase tracking-widest mt-4 mb-2">Dokumen Pendukung</p>
                    {dokumenPendukung.map(dok => renderDokItem(dok, dokumenPendukung, setDokumenPendukung))}

                    <div className="flex gap-2 mt-4">
                        <Button variant="success" fullWidth size="sm">
                            <RiCheckLine size={13} /> Semua Valid
                        </Button>
                        <Button variant="warning" fullWidth size="sm">
                            <RiAlertLine size={13} /> Ada Perbaikan
                        </Button>
                    </div>
                </div>

            </div>

            <Modal
                isOpen={catatanModal.open}
                onClose={() => setCatatanModal({ open: false, id: null, catatan: '' })}
                title="Catatan Perbaikan"
            >
                <p className="text-[12px] text-n500 mb-3">Tulis catatan untuk pendaftar mengenai dokumen yang perlu diperbaiki.</p>
                <textarea
                    rows={3}
                    value={catatanModal.catatan}
                    onChange={e => setCatatanModal({ ...catatanModal, catatan: e.target.value })}
                    placeholder="Contoh: Foto KTP tidak jelas, harap upload ulang..."
                    className="w-full px-3 py-2 text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary resize-none"
                />
                <div className="flex gap-2 justify-end mt-4">
                    <Button variant="ghost" onClick={() => setCatatanModal({ open: false, id: null, catatan: '' })}>Batal</Button>
                    <Button variant="danger" onClick={handleSavePerbaikan}>Tandai Perbaikan</Button>
                </div>
            </Modal>

            <Modal
                isOpen={konfirmasi.open}
                onClose={() => setKonfirmasi({ open: false, tipe: null })}
                title={konfirmasi.tipe === 'terima' ? 'Terima Pendaftar' : 'Tolak Pendaftar'}
            >
                <p className="text-[13px] text-n600 mb-4">
                    {konfirmasi.tipe === 'terima'
                        ? 'Apakah kamu yakin ingin menerima pendaftar ini? Data akan dipindahkan ke Hasil Seleksi.'
                        : 'Apakah kamu yakin ingin menolak pendaftar ini? Tindakan ini tidak bisa dibatalkan.'}
                </p>
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setKonfirmasi({ open: false, tipe: null })}>Batal</Button>
                    <Button variant={konfirmasi.tipe === 'terima' ? 'success' : 'danger'}>
                        {konfirmasi.tipe === 'terima' ? 'Ya, Terima' : 'Ya, Tolak'}
                    </Button>
                </div>
            </Modal>

        </AdminLayout>
    )
}

export default DetailPendaftar