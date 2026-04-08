import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import './styles/footer.css'

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-text">ALİ GÜVEN</span>
            <span className="logo-subtext">UYGULAMA OTELİ</span>
          </div>
          <p className="footer-description">
            Geleceğin turizmcilerinin yetiştiği, profesyonel hizmet anlayışıyla
            misafirlerini ağırlayan Eskişehir&apos;in öncü uygulama oteli.
          </p>
        </div>

        <div className="footer-links">
          <h4>Hızlı Erişim</h4>
          <ul>
            <li><Link to="/rooms">Odalar</Link></li>
            <li><Link to="/restaurant">Restoran</Link></li>
            <li><Link to="/events">Organizasyon &amp; Düğün</Link></li>
            <li><Link to="/contact">İletişim</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>İletişim</h4>
          <ul>
            <li>
              <MapPin size={20} />
              <span>S, Uluönder, Şht. Rüstem Demirbaş Sk No:8, <br /> 26190 Tepebaşı/Eskişehir</span>
            </li>
            <li>
              <Phone size={20} />
              <span>(0222) 330 03 26</span>
            </li>
            <li>
              <Mail size={20} />
              <span>bilgi@aliguvenotel.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container container-bottom">
          <p>&copy; 2026 Ali Güven Anadolu Otelcilik Ve TML Uygulama Oteli. Tüm Hakları Saklıdır.</p>
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
