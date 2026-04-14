import { Utensils, Heart, ArrowRight } from 'lucide-react'
import { BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import './styles/services.css'

const SERVICES = [
  {
    title: 'Restoran',
    description: 'Zarif bir atmosferde, usta şeflerimizin elinden çıkan geleneksel ve modern lezzetler.',
    image: '/images/hotel_restaurant_1_1775384478777.png',
    Icon: Utensils,
    link: '/restaurant'
  },
  {
    title: 'Toplantı & Etkinlik',
    description: 'Profesyonel altyapımızla iş toplantılarınız ve kurumsal etkinlikleriniz için ideal çözümler.',
    image: '/images/hotel_meeting.png',
    Icon: BarChart3,
    link: '/meetings'
  },
  {
    title: 'Organizasyon & Düğün',
    description: 'En özel günlerinizde, hayallerinizdeki organizasyonu kusursuz bir şekilde gerçekleştiriyoruz.',
    image: '/images/hotel_ballroom_1_1775384517311_copy_1775384497629.png',
    Icon: Heart,
    link: '/events'
  }
]

const Services = () => {
  return (
    <section className="services section-padding" id="services">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Hizmetlerimiz</span>
          <h2 className="section-title">Ayrıcalıklı Bir Deneyim</h2>
        </div>

        <div className="services-grid">
          {SERVICES.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-image">
                <img src={service.image} alt={service.title} />
                <div className="service-overlay">
                  <div className="service-icon">
                    <service.Icon size={32} />
                  </div>
                </div>
              </div>
              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to={service.link} className="service-link cursor-pointer">
                  Detaylı Bilgi <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
