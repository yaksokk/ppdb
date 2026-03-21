import AppRoutes from './routes/AppRoutes'
import { useActivityTracker } from './hooks/useActivityTracker'
function App() {
  useActivityTracker()
  return <AppRoutes />
}

export default App