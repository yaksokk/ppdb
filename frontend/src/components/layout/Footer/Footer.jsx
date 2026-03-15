import { RiSchoolLine } from 'react-icons/ri'

function Footer() {
    return (
        <footer className="bg-dark-blue border-t border-white/8 px-12 py-8">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center flex-shrink-0">
                            <RiSchoolLine size={18} color="#fff" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-white font-poppins">PPDB Online</p>
                            <p className="text-[10px] text-white/40">SMP Negeri 1 Tumpaan</p>
                        </div>
                    </div>
                    <p className="text-[12px] text-white/50 max-w-xs leading-relaxed">
                        Sistem Penerimaan Peserta Didik Baru SMP Negeri 1 Tumpaan Tahun Ajaran 2025/2026.
                    </p>
                </div>

                <div className="flex gap-12">
                    <div>
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wide mb-3">Navigasi</p>
                        {['Beranda', 'Informasi Jalur', 'Pengumuman', 'Cek Status'].map(item => (
                            <p key={item} className="text-[12px] text-white/60 hover:text-white cursor-pointer mb-1.5 transition-colors">
                                {item}
                            </p>
                        ))}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wide mb-3">Akun</p>
                        {['Masuk', 'Daftar Akun', 'Cek Status'].map(item => (
                            <p key={item} className="text-[12px] text-white/60 hover:text-white cursor-pointer mb-1.5 transition-colors">
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/8 mt-6 pt-4">
                <p className="text-[11px] text-white/30 text-center">
                    © 2025 SMP Negeri 1 Tumpaan. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer