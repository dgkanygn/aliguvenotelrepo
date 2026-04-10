import { Clock } from 'lucide-react'
import ImageGallery from '../../components/ImageGallery'
import { useRestaurant } from './hooks/useRestaurant'
import './styles/restaurant.css'

const Restaurant = () => {
  const { data, loading, error } = useRestaurant();

  if (loading) return <div className="loading-state h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;

  const info = data?.restaurant_info;
  const images = data?.restaurant_images?.map(img => img.image_url) || [];

  return (
    <section className="restaurant-page">
      <div
        className="restaurant-hero"
        style={{ backgroundImage: `url('${data?.page_banner?.image_url || '/images/restaurant.jpg'}')` }}
      >
        <div className="container container-hero-restaurant">
          <span className="section-subtitle">{data?.page_banner?.top_title || 'Gastronomi'}</span>
          <h1 className="page-title">{data?.page_banner?.page_title || 'Restoranımız'}</h1>
        </div>
      </div>

      <div className="container">
        <div className="restaurant-intro section-padding">
          <div className="intro-content">
            <p className="intro-text">
              {info?.intro_text || 'Bilgi bulunamadı.'}
            </p>
            {info?.warning_text && (
            <div className="service-notice">
              <Clock size={24} />
              <span>{info.warning_text}</span>
            </div>
            )}
          </div>
        </div>

        <div className="menus-section">
          {info?.menu_pdf_url && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <a 
                href={info.menu_pdf_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary cursor-pointer"
              >
                Menüyü İncele (PDF)
              </a>
            </div>
          )}
          <div className="menu-grid">
            {/* Öğle Yemeği */}
            <div className="menu-card">
              <h2 className="menu-title">Öğle Yemeği Menüsü</h2>
              <div className="pricing-table-wrapper">
                <table className="pricing-table">
                  <thead>
                    <tr>
                      <th>Günün Menüsü</th>
                      <th>Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Süzme Mercimek Çorbası</td><td>0₺</td></tr>
                    <tr><td>Tas Kebabı &amp; Pilav</td><td>0₺</td></tr>
                    <tr><td>Mevsim Salatası</td><td>0₺</td></tr>
                    <tr><td>Fırın Sütlaç</td><td>0₺</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Akşam Yemeği */}
            <div className="menu-card">
              <h2 className="menu-title">Akşam Yemeği Menüsü</h2>
              <div className="pricing-table-wrapper">
                <table className="pricing-table">
                  <thead>
                    <tr>
                      <th>Özel Davet Menüsü</th>
                      <th>Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Yayla Çorbası</td><td>0₺</td></tr>
                    <tr><td>Hünkar Beğendi</td><td>0₺</td></tr>
                    <tr><td>Meyhane Pilavı</td><td>0₺</td></tr>
                    <tr><td>Ev Yapımı Baklava</td><td>0₺</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Reusable Gallery */}
        <div className="restaurant-gallery-wrapper section-padding">
          <h2 className="section-title text-center mb-4">Mekanımızdan Kareler</h2>
          <ImageGallery images={images} galleryId="restaurant-gallery" />
        </div>
      </div>
    </section>
  )
}

export default Restaurant
