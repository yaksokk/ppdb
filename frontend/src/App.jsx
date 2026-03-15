import { useState } from 'react'
import {
  StatCard, Pagination, Table, Tr, Td,
  FileUpload, Badge
} from './components/common'

function App() {
  const [page, setPage] = useState(1)
  const [file, setFile] = useState(null)

  return (
    <div className="p-8 bg-n100 min-h-screen flex flex-col gap-8">

      {/* ────── StatCard ────── */}
      <div>
        <p className="text-[11px] font-bold text-n500 uppercase tracking-wide mb-3">StatCard</p>
        <div className="grid grid-cols-4 gap-3">
          <StatCard icon="👥" label="Total Pendaftar" value="128" sub="TA 2025/2026" iconBg="bg-primary-light" />
          <StatCard icon="✅" label="Diterima" value="87" sub="68%" iconBg="bg-success-light" />
          <StatCard icon="⏳" label="Menunggu" value="24" sub="Perlu verifikasi" iconBg="bg-warning-light" />
          <StatCard icon="❌" label="Ditolak" value="17" sub="Dokumen tidak valid" iconBg="bg-danger-light" />
        </div>
      </div>

      {/* ────── Table ────── */}
      <div>
        <p className="text-[11px] font-bold text-n500 uppercase tracking-wide mb-3">Table</p>
        <Table headers={['No', 'Nama', 'Jalur', 'Status']}>
          <Tr>
            <Td>1</Td>
            <Td>Ahmad Santoso</Td>
            <Td>Zonasi</Td>
            <Td><Badge variant="menunggu">Menunggu</Badge></Td>
          </Tr>
          <Tr>
            <Td>2</Td>
            <Td>Mariska Dondokambey</Td>
            <Td>Prestasi</Td>
            <Td><Badge variant="diterima">Diterima</Badge></Td>
          </Tr>
          <Tr>
            <Td>3</Td>
            <Td>Budi Santoso</Td>
            <Td>Afirmasi</Td>
            <Td><Badge variant="perbaikan">Perbaikan</Badge></Td>
          </Tr>
        </Table>
      </div>

      {/* ────── Pagination ────── */}
      <div>
        <p className="text-[11px] font-bold text-n500 uppercase tracking-wide mb-3">Pagination</p>
        <Pagination current={page} total={5} onChange={setPage} />
      </div>

      {/* ────── FileUpload ────── */}
      <div className="max-w-md">
        <p className="text-[11px] font-bold text-n500 uppercase tracking-wide mb-3">FileUpload</p>
        <div className="flex flex-col gap-3">
          <FileUpload
            label="Upload Ijazah / SKL"
            hint="Format PDF, JPG, PNG — maks. 2MB"
            accept=".pdf,.jpg,.png"
            value={file}
            onChange={setFile}
          />
          <FileUpload
            label="Upload KTP Orang Tua"
            hint="Format PDF, JPG, PNG — maks. 2MB"
            error="Dokumen perlu diperbaiki"
            note="Catatan admin: foto KTP tidak jelas, harap upload ulang."
          />
        </div>
      </div>

    </div>
  )
}

export default App