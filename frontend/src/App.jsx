import { useNavigate } from 'react-router-dom'
import { RiLockLine } from 'react-icons/ri'
import AppRoutes from './routes/AppRoutes'
import { useActivityTracker } from './hooks/useActivityTracker'
import useAuthStore from './store/authStore'

// R4: Overlay global ketika PPDB ditutup dan pendaftar mencoba akses route terbatas
function PpdbClosedOverlay() {
  const { ppdbClosed, setPpdbClosed } = useAuthStore()
  const navigate = useNavigate()

  if (!ppdbClosed) return null

  const handleClose = () => {
    setPpdbClosed(false)
    navigate('/pendaftar/dashboard')
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
          <RiLockLine size={22} className="text-danger" />
        </div>
        <h2 className="text-[16px] font-extrabold font-poppins text-n800 mb-2">
          PPDB Sedang Ditutup
        </h2>
        <p className="text-[13px] text-n500 mb-5">
          Pendaftaran tidak dapat dilakukan saat ini karena periode PPDB sudah ditutup.
          Anda masih dapat melihat status dan hasil pendaftaran Anda.
        </p>
        <button
          onClick={handleClose}
          className="w-full py-2.5 bg-primary text-white text-[13px] font-bold rounded-sm hover:bg-primary-dark transition-all"
        >
          Mengerti
        </button>
      </div>
    </div>
  )
}

function App() {
  useActivityTracker()
  return (
    <>
      <AppRoutes />
      <PpdbClosedOverlay />
    </>
  )
}

export default App
