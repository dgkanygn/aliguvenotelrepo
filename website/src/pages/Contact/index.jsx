import { MapPin, Phone, Smartphone, Mail, Printer, MessageCircle } from 'lucide-react'
import PageBanner from '../../components/PageBanner'
import Loading from '../../components/Loading'
import { useContact } from './hooks/useContact'
import { formatPhoneNumber } from '../../utils/phoneFormatter'
import './styles/contact.css'

const Contact = () => {
  const { data, loading, error } = useContact();

  if (loading) return <Loading />;
  if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;

  const info = data?.company_contacts;

  return (
    <section className="contact-page">
      <PageBanner
        image={data?.page_banner?.image_url}
        defaultImage="/images/room_1.jpg"
        topTitle={data?.page_banner?.top_title || 'Bize Ulaşın'}
        pageTitle={data?.page_banner?.page_title || 'İletişim'}
      />

      <div className="container section-padding">
        <div className="contact-grid">
          {/* Contact Info Card */}
          <div className="contact-card">
            <h2 className="contact-subtitle">İletişim Bilgileri</h2>
            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-text">
                  <h4>Adres</h4>
                  <p>{info?.address || 'Adres bilgisi bulunamadı.'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Phone size={20} />
                </div>
                <div className="info-text">
                  <h4>Sabit Telefon</h4>
                  <p><a href={`tel:${info?.landline_phone?.replace(/[^\d+]/g, '')}`}>{info?.landline_phone}</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Smartphone size={20} />
                </div>
                <div className="info-text">
                  <h4>Mobil Telefon</h4>
                  <p><a href={`tel:${info?.mobile_phone?.replace(/[^\d+]/g, '')}`}>{formatPhoneNumber(info?.mobile_phone)}</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Mail size={20} />
                </div>
                <div className="info-text">
                  <h4>E-Posta</h4>
                  <p><a href={`mailto:${info?.email}`}>{info?.email}</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Printer size={20} />
                </div>
                <div className="info-text">
                  <h4>Fax</h4>
                  <p>{info?.fax}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="contact-map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d911.4769671778371!2d30.4794743613711!3d39.78835108088768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cc142a99e8e47f%3A0x4502e72c0a86276a!2sAli%20G%C3%BCven%20Anadolu%20Otelcilik%20Ve%20Tml%20Uygulama%20Oteli!5e0!3m2!1str!2str!4v1776557475658!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ali Güven Uygulama Oteli Konum"
            />
          </div>
        </div>

        {/* Stylish CTA Box */}
        <div className="contact-cta-section">
          <div className="cta-stylish-box">
            <h2>Bizimle İletişime Geçin</h2>
            <p>Tüm konaklama ve organizasyon talepleriniz için bize WhatsApp üzerinden anında ulaşabilirsiniz. Profesyonel ekibimiz size en kısa sürede dönüş yapacaktır.</p>

            <div className="cta-buttons-grid">
              <a
                href={`https://wa.me/90${info?.accommodation_phone ? info.accommodation_phone.replace(/[^\d]/g, '') : '2223300326'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary whatsapp-cta-btn cursor-pointer"
              >
                <div className="cta-btn-icon">
                  <MessageCircle size={24} />
                </div>
                <div className="cta-btn-text">
                  <span className="cta-label">Konaklama İçin</span>
                  <span className="cta-value">{formatPhoneNumber(info?.accommodation_phone) || 'WhatsApp Destek'}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/90${info?.organization_phone ? info.organization_phone.replace(/[^\d]/g, '') : '2223300326'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary-outline whatsapp-cta-btn organization cursor-pointer"
              >
                <div className="cta-btn-icon">
                  <MessageCircle size={24} />
                </div>
                <div className="cta-btn-text">
                  <span className="cta-label">Organizasyon İçin</span>
                  <span className="cta-value">{formatPhoneNumber(info?.organization_phone) || 'WhatsApp Destek'}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
