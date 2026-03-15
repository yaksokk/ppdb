import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-n100">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout