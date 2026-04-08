import { MessageCircle } from 'lucide-react'
import ImageGallery from '../../components/ImageGallery'
import './styles/room-detail.css'

const IMAGES = [
  '/images/thumb_1.jpg',
  '/images/thumb_2.jpg',
  '/images/thumb_3.jpg'
]

const RoomDetail = () => {
  return (
    <section className="room-detail-page">
      <div
        className="room-detail-hero"
        style={{ backgroundImage: "url('/images/room_1.jpg')" }}
      >
        <div className="container container-hero-room-detail">
          <span className="section-subtitle">Oda Detayı</span>
          <h1 className="page-title">Konforlu Konaklama</h1>
        </div>
      </div>

      <div className="container room-detail-container">
        <div className="room-detail-header section-padding">
          <div className="room-intro-box">
            <p className="room-detail-description">
              Suit odalarımız misafirlerimizin ihtiyaçlarını karşılayan konforda döşenmiş olup
              evinizde ki rahatlığı bulmanız amaçlanmıştır. Suit odalarımız, Tek Kişilik ve Çift Kişilik
              kapasitelere sahiptir ve İsteğe bağlı olarak ilgili odalara ek yatak eklenebilmektedir.
            </p>
            <div className="room-detail-cta">
              <a
                href="https://wa.me/902223300326"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary reservation-btn cursor-pointer"
              >
                <MessageCircle size={20} />
                Hemen Rezervasyon Yap
              </a>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="pricing-table-wrapper">
          <table className="pricing-table room-pricing">
            <thead>
              <tr>
                <th>Tek Kişilik</th>
                <th>Çift Kişilik</th>
                <th>Ek Yatak</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0₺</td>
                <td>0₺</td>
                <td>0₺</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reusable Gallery */}
        <ImageGallery images={IMAGES} galleryId="room-detail-gallery" />
      </div>
    </section>
  )
}

export default RoomDetail
