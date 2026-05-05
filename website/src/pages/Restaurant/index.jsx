import { Clock, FileText } from 'lucide-react'
import ImageGallery from '../../components/ImageGallery'
import PageBanner from '../../components/PageBanner'
import Loading from '../../components/Loading'
import MenuCard from './components/MenuCard'
import { useRestaurant } from './hooks/useRestaurant'
import './styles/restaurant.css'

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

            {(() => {
              const menu1Url = typeof info?.menu_pdf_url === 'object' ? info.menu_pdf_url?.url : info?.menu_pdf_url;
              const menu1Title = typeof info?.menu_pdf_url === 'object' ? info.menu_pdf_url?.title : '';
              const menu2Url = typeof info?.menu_pdf_url_2 === 'object' ? info.menu_pdf_url_2?.url : info?.menu_pdf_url_2;
              const menu2Title = typeof info?.menu_pdf_url_2 === 'object' ? info.menu_pdf_url_2?.title : '';

              return (
                <>
                  {menu1Url && (
                    <div className="flex justify-center">
                      <a
                        href={menu1Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="menu-btn btn btn-primary btn-lg cursor-pointer flex items-center gap-3 px-8 py-4 text-lg"
                      >
                        <FileText size={24} />
                        <span>{menu1Title || 'Menüyü İncele'}</span>
                      </a>
                    </div>
                  )}
                  {menu2Url && (
                    <div className="flex justify-center" style={{ marginTop: '1rem' }}>
                      <a
                        href={menu2Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="menu-btn btn btn-primary btn-lg cursor-pointer flex items-center gap-3 px-8 py-4 text-lg"
                      >
                        <FileText size={24} />
                        <span>{menu2Title || 'Menüyü İncele'}</span>
                      </a>
                    </div>
                  )}
                </>
              );
            })()}

            {info?.warning_text && (
              <div className="service-notice">
                <Clock size={24} />
                <span>{info.warning_text}</span>
              </div>
            )}
          </div>
        </div>

        <div className="menus-section">
          <MenuCard menu={sampleMenu} />
        </div>

        {/* Reusable Gallery */}
        <div className="restaurant-gallery-wrapper section-padding">
          <h2 className="section-title text-center mb-4">Restoranımızdan Kareler</h2>
          <ImageGallery images={images} galleryId="restaurant-gallery" />
        </div>
      </div>
    </section>
  )
}

export default Restaurant
