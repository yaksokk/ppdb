import { useNavigate } from 'react-router-dom'
import { RiFileList3Line, RiUploadCloud2Line, RiCheckLine } from 'react-icons/ri'
import { Badge, Button } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'

const user = {
    name: 'Ahmad Santoso',
    avatarStyle: { background: 'rgba(37,99,235,.25)', color: '#93C5FD' },
}

const STATUS_CONFIG = {
    draft: { label: 'Belum Mengisi', desc: 'Silakan lengkapi formulir dan upload semua dokumen yang diperlukan.', icon: RiFileList3Line, iconColor: 'text-n400' },
    menunggu: { label: 'Menunggu Verifikasi', desc: 'Dokumen kamu sedang diperiksa oleh operator. Harap tunggu.', icon: RiFileList3Line, iconColor: 'text-warning' },
    perbaikan: { label: 'Perlu Perbaikan', desc: 'Ada dokumen yang perlu diperbaiki. Segera upload ulang.', icon: RiUploadCloud2Line, iconColor: 'text-orange-500' },
    diterima: { label: 'Diterima', desc: 'Selamat! Kamu diterima di SMP Negeri 1 Tumpaan.', icon: RiCheckLine, iconColor: 'text-success' },
    ditolak: { label: 'Tidak Diterima', desc: 'Maaf, kamu tidak diterima pada PPDB tahun ini.', icon: RiFileList3Line, iconColor: 'text-danger' },
}

const STEPS = [
    { label: 'Akun Dibuat' },
    { label: 'Isi Form & Upload' },
    { label: 'Verifikasi' },
    { label: 'Hasil' },
]

function StepIndicator({ currentStep = currentStep }) {
    return (
        <div className="flex items-center">
            {STEPS.map((step, i) => {
                const stepNum = i + 1
                const isDone = stepNum < currentStep
                const isActive = stepNum === currentStep
                const isIdle = stepNum > currentStep

                return (
                    <div key={i} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-[11px] font-bold transition-all duration-200
                ${isDone ? 'bg-success text-white' : ''}
                ${isActive ? 'bg-primary text-white shadow-[0_0_0_4px_#EFF6FF]' : ''}
                ${isIdle ? 'bg-n200 text-n500' : ''}
              `}>
                                {isDone ? <RiCheckLine size={14} /> : stepNum}
                            </div>
                            <span className={`
                text-[10px] font-semibold text-center max-w-[60px] leading-snug
                ${isDone ? 'text-success' : ''}
                ${isActive ? 'text-primary' : ''}
                ${isIdle ? 'text-n400' : ''}
              `}>
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-[2px] mb-5 mx-1 ${isDone ? 'bg-success' : 'bg-n200'}`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function DashboardPendaftar() {
    const navigate = useNavigate()
    const status = 'draft'
    const currentStep = 2
    const statusConfig = STATUS_CONFIG[status]
    const Icon = statusConfig.icon

    return (
        <AdminLayout
            role="pendaftar"
            user={user}
            activePath="/pendaftar/dashboard"
        >
            <div className="mb-5">
                <h1 className="text-[19px] font-extrabold font-poppins text-n800">Dashboard</h1>
            </div>

            <div
                className="rounded-lg px-5 py-4 mb-5 flex justify-between items-center overflow-hidden relative"
                style={{ background: 'linear-gradient(130deg, #1D4ED8, #3B82F6)' }}
            >
                <div>
                    <h2 className="text-[15px] font-bold text-white font-poppins mb-1">
                        Selamat Datang, Ahmad Santoso!
                    </h2>
                    <p className="text-[12px] text-white/70">
                        Selesaikan pendaftaran sebelum{' '}
                        <strong className="text-white">28 Februari 2025</strong>.
                    </p>
                </div>
                <RiFileList3Line size={64} className="text-white/10 flex-shrink-0" />
            </div>

            <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs mb-4">
                <p className="text-[15px] font-bold font-poppins text-n800 mb-3">Status Pendaftaran</p>
                <div className="flex items-center gap-3 p-3 border border-n200 rounded-sm">
                    <Icon size={20} className={`flex-shrink-0 ${statusConfig.iconColor}`} />
                    <div>
                        <p className="text-[13px] font-bold text-n800">{statusConfig.label}</p>
                        <p className="text-[12px] text-n500">{statusConfig.desc}</p>
                    </div>
                </div>
                {status === 'draft' && (
                    <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => navigate('/pendaftar/formulir')}>
                            Isi Formulir
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => navigate('/pendaftar/dokumen')}>
                            Upload Dokumen
                        </Button>
                    </div>
                )}
            </div>

            <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs mb-4">
                <p className="text-[15px] font-bold font-poppins text-n800 mb-4">Progress Pendaftaran</p>
                <StepIndicator currentStep={currentStep} />
            </div>

            <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
                <p className="text-[10px] font-bold text-n400 uppercase tracking-widest mb-3">
                    Simulasi Status (Demo)
                </p>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(STATUS_CONFIG).map(s => (
                        <Badge key={s} variant={s}>{STATUS_CONFIG[s].label}</Badge>
                    ))}
                </div>
            </div>

        </AdminLayout>
    )
}

export default DashboardPendaftar