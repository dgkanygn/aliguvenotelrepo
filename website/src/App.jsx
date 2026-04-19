import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Restaurant from './pages/Restaurant'
import Events from './pages/Events'
import Meetings from './pages/Meetings'
import Contact from './pages/Contact'
import SpaceDetails from './pages/SpaceDetails'
import TermsAndPrivacy from './pages/TermsAndPrivacy'
import CookiePolicy from './pages/CookiePolicy'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/ScrollToTop'
import CookieBanner from './components/CookieBanner'

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Pages with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/events" element={<Events />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/event-detail/:type/:id" element={<SpaceDetails />} />
          <Route path="/terms-and-privacy" element={<TermsAndPrivacy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Route>

        {/* 404 Page (No Navbar/Footer) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieBanner />
    </>
  )
}

export default App