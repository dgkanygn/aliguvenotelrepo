import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Restaurant from './pages/Restaurant'
import Events from './pages/Events'
import Meetings from './pages/Meetings'
import Contact from './pages/Contact'
import SpaceDetails from './pages/SpaceDetails'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/events" element={<Events />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/event-detail/:type/:id" element={<SpaceDetails />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App