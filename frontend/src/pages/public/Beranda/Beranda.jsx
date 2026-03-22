import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
    RiSchoolLine, RiCheckLine, RiSmartphoneLine, RiTimeLine,
    RiFileTextLine, RiHomeSmileLine, RiTrophyLine, RiBankCardLine,
    RiBookOpenLine, RiUserAddLine, RiUploadCloud2Line, RiSearchLine,
    RiCalendarLine, RiAlertLine, RiFacebookBoxLine, RiInstagramLine,
    RiTwitterXLine, RiExchangeLine
} from 'react-icons/ri'
import { useNavigate as useNav } from 'react-router-dom'

const NAV_LINKS = ['Beranda', 'Informasi', 'Cara Daftar', 'Jadwal']

const DOKUMEN = [
    { icon: RiFileTextLine, nama: 'Ijazah / SKL', desc: 'Surat Keterangan Lulus dari sekolah asal atau ijazah SD/MI' },
    { icon: RiHomeSmileLine, nama: 'Kartu Keluarga', desc: 'Scan KK yang masih berlaku, terbaca jelas' },
    { icon: RiBookOpenLine, nama: 'Akta Kelahiran', desc: 'Scan akta kelahiran yang terbaca jelas' },
    { icon: RiFileTextLine, nama: 'Rapor Kelas 4-6 SD', desc: 'Scan rapor semester ganjil & genap kelas 4-6' },
    { icon: RiTrophyLine, nama: 'Sertifikat Prestasi', desc: 'Opsional — untuk Jalur Prestasi (akademik / non-akademik)' },
    { icon: RiBankCardLine, nama: 'KIP / PKH', desc: 'Opsional — untuk Jalur Afirmasi (Kartu KIP atau PKH)' },
]

const JALUR = [
    { icon: RiHomeSmileLine, nama: 'Zonasi', desc: 'Seleksi berdasarkan jarak domisili tempat tinggal ke sekolah sesuai KK.', color: 'text-primary', bg: 'bg-primary-light' },
    { icon: RiCheckLine, nama: 'Afirmasi', desc: 'Untuk siswa dari keluarga kurang mampu yang memiliki KIP atau PKH.', color: 'text-success', bg: 'bg-success-light' },
    { icon: RiTrophyLine, nama: 'Prestasi', desc: 'Berdasarkan nilai rapor atau sertifikat prestasi akademik maupun non-akademik.', color: 'text-warning', bg: 'bg-warning-light' },
    { icon: RiExchangeLine, nama: 'Mutasi', desc: 'Untuk calon siswa yang mengikuti perpindahan tugas dinas orang tua / wali.', color: 'text-cyan', bg: 'bg-cyan-light' },
]

const LANGKAH = [
    { no: 1, label: 'Buat Akun', desc: 'Daftar menggunakan email aktif dan buat kata sandi' },
    { no: 2, label: 'Isi Formulir', desc: 'Data diri siswa, data orang tua & pilih jalur' },
    { no: 3, label: 'Upload Dokumen', desc: 'Unggah berkas persyaratan sesuai jalur yang dipilih' },
    { no: 4, label: 'Verifikasi Panitia', desc: 'Panitia memeriksa kelengkapan dan keabsahan berkas' },
    { no: 5, label: 'Pengumuman', desc: 'Hasil seleksi diumumkan dan dapat dilihat di dashboard' },
]

function SectionLabel({ text }) {
    return <p className="text-[13px] font-bold text-primary uppercase tracking-widest mb-2">{text}</p>
}

function Beranda() {
    const navigate = useNavigate()
    const [setting, setSetting] = useState(null)

    useEffect(() => {
        import('../../../services/api').then(({ default: api }) => {
            api.get('/setting-publik').then(res => setSetting(res.data.settings))
                .catch(() => { })
        })
    }, [])

    return (
        <div className="min-h-screen bg-white font-jakarta">

            {/* Navbar */}
            <nav className="h-[60px] bg-dark-blue sticky top-0 z-[200] border-b border-white/8">
                <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5 no-underline">
                        <div className="w-8 h-8 bg-white/12 rounded-[9px] flex items-center justify-center">
                            <RiSchoolLine size={18} color="#fff" />
                        </div>
                        <span className="text-[13px] font-bold text-white font-poppins">SMP Negeri 1 Tumpaan</span>
                    </a>

                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link, i) => (
                            <a key={i} href={`#${link.toLowerCase().replace(' ', '-')}`}
                                className="px-3 py-1.5 text-[13px] text-white/70 font-medium rounded-sm hover:text-white hover:bg-white/8 transition-all no-underline">
                                {link}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-1.5 text-[13px] font-semibold text-white border border-white/30 rounded-pill hover:bg-white/10 transition-all">
                            Masuk
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-4 py-1.5 text-[13px] font-semibold text-dark-blue bg-cyan rounded-pill hover:bg-cyan-dark transition-all">
                            Daftar
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section id="beranda" className="min-h-[calc(100vh-60px)] flex items-center justify-center text-center px-6"
                style={{ background: 'linear-gradient(135deg, #0F2B5B 0%, #1E3A8A 60%, #1D4ED8 100%)' }}>
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-pill mb-6">
                        <RiSchoolLine size={13} className="text-white/70" />
                        <span className="text-[12px] text-white/70 font-medium">
                            PPDB Tahun Ajaran {setting?.tahun_ajaran || '2025/2026'}
                        </span>
                    </div>

                    <h1 className="text-[40px] font-extrabold text-white font-poppins leading-tight mb-4">
                        Daftarkan Putra-Putri Anda ke{' '}
                        <span className="text-cyan">SMP Negeri 1 Tumpaan</span>{' '}
                        secara Online
                    </h1>

                    <p className="text-[14px] text-white/70 leading-relaxed mb-8 max-w-lg mx-auto">
                        Nikmati kemudahan pendaftaran sekolah dengan sistem layanan online. Isi formulir, upload dokumen, dan pantau status pendaftaran kapan saja dari mana saja.
                    </p>

                    <div className="flex gap-3 justify-center mb-8">
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-3 text-[14px] font-bold text-dark-blue bg-cyan rounded-pill hover:bg-cyan-dark transition-all">
                            Daftar Sekarang →
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-3 text-[14px] font-semibold text-white bg-white/10 border border-white/30 rounded-pill hover:bg-white/20 transition-all">
                            Sudah Punya Akun
                        </button>
                    </div>

                    <div className="flex gap-3 justify-center flex-wrap">
                        {[
                            { icon: RiCheckLine, label: 'Tidak dipungut biaya' },
                            { icon: RiSmartphoneLine, label: 'Bisa dari HP / laptop' },
                            { icon: RiTimeLine, label: 'Status real-time' },
                        ].map((item, i) => {
                            const Icon = item.icon
                            return (
                                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-pill">
                                    <Icon size={13} className="text-white/70" />
                                    <span className="text-[12px] text-white/70">{item.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Persyaratan Dokumen */}
            <section id="informasi" className="py-16 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <SectionLabel text="Yang Perlu Disiapkan" />
                    <h2 className="text-[32px] font-extrabold text-n800 font-poppins mb-3">Persyaratan Dokumen</h2>
                    <p className="text-[14px] text-n500 mb-10 max-w-lg">
                        Siapkan berkas berikut sebelum memulai pendaftaran online. Format JPG, PNG, atau PDF, maksimal 2 MB per file.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        {DOKUMEN.map((doc, i) => {
                            const Icon = doc.icon
                            return (
                                <div key={i} className="border border-n300 rounded-lg p-4 hover:shadow-md transition-all">
                                    <div className="w-10 h-10 bg-n100 rounded-lg flex items-center justify-center mb-3">
                                        <Icon size={18} className="text-n500" />
                                    </div>
                                    <p className="text-[14px] font-bold text-n800 mb-1">{doc.nama}</p>
                                    <p className="text-[12px] text-n500 leading-relaxed">{doc.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-n50">
                <div className="max-w-5xl mx-auto">
                    <SectionLabel text="Jalur Penerimaan" />
                    <h2 className="text-[32px] font-extrabold text-n800 font-poppins mb-3">4 Jalur Pendaftaran</h2>
                    <p className="text-[14px] text-n500 mb-10 max-w-lg">
                        Pilih satu jalur yang paling sesuai kondisi calon siswa. Setiap jalur memiliki persyaratan dokumen pendukung yang berbeda.
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                        {JALUR.map((jalur, i) => {
                            const Icon = jalur.icon
                            return (
                                <div key={i} className="bg-white border border-n300 rounded-xl p-5 text-center hover:shadow-md transition-all">
                                    <div className={`w-14 h-14 ${jalur.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                                        <Icon size={24} className={jalur.color} />
                                    </div>
                                    <p className={`text-[15px] font-bold font-poppins mb-2 ${jalur.color}`}>{jalur.nama}</p>
                                    <p className="text-[12px] text-n500 leading-relaxed">{jalur.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section id="cara-daftar" className="py-16 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <SectionLabel text="Langkah-Langkah" />
                    <h2 className="text-[32px] font-extrabold text-n800 font-poppins mb-3">Cara Mendaftar Online</h2>
                    <p className="text-[14px] text-n500 mb-12 max-w-lg">
                        Ikuti 5 langkah berikut dari awal pendaftaran hingga pengumuman hasil seleksi.
                    </p>

                    <div className="flex items-start">
                        {LANGKAH.map((step, i) => (
                            <div key={i} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-[14px] mb-3">
                                        {step.no}
                                    </div>
                                    <p className="text-[13px] font-bold text-n800 font-poppins text-center mb-1">{step.label}</p>
                                    <p className="text-[11px] text-n500 text-center max-w-[120px] leading-snug">{step.desc}</p>
                                </div>
                                {i < LANGKAH.length - 1 && (
                                    <div className="flex-1 h-px bg-n400 mb-16 mx-2" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="jadwal" className="py-16 px-6 bg-n50">
                <div className="max-w-4xl mx-auto">
                    <SectionLabel text="Jadwal Penting" />
                    <h2 className="text-[32px] font-extrabold text-n800 font-poppins mb-3">Jadwal Pendaftaran</h2>
                    <p className="text-[14px] text-n500 mb-8 max-w-lg">
                        Perhatikan tanggal-tanggal penting berikut agar proses pendaftaran tidak terlambat.
                    </p>

                    <div className="bg-white border border-n200 rounded-xl overflow-hidden shadow-xs mb-4">
                        <div className="bg-dark-blue px-5 py-3 flex items-center gap-2">
                            <RiCalendarLine size={15} className="text-white/70" />
                            <span className="text-[13px] font-semibold text-white">Kegiatan | Tanggal | Keterangan</span>
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-n200">
                                    <th className="px-5 py-3 text-left text-[11px] font-bold text-n500 uppercase tracking-wide">Kegiatan</th>
                                    <th className="px-5 py-3 text-left text-[11px] font-bold text-n500 uppercase tracking-wide">Tanggal</th>
                                    <th className="px-5 py-3 text-right text-[11px] font-bold text-n500 uppercase tracking-wide">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { kegiatan: 'Pendaftaran & Upload Dokumen', tanggal: setting?.tgl_buka && setting?.tgl_tutup ? `${setting.tgl_buka} - ${setting.tgl_tutup}` : '-', keterangan: 'Batas akhir kirim semua dokumen', aktif: true },
                                    { kegiatan: 'Verifikasi Berkas', tanggal: setting?.tgl_verifikasi || '-', keterangan: 'Panitia memeriksa dokumen seluruh pendaftar', aktif: false },
                                    { kegiatan: 'Pengumuman Hasil Seleksi', tanggal: setting?.tgl_pengumuman || '-', keterangan: 'Hasil dapat dilihat di dashboard akun masing-masing', aktif: false },
                                    { kegiatan: 'Daftar Ulang Siswa Diterima', tanggal: setting?.tgl_daftar_ulang || '-', keterangan: 'Ruang TU · 08.00-12.00 WITA · wajib bawa dokumen asli', aktif: false },
                                ].map((row, i) => (
                                    <tr key={i} className={`border-b border-n200 last:border-0 ${row.aktif ? 'bg-primary-light' : ''}`}>
                                        <td className={`px-5 py-3 text-[13px] ${row.aktif ? 'text-primary font-bold' : 'text-n700'}`}>{row.kegiatan}</td>
                                        <td className={`px-5 py-3 text-[13px] ${row.aktif ? 'text-primary font-bold' : 'text-n600'}`}>{row.tanggal}</td>
                                        <td className={`px-5 py-3 text-[12px] text-right ${row.aktif ? 'text-primary font-semibold' : 'text-n500'}`}>{row.keterangan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-start gap-2 bg-warning-light border border-amber-200 rounded-sm px-4 py-3">
                        <RiAlertLine size={14} className="text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-[12px] text-amber-800">
                            <strong>Perhatian:</strong> Batas akhir upload dokumen adalah{' '}
                            <strong>{setting?.tgl_tutup || '28 Februari 2025'}</strong>.{' '}
                            Dokumen yang belum diunggah tidak akan diproses panitia.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="bg-dark-blue py-10 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-3 gap-8 mb-8">
                        <div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Navigasi</p>
                            {['Beranda', 'Informasi & Jalur', 'Cara Daftar', 'Jadwal'].map((item, i) => (
                                <p key={i} className="text-[13px] text-white/60 hover:text-white cursor-pointer mb-2 transition-colors">{item}</p>
                            ))}
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary rounded-[14px] flex items-center justify-center mx-auto mb-3">
                                <RiSchoolLine size={22} color="#fff" />
                            </div>
                            <p className="text-[14px] font-bold text-white font-poppins mb-1">
                                {setting?.nama_sekolah || 'SMP Negeri 1 Tumpaan'}
                            </p>
                            <p className="text-[11px] text-white/50 leading-relaxed">
                                {setting?.alamat || 'Jl. Trans Sulawesi, Tumpaan, Kab. Minahasa Selatan, Sulawesi Utara'}
                            </p>
                            <p className="text-[11px] text-white/50 mt-1">
                                {setting?.email || 'ppdb@smpn1tumpaan.sch.id'} · {setting?.no_telepon || '(0431) 888-XXX'}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Sosial Media</p>
                            {[
                                { icon: RiFacebookBoxLine, label: 'Facebook' },
                                { icon: RiInstagramLine, label: 'Instagram' },
                                { icon: RiTwitterXLine, label: 'Twitter' },
                            ].map((item, i) => {
                                const Icon = item.icon
                                return (
                                    <div key={i} className="flex items-center gap-2 justify-end mb-2 cursor-pointer group">
                                        <span className="text-[13px] text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                                        <Icon size={15} className="text-white/60 group-hover:text-white transition-colors" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-5 text-center">
                        <p className="text-[11px] text-white/30">
                            © 2025 SMP Negeri 1 Tumpaan · Sistem Informasi Penerimaan Murid Baru
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Beranda