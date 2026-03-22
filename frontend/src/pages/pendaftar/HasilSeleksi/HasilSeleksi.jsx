import { useState, useEffect } from 'react'
import { RiPrinterLine, RiDownloadLine, RiCheckLine, RiCloseLine, RiTrophyLine } from 'react-icons/ri'
import { RiEmotionHappyLine, RiEmotionUnhappyLine } from 'react-icons/ri'
import { Badge, Button, Spinner } from '../../../components/common'
import AdminLayout from '../../../components/layout/AdminLayout/AdminLayout'
import pendaftarService from '../../../services/pendaftar.service'
import useAuthStore from '../../../store/authStore'
import jsPDF from 'jspdf'

function InfoRow({ label, value }) {
  return (
    <div className="flex py-2 border-b border-n200 last:border-0">
      <span className="text-[12px] text-n500 w-[140px] flex-shrink-0">{label}</span>
      <span className="text-[13px] text-n800 flex-1">{value}</span>
    </div>
  )
}

function HasilSeleksiPendaftar() {
  const { user } = useAuthStore()
  const [pendaftaran, setPendaftaran] = useState(null)
  const [loading, setLoading] = useState(true)

  const userObj = {
    name: user?.name || 'Pendaftar',
    avatarStyle: { background: 'rgba(37,99,235,.25)', color: '#93C5FD' },
  }

  useEffect(() => {
    pendaftarService.getHasil()
      .then(res => setPendaftaran(res.data.pendaftaran))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <AdminLayout role="pendaftar" user={userObj} activePath="/pendaftar/hasil">
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </AdminLayout>
  )

  if (!pendaftaran) return (
    <AdminLayout role="pendaftar" user={userObj} activePath="/pendaftar/hasil">
      <div className="flex justify-center py-20">
        <p className="text-[13px] text-n500">Hasil seleksi belum tersedia.</p>
      </div>
    </AdminLayout>
  )

  const diterima = pendaftaran.status === 'diterima'
  const seleksi = pendaftaran.seleksi

  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('BUKTI KELULUSAN PPDB', 105, 20, { align: 'center' })
    doc.text('SMP Negeri 1 Tumpaan', 105, 30, { align: 'center' })
    doc.text('Tahun Ajaran 2025/2026', 105, 38, { align: 'center' })

    doc.setLineWidth(0.5)
    doc.line(20, 43, 190, 43)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(22, 163, 74)
    doc.text('DINYATAKAN DITERIMA', 105, 55, { align: 'center' })

    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)

    const data = [
      ['No. Pendaftaran', pendaftaran.no_pendaftaran],
      ['Nama Lengkap', pendaftaran.data_diri?.nama_lengkap],
      ['NISN', pendaftaran.data_diri?.nisn],
      ['Jalur', pendaftaran.jalur?.nama],
      ['Status', 'Diterima'],
    ]

    if (pendaftaran.seleksi?.ranking) {
      data.push(['Ranking', `#${pendaftaran.seleksi.ranking}`])
    }
    if (pendaftaran.seleksi?.skor_saw) {
      data.push(['Skor SAW', parseFloat(pendaftaran.seleksi.skor_saw).toFixed(4)])
    }

    let y = 70
    data.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold')
      doc.text(`${label}`, 30, y)
      doc.setFont('helvetica', 'normal')
      doc.text(`: ${value || '-'}`, 90, y)
      y += 10
    })

    doc.line(20, y + 5, 190, y + 5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Informasi Daftar Ulang', 30, y + 15)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Tanggal : 16-20 Maret 2025', 30, y + 25)
    doc.text('Tempat  : Ruang TU SMP N 1 Tumpaan', 30, y + 33)
    doc.text('Jam     : 08.00-12.00 WITA', 30, y + 41)
    doc.text('Bawa: Ijazah asli, Akta asli, KK asli, pas foto 3x4 (4 lembar),', 30, y + 51)
    doc.text('dan bukti kelulusan yang dicetak.', 30, y + 59)

    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 105, 280, { align: 'center' })

    doc.save(`Bukti_Kelulusan_${pendaftaran.no_pendaftaran}.pdf`)
  }

  return (
    <AdminLayout role="pendaftar" user={userObj} activePath="/pendaftar/hasil">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Hasil Seleksi</h1>
      </div>

      <div className="bg-white border border-n200 rounded-lg p-8 shadow-xs mb-4 text-center">
        <div className="mb-4">
          {diterima
            ? <RiEmotionHappyLine size={56} className="text-success mx-auto" />
            : <RiEmotionUnhappyLine size={56} className="text-danger mx-auto" />}
        </div>

        <h2 className={`text-[20px] font-extrabold font-poppins mb-2 ${diterima ? 'text-success' : 'text-danger'}`}>
          {diterima ? 'SELAMAT! ANDA DINYATAKAN DITERIMA' : 'MAAF, ANDA TIDAK DITERIMA'}
        </h2>

        <p className="text-[13px] text-n500 mb-5">
          {pendaftaran.data_diri?.nama_lengkap} · {pendaftaran.no_pendaftaran} · Jalur {pendaftaran.jalur?.nama}
        </p>

        {diterima && (
          <div className="flex gap-2 justify-center">
            <Button variant="success" onClick={() => window.print()}>
              <RiPrinterLine size={14} /> Cetak Bukti Kelulusan
            </Button>
            <Button variant="ghost" onClick={handleDownloadPDF}>
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
          <InfoRow label="No. Pendaftaran" value={pendaftaran.no_pendaftaran} />
          <InfoRow label="Nama Lengkap" value={pendaftaran.data_diri?.nama_lengkap} />
          <InfoRow label="NISN" value={pendaftaran.data_diri?.nisn} />
          <InfoRow label="Jalur" value={
            <span className="flex items-center gap-1 font-semibold">
              <RiTrophyLine size={13} className="text-warning" /> {pendaftaran.jalur?.nama}
            </span>
          } />
          {seleksi?.skor_saw && (
            <InfoRow label="Skor SAW" value={
              <span className="font-semibold text-primary">{seleksi.skor_saw}</span>
            } />
          )}
          {seleksi?.ranking && (
            <InfoRow label="Ranking" value={
              <span className="font-semibold text-primary">#{seleksi.ranking}</span>
            } />
          )}
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
            <InfoRow label="Tanggal" value="16-20 Maret 2025" />
            <InfoRow label="Tempat" value="Ruang TU SMP N 1 Tumpaan" />
            <InfoRow label="Jam" value="08.00-12.00 WITA" />
            <div className="mt-3 bg-primary-light border border-blue-200 rounded-sm px-3 py-2.5">
              <p className="text-[12px] text-blue-800 leading-relaxed">
                Bawa: Ijazah asli, Akta asli, KK asli, pas foto 3x4 (4 lembar), dan bukti kelulusan yang dicetak.
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default HasilSeleksiPendaftar