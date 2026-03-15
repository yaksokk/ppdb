import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { RiSchoolLine, RiEyeLine, RiEyeOffLine, RiShieldUserLine, RiUserSettingsLine } from 'react-icons/ri'
import { Button } from '../../../components/common'
import { FormInput } from '../../../components/form'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.email)    errs.email    = 'Email wajib diisi'
    if (!form.password) errs.password = 'Password wajib diisi'
    if (Object.keys(errs).length) return setErrors(errs)
    navigate('/pendaftar/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #0F2B5B 0%, #1E3A8A 60%, #2563EB 100%)' }}
    >
      <div className="bg-white border border-n200 rounded-xl p-8 w-full max-w-[370px] shadow-md">

        <div className="flex justify-center mb-1.5">
          <div className="w-[46px] h-[46px] bg-primary rounded-[14px] flex items-center justify-center">
            <RiSchoolLine size={22} color="#fff" />
          </div>
        </div>

        <h1 className="text-[20px] font-bold font-poppins text-n800 text-center mb-1">
          PPDB Online
        </h1>
        <p className="text-[12px] text-n500 text-center mb-6">
          SMP Negeri 1 Tumpaan
        </p>

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

          <div className="relative mb-3">
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

          <Button type="submit" fullWidth>
            Masuk ke Akun
          </Button>
        </form>

        <div className="relative text-center my-3">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-n200" />
          <span className="relative bg-white px-3 text-[11px] text-n400">
            atau masuk sebagai
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/admin/login?role=admin')}>
             <RiUserSettingsLine size={14} />
             Admin
          </Button>
          <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/admin/login?role=operator')}>
            <RiShieldUserLine size={14} />
            Operator
          </Button>
        </div>

        <div className="text-center">
          <p className="text-[12px] text-n500 mb-2">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Daftar di sini
            </Link>
          </p>
          <Link to="/" className="text-[11px] text-primary hover:text-n600">
            ← Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login