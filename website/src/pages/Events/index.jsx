import { useState, useCallback } from 'react'
import { PlayCircle, MessageCircle, Sun, Zap, Maximize, CheckCircle } from 'lucide-react'
import ImageGallery from '../../components/ImageGallery'
import { useEvents } from './hooks/useEvents'
import './styles/events.css'

const Events = () => {
  const { data, loading, error } = useEvents()
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState('')
  const openModal = useCallback((videoId) => {
    if (videoId) {
        setCurrentVideoId(videoId)
        setVideoModalOpen(true)
        document.body.style.overflow = 'hidden'
    }
  }, [])

  const closeModal = useCallback(() => {
    setVideoModalOpen(false)
    document.body.style.overflow = 'auto'
  }, [])

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) return <div className="loading-state h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;

  const images = data?.event_images?.map(img => img.image_url) || [];

  return (
    <section className="events-page">
      <div
        className="events-hero"
        style={{ backgroundImage: `url('${data?.banner?.image_url || '/images/saloon_1.jpg'}')` }}
      >
        <div className="container container-hero-events">
          <span className="section-subtitle">{data?.banner?.top_title || 'Organizasyon'}</span>
          <h1 className="page-title">{data?.banner?.page_title || 'Düğün & Davet'}</h1>
        </div>
      </div>

      <div className="container">
        <div className="events-intro section-padding">
          <div className="intro-box">
            <p className="intro-description text-center">
              {data?.event_space?.[0]?.intro_text || 'Organizasyon detayları bulunamadı.'}
            </p>
            <div className="intro-actions">
              {data?.event_space?.[0]?.video_url && (
              <button 
                className="btn btn-outline video-trigger cursor-pointer" 
                onClick={() => openModal(getYoutubeId(data.event_space[0].video_url))}
              >
                <PlayCircle size={20} />
                Tanıtım Videosu
              </button>
              )}
              <a
                href="https://wa.me/902223300326"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary cursor-pointer"
              >
                <MessageCircle size={20} />
                İletişime Geç
              </a>
            </div>
          </div>
        </div>

        <div className="saloon-types">
          {data?.event_space?.map((saloon, index) => {
            let features = [];
            try {
              features = saloon.amenities ? JSON.parse(saloon.amenities) : [];
            } catch(e) {
               console.error('Error parsing features: ' + e);
            }
            return (
          <div className={`saloon-item alternate ${index % 2 !== 0 ? 'reverse' : ''}`} key={saloon.id || index}>
            <div className="saloon-image">
              <img src={images[index % images.length] || '/images/saloon_2.jpg'} alt={saloon.title} />
            </div>
            <div className="saloon-content">
              <h2 className="saloon-title">{saloon.title}</h2>
              <p className="saloon-text">
                {saloon.description}
              </p>
              <ul className="saloon-features">
                {features.map((f, i) => (
                    <li key={i}><CheckCircle size={18} /> {f}</li>
                ))}
              </ul>
            </div>
          </div>
            )
          })}
        </div>

        {/* Reusable Gallery */}
        <div className="events-gallery-wrapper section-padding">
          <h2 className="section-title text-center mb-4">Organizasyonlarımızdan Kareler</h2>
          <ImageGallery images={images} galleryId="events-gallery" />
        </div>
      </div>

      {/* Video Modal */}
      <div className={`video-modal ${videoModalOpen ? 'active' : ''}`}>
        <div className="video-modal-overlay" onClick={closeModal} />
        <div className="video-modal-content">
          <button className="video-modal-close cursor-pointer" onClick={closeModal}>&times;</button>
          <div className="video-responsive-container">
            {videoModalOpen && currentVideoId && (
              <iframe
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Tanıtım Videosu"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Events
