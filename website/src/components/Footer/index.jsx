import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Smartphone } from 'lucide-react'
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa'
import { fetchCompanyContacts } from '../../services/api'
import './styles/footer.css'

const Footer = () => {
  const [contactData, setContactData] = useState(null)

  useEffect(() => {
    const getContactData = async () => {
      try {
        const data = await fetchCompanyContacts()
        setContactData(data)
      } catch (error) {
        console.error('Footer contact data fetch error:', error)
      }
    }
    getContactData()
  }, [])

  return (
    <footer className="footer" id="contact">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-text">ALİ GÜVEN</span>
            <span className="logo-subtext">UYGULAMA OTELİ</span>
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
            {contactData?.landline_phone && (
              <li>
                <Phone size={20} />
                <span>{contactData.landline_phone}</span>
              </li>
            )}
            {contactData?.mobile_phone && (
              <li>
                <Smartphone size={20} />
                <span>{contactData.mobile_phone}</span>
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
            <a href="#">Gizlilik Politikası</a>
            <a href="#">KVKK</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

