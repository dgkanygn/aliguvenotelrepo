import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa'
import Logo from '../Logo'
import { useSiteContext } from '../../context/SiteContext'
import { formatPhoneNumber } from '../../utils/phoneFormatter'
import './styles/footer.css'

const Footer = () => {
  const { contactData } = useSiteContext()

  return (
    <footer className="footer" id="contact">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Logo />
          </div>
          <p className="footer-description">
            {contactData?.site_description}
          </p>
          <div className="footer-socials">
            {contactData?.instagram && (
              <a href={contactData.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
            )}
            {contactData?.facebook && (
              <a href={contactData.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
            )}
            {contactData?.twitter && (
              <a href={contactData.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter size={20} />
              </a>
            )}
            {contactData?.youtube && (
              <a href={contactData.youtube} target="_blank" rel="noopener noreferrer">
                <FaYoutube size={20} />
              </a>
            )}
            {contactData?.linkedin && (
              <a href={contactData.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="footer-links">
          <h4>Hızlı Erişim</h4>
          <ul>
            <li><Link to="/rooms">Odalar</Link></li>
            <li><Link to="/restaurant">Restoran</Link></li>
            <li><Link to="/events">Organizasyon &amp; Düğün</Link></li>
            <li><Link to="/meetings">Toplantı &amp; Etkinlik</Link></li>
            <li><Link to="/contact">İletişim</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>İletişim</h4>
          <ul>
            <li>
              <MapPin size={20} />
              <span>{contactData?.address}</span>
            </li>
            {contactData?.accommodation_phone && (
              <li>
                <Phone size={20} />
                <span>{formatPhoneNumber(contactData.accommodation_phone)} (Konaklama)</span>
              </li>
            )}
            {contactData?.organization_phone && (
              <li>
                <Phone size={20} />
                <span>{formatPhoneNumber(contactData.organization_phone)} (Organizasyon)</span>
              </li>
            )}
            <li>
              <Mail size={20} />
              <span>{contactData?.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container container-bottom">
          <p>&copy; {new Date().getFullYear()} Ali Güven Anadolu Otelcilik Ve TML Uygulama Oteli. Tüm Hakları Saklıdır.</p>
          <div className="footer-legal">
            <Link to="/terms-and-privacy">Kullanım Koşulları ve Gizlilik Politikası</Link>
            <Link to="/cookie-policy">Çerez Politikası</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

