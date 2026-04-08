import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import './styles/navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

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
          <Link to="/">
            <span className="logo-text">ALİ GÜVEN</span>
            <span className="logo-subtext">UYGULAMA OTELİ</span>
          </Link>
        </div>

        <div className="navbar-right">
          <ul className="navbar-links">
            <li><Link to="/rooms">Odalar</Link></li>
            <li><Link to="/restaurant">Restoran</Link></li>
            <li><Link to="/events">Organizasyon &amp; Düğün</Link></li>
            <li><Link to="/contact">İletişim</Link></li>
          </ul>

          <div className="navbar-actions">
            <a
              href="https://wa.me/902223300326"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm btn-rounded cursor-pointer navbar-rez-btn"
            >
              Rezervasyon
            </a>
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
          <span className="logo-text">ALİ GÜVEN</span>
          <button className="mobile-menu-close cursor-pointer" onClick={closeMenu}>
            <X size={28} />
          </button>
        </div>
        <ul className="mobile-menu-links">
          <li><Link to="/" onClick={closeMenu}>Ana Sayfa</Link></li>
          <li><Link to="/rooms" onClick={closeMenu}>Odalar</Link></li>
          <li><Link to="/restaurant" onClick={closeMenu}>Restoran</Link></li>
          <li><Link to="/events" onClick={closeMenu}>Organizasyon &amp; Düğün</Link></li>
          <li><Link to="/meetings" onClick={closeMenu}>Toplantı &amp; Etkinlik</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>İletişim</Link></li>
          <li className="mobile-rez-item">
            <a
              href="https://wa.me/902223300326"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block cursor-pointer"
              onClick={closeMenu}
            >
              Rezervasyon Yap
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
