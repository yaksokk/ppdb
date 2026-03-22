import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { RiSchoolLine, RiEyeLine, RiEyeOffLine, RiShieldUserLine, RiUserSettingsLine } from 'react-icons/ri'
import { Button, Spinner } from '../../../components/common'
import { FormInput } from '../../../components/form'
import authService from '../../../services/auth.service'
import useAuthStore from '../../../store/authStore'

function LoginAdmin() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || 'admin')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.email) errs.email = 'Email wajib diisi'
    if (!form.password) errs.password = 'Kata sandi wajib diisi'
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      const res = await authService.login(form)
      const { token, user } = res.data

      if (user.role !== 'admin' && user.role !== 'operator') {
        setErrors({ email: 'Akun ini bukan admin atau operator' })
        return
      }
      if (user.role !== role) {
        setErrors({ email: `Akun ini bukan ${role === 'admin' ? 'Admin' : 'Operator'}. Silakan pilih tab yang sesuai.` })
        return
      }

      setAuth(user, token)

      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/operator/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.email?.[0] || 'Email atau password salah'
      setErrors({ email: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #0F2B5B 0%, #1E3A8A 60%, #2563EB 100%)' }}
    >
      <div className="bg-white border border-n200 rounded-xl p-8 w-full max-w-[370px] shadow-md">

        <div className="flex justify-center mb-1.5">
          <div className="w-[46px] h-[46px] bg-dark-blue rounded-[14px] flex items-center justify-center">
            <RiSchoolLine size={22} color="#fff" />
          </div>
        </div>

        <h1 className="text-[20px] font-bold font-poppins text-n800 text-center mb-1">
          Masuk Admin
        </h1>
        <p className="text-[12px] text-n500 text-center mb-5">
          PPDB SMP Negeri 1 Tumpaan
        </p>

        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 rounded-sm
              text-[12px] font-semibold border-[1.5px] transition-all duration-150
              ${role === 'admin'
                ? 'bg-warning-light text-warning border-amber-300'
                : 'bg-white text-n500 border-n200 hover:bg-n50'}
            `}
          >
            <RiUserSettingsLine size={14} /> Admin
          </button>
          <button
            type="button"
            onClick={() => setRole('operator')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 rounded-sm
              text-[12px] font-semibold border-[1.5px] transition-all duration-150
              ${role === 'operator'
                ? 'bg-success-light text-success border-green-300'
                : 'bg-white text-n500 border-n200 hover:bg-n50'}
            `}
          >
            <RiShieldUserLine size={14} /> Operator
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="email@contoh.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <div className="relative mb-4">
            <FormInput
              label="Kata Sandi"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan kata sandi"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[30px] text-n400 hover:text-n600"
            >
              {showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
            </button>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading
              ? <><Spinner size="sm" color="white" /> Memproses...</>
              : `Masuk sebagai ${role === 'admin' ? 'Admin' : 'Operator'}`}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-[11px] text-n400 hover:text-n600">
            ← Kembali ke Login Pendaftar
          </Link>
        </div>

      </div>
    </div>
  )
}

export default LoginAdmin