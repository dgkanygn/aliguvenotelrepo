import { Clock } from 'lucide-react'
import ImageGallery from '../../components/ImageGallery'
import PageBanner from '../../components/PageBanner'
import Loading from '../../components/Loading'
import { useRestaurant } from './hooks/useRestaurant'
import './styles/restaurant.css'

const MenuCard = ({ menu }) => {
  if (!menu) return null;

  return (
    <div className="menu-card single-menu">
      <h2 className="menu-title">{menu.title || menu.baslik || 'Günün Menüsü'}</h2>
      <div className="pricing-table-wrapper">
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Yemekler</th>
            </tr>
          </thead>
          <tbody>
            {(menu.dishes || menu.yemekler || [])?.map((yemek, index) => (
              <tr key={index}>
                <td>{yemek}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="menu-footer">
        <div className="menu-price">
          <span>Menü Fiyatı:</span>
          <strong>{menu.price || menu.fiyat}</strong>
        </div>
        <p className="menu-note">Fiyatlarımıza KDV dahildir.</p>
      </div>
    </div>
  )
}

const Restaurant = () => {
  const { data, sampleMenu, loading, error } = useRestaurant()



  if (loading) return <Loading />
  if (error)
    return (
      <div className="error-state h-screen flex items-center justify-center">
        Hata: {error}
      </div>
    )

  const info = data?.restaurant_info
  const images = data?.restaurant_images?.map((img) => img.image_url) || []

  return (
    <section className="restaurant-page">
      <PageBanner
        image={data?.page_banner?.image_url}
        defaultImage="/images/restaurant.jpg"
        topTitle={data?.page_banner?.top_title || 'Gastronomi'}
        pageTitle={data?.page_banner?.page_title || 'Restoranımız'}
      />

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
          <MenuCard menu={sampleMenu} />
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
