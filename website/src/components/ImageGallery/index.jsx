import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './styles/image-gallery.css'

const ImageGallery = ({ images = [], galleryId = 'default-gallery', isCompact = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState('')

  const totalSlides = images.length

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalSlides)
  }, [totalSlides])

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const openLightbox = useCallback((src) => {
    setLightboxSrc(src)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    document.body.style.overflow = 'auto'
  }, [])

  return (
    <div className={`image-gallery-component ${isCompact ? 'compact' : ''}`} id={galleryId}>
      <div className="gallery-slider-wrapper">
        <div className="gallery-slider-viewport">
          <div
            className="gallery-slides-container"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img, index) => (
              <div className="gallery-slide-item" key={index}>
                <img
                  src={img}
                  alt={`Görsel ${index + 1}`}
                  className="gallery-trigger cursor-pointer"
                  onClick={() => openLightbox(img)}
                />
              </div>
            ))}
          </div>

          <div className="gallery-controls">
            <button className="gallery-arrow prev-btn cursor-pointer" onClick={prev}>
              <ChevronLeft size={24} />
            </button>
            <button className="gallery-arrow next-btn cursor-pointer" onClick={next}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <div
        className={`gallery-lightbox ${lightboxOpen ? 'active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox()
        }}
      >
        <button className="lightbox-x cursor-pointer" onClick={closeLightbox}>&times;</button>
        <div className="lightbox-inner">
          <img src={lightboxSrc} alt="Full Screen" className="lightbox-display-img" />
        </div>
      </div>
    </div>
  )
}

export default ImageGallery
