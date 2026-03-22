import Sidebar from '../Sidebar/Sidebar'
import Topbar from '../Topbar/Topbar'

function DashboardLayout({ role, user, activePath, pageTitle, children }) {
  return (
    <div className="flex min-h-screen bg-n100">
      <Sidebar role={role} user={user} activePath={activePath} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={pageTitle} user={user} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout