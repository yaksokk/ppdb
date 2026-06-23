import { useState, useEffect, useMemo } from 'react'
import { RiPercentLine, RiGroupLine, RiSaveLine } from 'react-icons/ri'
import { Button, Spinner, Alert } from '../../../components/common'
import DashboardLayout from '../../../components/layout/DashboardLayout/DashboardLayout'
import adminService from '../../../services/admin.service'
import useAuthStore from '../../../store/authStore'

const JALUR_CONFIG = [
  { kode: 'zonasi',   key: 'kuota_persen_zonasi',   label: 'Zonasi',   color: 'text-primary',   bg: 'bg-primary-light   border-blue-200' },
  { kode: 'prestasi', key: 'kuota_persen_prestasi', label: 'Prestasi', color: 'text-warning',   bg: 'bg-warning-light   border-amber-200' },
  { kode: 'afirmasi', key: 'kuota_persen_afirmasi', label: 'Afirmasi', color: 'text-amber-500', bg: 'bg-orange-50       border-orange-200' },
  { kode: 'mutasi',   key: 'kuota_persen_mutasi',   label: 'Mutasi',   color: 'text-cyan',      bg: 'bg-cyan-50         border-cyan-200' },
]

function SettingKuota() {
  const { user } = useAuthStore()
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [successMsg,   setSuccessMsg]   = useState('')
  const [errorMsg,     setErrorMsg]     = useState('')
  const [kuotaTotal,   setKuotaTotal]   = useState('')
  const [persen, setPersen] = useState({
    kuota_persen_zonasi:   '',
    kuota_persen_prestasi: '',
    kuota_persen_afirmasi: '',
    kuota_persen_mutasi:   '',
  })

  const userObj = {
    name: user?.name || 'Admin',
    avatarStyle: { background: 'rgba(217,119,6,.2)', color: '#FCD34D' },
  }

  useEffect(() => {
    adminService.getKuota()
      .then(res => {
        const s = res.data.settings
        setKuotaTotal(s.kuota_total || '')
        setPersen({
          kuota_persen_zonasi:   s.kuota_persen_zonasi   || '',
          kuota_persen_prestasi: s.kuota_persen_prestasi || '',
          kuota_persen_afirmasi: s.kuota_persen_afirmasi || '',
          kuota_persen_mutasi:   s.kuota_persen_mutasi   || '',
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalPersen = useMemo(() => {
    return Object.values(persen).reduce((sum, v) => sum + (parseFloat(v) || 0), 0)
  }, [persen])

  const persenValid = Math.abs(totalPersen - 100) < 0.01

  const kuotaPerJalur = useMemo(() => {
    const total = parseInt(kuotaTotal) || 0
    return JALUR_CONFIG.map(j => ({
      ...j,
      kuota: Math.round(total * (parseFloat(persen[j.key]) || 0) / 100),
    }))
  }, [kuotaTotal, persen])

  const handleSave = async () => {
    if (!persenValid) {
      setErrorMsg('Total persentase harus tepat 100%.')
      return
    }
    setSaving(true)
    setErrorMsg('')
    try {
      await adminService.updateKuota({
        kuota_total:           parseInt(kuotaTotal),
        kuota_persen_zonasi:   parseFloat(persen.kuota_persen_zonasi),
        kuota_persen_prestasi: parseFloat(persen.kuota_persen_prestasi),
        kuota_persen_afirmasi: parseFloat(persen.kuota_persen_afirmasi),
        kuota_persen_mutasi:   parseFloat(persen.kuota_persen_mutasi),
      })
      setSuccessMsg('Kuota berhasil diperbarui!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal menyimpan kuota.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <DashboardLayout role="admin" user={userObj} activePath="/admin/kuota">
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout role="admin" user={userObj} activePath="/admin/kuota">
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold font-poppins text-n800">Setting Kuota</h1>
        <p className="text-[12px] text-n500 mt-0.5">Atur total kuota penerimaan dan persentase per jalur</p>
      </div>

      {successMsg && <div className="mb-4"><Alert variant="green">{successMsg}</Alert></div>}
      {errorMsg   && <div className="mb-4"><Alert variant="red">{errorMsg}</Alert></div>}

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="flex flex-col gap-4">

          {/* Total Kuota */}
          <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
            <p className="text-[15px] font-bold font-poppins text-n800 mb-4">Total Kuota Penerimaan</p>
            <div className="max-w-[200px]">
              <label className="block text-[11px] font-bold text-n600 uppercase tracking-wide mb-1.5">
                Jumlah Siswa <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <RiGroupLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-n400" />
                <input
                  type="number" min="1" value={kuotaTotal}
                  onChange={e => setKuotaTotal(e.target.value)}
                  placeholder="Contoh: 110"
                  className="w-full pl-8 pr-3 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Persentase Per Jalur */}
          <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] font-bold font-poppins text-n800">Persentase Per Jalur</p>
              <span className={`text-[13px] font-bold px-3 py-1 rounded-pill border ${
                persenValid
                  ? 'bg-success-light border-green-200 text-success'
                  : 'bg-danger-light border-red-200 text-danger'
              }`}>
                Total: {totalPersen.toFixed(1)}%
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {JALUR_CONFIG.map(j => (
                <div key={j.kode} className="flex items-center gap-4">
                  <div className="w-[120px] flex-shrink-0">
                    <p className={`text-[13px] font-bold ${j.color}`}>{j.label}</p>
                  </div>
                  <div className="relative w-[120px] flex-shrink-0">
                    <input
                      type="number" min="0" max="100" step="0.1"
                      value={persen[j.key]}
                      onChange={e => setPersen(prev => ({ ...prev, [j.key]: e.target.value }))}
                      placeholder="0"
                      className="w-full pl-3 pr-7 py-[9px] text-[13px] border-[1.5px] border-n200 rounded-sm outline-none focus:border-primary text-center"
                    />
                    <RiPercentLine size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-n400" />
                  </div>
                  <p className="text-[12px] text-n500 flex-1">
                    = <strong className={j.color}>
                      {Math.round((parseInt(kuotaTotal) || 0) * (parseFloat(persen[j.key]) || 0) / 100)} siswa
                    </strong>
                  </p>
                </div>
              ))}
            </div>

            {!persenValid && totalPersen > 0 && (
              <p className="mt-3 text-[12px] text-danger">
                Total persentase harus 100%. Selisih: {(totalPersen - 100).toFixed(1)}%
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving || !persenValid || !kuotaTotal}>
              {saving ? <><Spinner size="sm" color="white" /> Menyimpan...</> : <><RiSaveLine size={14} /> Simpan Kuota</>}
            </Button>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="bg-white border border-n200 rounded-lg p-5 shadow-xs h-fit">
          <p className="text-[15px] font-bold font-poppins text-n800 mb-4">Ringkasan Kuota</p>
          <div className="flex flex-col gap-3">
            {kuotaPerJalur.map(j => (
              <div key={j.kode} className={`flex items-center justify-between p-3 rounded-sm border ${j.bg}`}>
                <div>
                  <p className={`text-[13px] font-bold ${j.color}`}>{j.label}</p>
                  <p className="text-[11px] text-n500">{parseFloat(persen[j.key]) || 0}% dari total</p>
                </div>
                <span className={`text-[22px] font-extrabold ${j.color}`}>{j.kuota}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-n200 flex items-center justify-between">
            <span className="text-[13px] font-bold text-n700">Total</span>
            <span className="text-[22px] font-extrabold text-n800">{parseInt(kuotaTotal) || 0}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SettingKuota
