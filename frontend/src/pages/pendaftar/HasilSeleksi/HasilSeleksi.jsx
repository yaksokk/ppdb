import { useNavigate } from 'react-router-dom'
import { RiPrinterLine, RiDownloadLine, RiCheckLine, RiCloseLine, RiTrophyLine, RiEmotionHappyLine, RiEmotionUnhappyLine } from 'react-icons/ri'
import { Badge, Button } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
    name: 'Ahmad Santoso',
    avatarStyle: { background: 'rgba(37,99,235,.25)', color: '#93C5FD' },
}

const DUMMY_HASIL = {
    status: 'diterima',
    noPendaftaran: 'PPDB-2025-00124',
    nama: 'Ahmad Santoso',
    nisn: '0123456789',
    jalur: 'Prestasi',
    daftarUlang: {
        tanggal: '16-20 Maret 2025',
        tempat: 'Ruang TU SMP N 1 Tumpaan',
        jam: '08.00-12.00 WITA',
        catatan: 'Bawa: Ijazah asli, Akta asli, KK asli, pas foto 3x4 (4 lembar), dan bukti kelulusan yang dicetak.',
    },
}

function InfoRow({ label, value }) {
    return (
        <div className="flex py-2 border-b border-n200 last:border-0">
            <span className="text-[12px] text-n500 w-[140px] flex-shrink-0">{label}</span>
            <span className="text-[13px] text-n800 flex-1">{value}</span>
        </div>
    )
}

function HasilSeleksiPendaftar() {
    const navigate = useNavigate()
    const hasil = DUMMY_HASIL
    const diterima = hasil.status === 'diterima'

    return (
        <AdminLayout role="pendaftar" user={user} activePath="/pendaftar/hasil">

            <div className="mb-5">
                <h1 className="text-[19px] font-extrabold font-poppins text-n800">Hasil Seleksi</h1>
            </div>

            <div className="bg-white border border-n200 rounded-lg p-8 shadow-xs mb-4 text-center">
                <div className="mb-4">
                    {diterima
                        ? <RiEmotionHappyLine size={56} className="text-success mx-auto" />
                        : <RiEmotionUnhappyLine size={56} className="text-danger mx-auto" />
                    }
                </div>

                <h2 className={`text-[20px] font-extrabold font-poppins mb-2 ${diterima ? 'text-success' : 'text-danger'}`}>
                    {diterima ? 'SELAMAT! ANDA DINYATAKAN DITERIMA' : 'MAAF, ANDA TIDAK DITERIMA'}
                </h2>

                <p className="text-[13px] text-n500 mb-5">
                    {hasil.nama} · {hasil.noPendaftaran} · Jalur {hasil.jalur}
                </p>

                {diterima && (
                    <div className="flex gap-2 justify-center">
                        <Button variant="success" onClick={() => window.print()}>
                            <RiPrinterLine size={14} /> Cetak Bukti Kelulusan
                        </Button>
                        <Button variant="ghost" onClick={() => alert('Download PDF')}>
                            <RiDownloadLine size={14} /> Download PDF
                        </Button>
                    </div>
                )}

                {!diterima && (
                    <p className="text-[12px] text-n500 max-w-sm mx-auto">
                        Terima kasih telah mendaftar. Semoga ada kesempatan di lain waktu.
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
                    <p className={`text-[15px] font-bold font-poppins mb-3 ${diterima ? 'text-success' : 'text-danger'}`}>
                        Detail Kelulusan
                    </p>
                    <InfoRow label="No. Pendaftaran" value={hasil.noPendaftaran} />
                    <InfoRow label="Nama Lengkap" value={hasil.nama} />
                    <InfoRow label="NISN" value={hasil.nisn} />
                    <InfoRow label="Jalur" value={
                        <span className="flex items-center gap-1 font-semibold">
                            <RiTrophyLine size={13} className="text-warning" /> {hasil.jalur}
                        </span>
                    } />
                    <InfoRow label="Status" value={
                        <span className={`flex items-center gap-1 font-bold ${diterima ? 'text-success' : 'text-danger'}`}>
                            {diterima ? <RiCheckLine size={14} /> : <RiCloseLine size={14} />}
                            {diterima ? 'Diterima' : 'Tidak Diterima'}
                        </span>
                    } />
                </div>

                {diterima && (
                    <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
                        <p className="text-[15px] font-bold font-poppins text-primary mb-3">Informasi Daftar Ulang</p>
                        <InfoRow label="Tanggal" value={hasil.daftarUlang.tanggal} />
                        <InfoRow label="Tempat" value={hasil.daftarUlang.tempat} />
                        <InfoRow label="Jam" value={hasil.daftarUlang.jam} />
                        <div className="mt-3 bg-primary-light border border-blue-200 rounded-sm px-3 py-2.5">
                            <p className="text-[12px] text-blue-800 leading-relaxed">{hasil.daftarUlang.catatan}</p>
                        </div>
                    </div>
                )}
            </div>

        </AdminLayout>
    )
}

export default HasilSeleksiPendaftar