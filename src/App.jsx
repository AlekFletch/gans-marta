import Nav from './components/Nav'
import Hero from './components/Hero'
import Interior from './components/Interior'
import Menu from './components/Menu'
import MapSection from './components/MapSection'
import Invitation from './components/Invitation'
import Footer from './components/Footer'
import BookingModal from './components/BookingModal'
import { BookingModalProvider } from './context/BookingModalContext'

export default function App() {
  return (
    <BookingModalProvider>
      <Nav />
      <main>
        <Hero />
        <Interior />
        <Menu />
        <MapSection />
        <Invitation />
      </main>
      <Footer />
      <BookingModal />
    </BookingModalProvider>
  )
}
