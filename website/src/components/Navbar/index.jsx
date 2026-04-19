import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../Logo'
import './styles/navbar.css'
import { useNavMenus } from './hooks/useNavMenus'

const hasCategory = (saloon, category) => {
  if (!saloon.category_keys) return true;
  if (Array.isArray(saloon.category_keys)) return saloon.category_keys.includes(category);
  if (typeof saloon.category_keys === 'string') return saloon.category_keys.includes(category);
  return true;
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { menus } = useNavMenus()

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu()
  }, [location, closeMenu])

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Logo showText={false} />
        </div>

        <div className="navbar-right">
          <ul className="navbar-links">
            <li><Link to="/">Ana Sayfa</Link></li>
            <li className="has-dropdown">
              <Link to="/rooms">Odalar</Link>
              <ul className="dropdown-menu">
                {menus.rooms.map(room => (
                  <li key={room.id}><Link to={`/event-detail/rooms/${room.id}`}>{room.title}</Link></li>
                ))}
              </ul>
            </li>
            <li><Link to="/restaurant">Restoran</Link></li>
            <li className="has-dropdown">
              <Link to="/events">Organizasyon &amp; Düğün</Link>
              <ul className="dropdown-menu">
                {menus.saloons.filter(s => hasCategory(s, 'events')).map(saloon => (
                  <li key={saloon.id}><Link to={`/event-detail/saloons/${saloon.id}`}>{saloon.title}</Link></li>
                ))}
              </ul>
            </li>
            <li className="has-dropdown">
              <Link to="/meetings">Toplantı &amp; Etkinlik</Link>
              <ul className="dropdown-menu">
                {menus.saloons.filter(s => hasCategory(s, 'meetings')).map(saloon => (
                  <li key={saloon.id}><Link to={`/event-detail/saloons/${saloon.id}`}>{saloon.title}</Link></li>
                ))}
              </ul>
            </li>
            <li><Link to="/contact">İletişim</Link></li>
          </ul>

          <div className="navbar-actions">
            <button
              className="navbar-toggle cursor-pointer"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <Logo onClick={closeMenu} showText={false} />
          <button className="mobile-menu-close cursor-pointer" onClick={closeMenu}>
            <X size={28} />
          </button>
        </div>
        <ul className="mobile-menu-links">
          <li><Link to="/" onClick={closeMenu}>Ana Sayfa</Link></li>
          <li className="mobile-has-dropdown">
            <span className="mobile-dropdown-label">Odalar</span>
            <ul className="mobile-dropdown">
              {menus.rooms.map(room => (
                <li key={room.id}><Link to={`/event-detail/rooms/${room.id}`} onClick={closeMenu}>{room.title}</Link></li>
              ))}
            </ul>
          </li>
          <li><Link to="/restaurant" onClick={closeMenu}>Restoran</Link></li>
          <li className="mobile-has-dropdown">
            <span className="mobile-dropdown-label">Organizasyon &amp; Düğün</span>
            <ul className="mobile-dropdown">
              {menus.saloons.filter(s => hasCategory(s, 'events')).map(saloon => (
                <li key={saloon.id}><Link to={`/event-detail/saloons/${saloon.id}`} onClick={closeMenu}>{saloon.title}</Link></li>
              ))}
            </ul>
          </li>
          <li className="mobile-has-dropdown">
            <span className="mobile-dropdown-label">Toplantı &amp; Etkinlik</span>
            <ul className="mobile-dropdown">
              {menus.saloons.filter(s => hasCategory(s, 'meetings')).map(saloon => (
                <li key={saloon.id}><Link to={`/event-detail/saloons/${saloon.id}`} onClick={closeMenu}>{saloon.title}</Link></li>
              ))}
            </ul>
          </li>
          <li><Link to="/contact" onClick={closeMenu}>İletişim</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

