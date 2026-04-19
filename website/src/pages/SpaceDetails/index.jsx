import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Info, MessageCircle, ArrowLeft, Users, Zap, Maximize2 } from 'lucide-react'
import ImageGallery from '../../components/ImageGallery'
import Loading from '../../components/Loading'
import { useSpaceDetails } from './hooks/useSpaceDetails'
import { useSiteContext } from '../../context/SiteContext'
import './styles/spaceDetails.css'

const SpaceDetails = () => {
    const { type, id } = useParams()
    const { data, loading, error } = useSpaceDetails(type, id)
    const { contactData } = useSiteContext()

    if (loading) return <Loading />;
    if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;

    const { space, images } = data
    const mainImage = images.find(img => img.is_main)?.image_url || images[0]?.image_url || '/images/saloon_1.jpg'
    const galleryImages = images.map(img => img.image_url)

    let amenities = []
    try {
        if (Array.isArray(space.amenities)) {
            amenities = space.amenities;
        } else {
            amenities = space.amenities ? JSON.parse(space.amenities) : [];
        }
    } catch (e) {
        console.error('Amenities parsing error:', e)
    }

    // Extract capacity from title if possible
    const capacityMatch = space.title.match(/(\d+)/)
    const capacity = capacityMatch ? capacityMatch[1] : 'Değişken'

    return (
        <div className="space-details-page">
            <div
                className="space-hero"
                style={{ backgroundImage: `url('${mainImage}')` }}
            >
                <div className="container space-hero-content">
                    <Link to={type === 'rooms' ? '/rooms' : '/events'} className="btn btn-outline mb-4 cursor-pointer" style={{ color: 'white', borderColor: 'white' }}>
                        <ArrowLeft size={18} /> Geri Dön
                    </Link>
                    <h1 className="page-title">{space.title}</h1>
                </div>
            </div>

            <div className="container">
                <div className="space-main-content">
                    <div className="space-left">
                        <div className="space-info-box">
                            {/* <div className="dynamic-stats">
                <div className="stat-item">
                  <span className="stat-value"><Users size={20} /> {capacity}</span>
                  <span className="stat-label">Kapasite</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value"><Maximize2 size={20} /> Geniş</span>
                  <span className="stat-label">Alan</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value"><Zap size={20} /> Tam</span>
                  <span className="stat-label">Donanım</span>
                </div>
              </div> */}

                            <h2 className="space-title">{space.title}</h2>
                            <p className="space-description">
                                {space.description}
                            </p>

                            <div className="amenities-section">
                                <h3><Info size={22} /> Öne Çıkan Özellikler</h3>
                                <div className="amenities-grid">
                                    {amenities.map((item, idx) => (
                                        <div key={idx} className="amenity-item">
                                            <CheckCircle size={18} />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                    {amenities.length === 0 && (
                                        <p style={{ color: 'var(--text-muted)' }}>Bu alan için özellik belirtilmemiş.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="gallery-section">
                            <h2>Detaylı Görseller</h2>
                            <ImageGallery images={galleryImages} galleryId={`space-gallery-${id}`} />
                        </div>
                    </div>

                    <aside className="space-sidebar">
                        <div className="booking-card">
                            <h3>Rezervasyon & Bilgi</h3>
                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Bu alan için özel fiyat teklifi almak ve müsaitlik durumunu sorgulamak için iletişime geçin.
                            </p>

                            {/* <div className="quick-info-list">
                                <div className="quick-info-item">
                                    <span>Maks. Kapasite</span>
                                    <span>{capacity} Kişi</span>
                                </div>
                                <div className="quick-info-item">
                                    <span>Mutfak Hizmeti</span>
                                    <span>Mevcut</span>
                                </div>
                                <div className="quick-info-item">
                                    <span>Ses Sistemi</span>
                                    <span>Profesyonel</span>
                                </div>
                            </div> */}

                            <a
                                href={`https://wa.me/90${(type === 'rooms' ? contactData?.accommodation_phone : contactData?.organization_phone)?.replace(/[^\d]/g, '') || contactData?.whatsapp_number?.replace(/[^\d]/g, '') || '2223300326'}?text=${encodeURIComponent(`${space.title} hakkında bilgi almak istiyorum.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary cursor-pointer"
                            >
                                <MessageCircle size={20} /> Hemen Bilgi Al
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default SpaceDetails