import { useState, useEffect, useCallback, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import './styles/hero.css'

const Hero = ({ data = [] }) => {

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
            <a
              href="https://wa.me/902223300326"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary hero-btn cursor-pointer"
            >
              <MessageCircle size={20} />
              WhatsApp Rezervasyon
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
