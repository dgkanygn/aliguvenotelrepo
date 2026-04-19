import { useState, useEffect, useCallback, useRef } from 'react'
import { Users, Bed } from 'lucide-react'
import { useSiteContext } from '../../../../context/SiteContext'
import './styles/hero.css'

const Hero = ({ data = [] }) => {
  const { contactData } = useSiteContext()

  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef(null)

  const showSlide = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  const nextSlide = useCallback(() => {
    if (data.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % data.length)
  }, [data.length])

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(nextSlide, 5000)
  }, [nextSlide])

  useEffect(() => {
    startAutoPlay()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startAutoPlay])

  const handleIndicatorClick = (index) => {
    showSlide(index)
    startAutoPlay()
  }

  return (
    <div className="hero">
      <div className="hero-slider" id="hero-slider">
        {data.map((item, index) => (
          <div
            key={item.id || index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url('${item.image_url}')` }}
          />
        ))}
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: data[currentIndex]?.title || '' }}></h1>
          <p className="hero-subtitle">
            {data[currentIndex]?.description || ''}
          </p>

          <div className="hero-cta">
            <span className="hero-cta-info">Bizimle iletişime geçin</span>
            <a
              href={`https://wa.me/90${contactData?.accommodation_phone ? contactData.accommodation_phone.replace(/[^\d]/g, '') : '2223300326'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn cursor-pointer"
            >
              <Bed size={20} />
              Konaklama için
            </a>
            <a
              href={`https://wa.me/90${contactData?.organization_phone ? contactData.organization_phone.replace(/[^\d]/g, '') : '2223300326'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-secondary cursor-pointer"
            >
              <Users size={20} />
              Organizasyon için
            </a>
          </div>

          <div className="slide-indicators">
            {data.map((_, index) => (
              <button
                key={index}
                className={`indicator cursor-pointer ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleIndicatorClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
