import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { RiSchoolLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { Button, Spinner } from '../../../components/common'
import { FormInput } from '../../../components/form'
import authService from '../../../services/auth.service'
import useAuthStore from '../../../store/authStore'

function PasswordStrength({ password }) {
    const checks = [
        password.length >= 8,
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
    ]
    const strength = checks.filter(Boolean).length
    const colors = ['bg-n200', 'bg-danger', 'bg-warning', 'bg-cyan', 'bg-success']

    return (
        <div className="flex gap-1 mt-1.5">
            {[0, 1, 2, 3].map(i => (
                <div key={i} className={`h-[3px] flex-1 rounded-pill transition-all duration-300 ${i < strength ? colors[strength] : 'bg-n200'}`} />
            ))}
        </div>
    )
}

function Register() {
    const navigate = useNavigate()
    const { setAuth } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = {}
        if (!form.name) errs.name = 'Nama wajib diisi'
        if (!form.email) errs.email = 'Email wajib diisi'
        if (!form.password) errs.password = 'Kata sandi wajib diisi'
        if (form.password.length < 8) errs.password = 'Minimal 8 karakter'
        if (!/[a-z]/.test(form.password)) errs.password = 'Harus mengandung huruf kecil'
        if (!/[A-Z]/.test(form.password)) errs.password = 'Harus mengandung huruf besar'
        if (!/[0-9]/.test(form.password)) errs.password = 'Harus mengandung angka'
        if (form.password !== form.password_confirmation) errs.password_confirmation = 'Kata sandi tidak cocok'
        if (Object.keys(errs).length) return setErrors(errs)

        setLoading(true)
        try {
            const res = await authService.register(form)
            const { token, user } = res.data
            setAuth(user, token)
            navigate('/login')
        } catch (err) {
            const errData = err.response?.data?.errors
            if (errData) {
                const mapped = {}
                Object.keys(errData).forEach(k => { mapped[k] = errData[k][0] })
                setErrors(mapped)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{ background: 'linear-gradient(135deg, #0F2B5B 0%, #1E3A8A 60%, #2563EB 100%)' }}
        >
            <div className="bg-white border border-n200 rounded-xl p-8 w-full max-w-[420px] shadow-md">

                <div className="flex justify-center mb-1.5">
                    <div className="w-[46px] h-[46px] bg-primary rounded-[14px] flex items-center justify-center">
                        <RiSchoolLine size={22} color="#fff" />
                    </div>
                </div>

                <h1 className="text-[20px] font-bold font-poppins text-n800 text-center mb-1">
                    Buat Akun Pendaftar
                </h1>
                <p className="text-[12px] text-n500 text-center mb-6">
                    Isi data berikut untuk memulai pendaftaran PPDB online.
                </p>

                <form onSubmit={handleSubmit}>
                    <FormInput
                        label="Nama Lengkap"
                        name="name"
                        placeholder="Nama lengkap orang tua/wali"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                    />

                    <div className="mb-3">
                        <FormInput
                            label="Alamat Email"
                            name="email"
                            type="email"
                            placeholder="contoh@gmail.com"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />
                        {!errors.email && (
                            <p className="text-[11px] text-n400 mt-1">Gunakan email aktif untuk login dan notifikasi.</p>
                        )}
                    </div>

                    <div className="mb-3">
                        <div className="relative">
                            <FormInput
                                label="Kata Sandi"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Buat kata sandi yang kuat"
                                value={form.password}
                                onChange={handleChange}
                                error={errors.password}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[30px] text-n400 hover:text-n600">
                                {showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                            </button>
                        </div>
                        {form.password && <PasswordStrength password={form.password} />}
                        {!errors.password && (
                            <p className="text-[11px] text-n400 mt-1.5">
                                Minimal 8 karakter. Kombinasikan huruf besar, huruf kecil, dan angka.
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <div className="relative">
                            <FormInput
                                label="Konfirmasi Kata Sandi"
                                name="password_confirmation"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Ketik ulang kata sandi di atas"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                error={errors.password_confirmation}
                                required
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-[30px] text-n400 hover:text-n600">
                                {showConfirm ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                            </button>
                        </div>
                        {!errors.password_confirmation && (
                            <p className="text-[11px] text-n400 mt-1">Pastikan kata sandi yang diketik sama persis dengan di atas.</p>
                        )}
                    </div>

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? <><Spinner size="sm" color="white" /> Memproses...</> : 'Buat Akun & Mulai Daftar →'}
                    </Button>
                </form>

                <div className="relative text-center my-3">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-n200" />
                    <span className="relative bg-white px-3 text-[11px] text-n400">atau</span>
                </div>

                <div className="text-center">
                    <p className="text-[12px] text-n500 mb-2">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">Masuk di sini</Link>
                    </p>
                    <Link to="/" className="text-[11px] text-n400 hover:text-n600">← Kembali ke Beranda</Link>
                </div>

            </div>
        </div>
    )
}

export default Register