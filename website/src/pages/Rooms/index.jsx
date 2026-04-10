import { ArrowRight, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImageGallery from '../../components/ImageGallery'
import { useRooms } from './hooks/useRooms'
import './styles/rooms.css'

const Rooms = () => {
  const { data, loading, error } = useRooms();

  console.log(data)

  if (loading) return <div className="loading-state h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;

  const getRoomImages = (roomImages) => {
    if (!roomImages || !Array.isArray(roomImages)) return [];
    return roomImages
      .sort((a, b) => b.is_main - a.is_main) // main image first
      .map(img => img.image_url);
  };
  return (
    <section className="rooms-page">
      <div
        className="rooms-hero"
        style={{ backgroundImage: `url('${data?.page_banner?.image_url || '/images/hotel_room_1_1775384455722.png'}')` }}
      >
        <div className="container container-hero-rooms">
          <span className="section-subtitle">{data?.page_banner?.top_title || 'Konaklama'}</span>
          <h1 className="page-title">{data?.page_banner?.page_title || 'Oda ve Süitlerimiz'}</h1>
        </div>
      </div>

      <div className="container">
        <div className="rooms-list section-padding">
          {data?.rooms?.map((room, index) => {
            let features = [];
            try {
              features = Array.isArray(room.amenities) ? room.amenities : (room.amenities ? JSON.parse(room.amenities) : []);
            } catch (e) {
              console.error('Error parsing features: ' + e);
            }
            return (
              <div className={`room-row ${index % 2 !== 0 ? 'reverse' : ''}`} key={room.id || index}>
                <div className="room-image-box">
                  <ImageGallery
                    images={getRoomImages(room.images)}
                    galleryId={`room-${room.id}`}
                    isCompact={true}
                  />
                  <div className="room-badge">{room.title}</div>
                </div>
                <div className="room-text-box">
                  <h2 className="room-title">{room.title}</h2>
                  <p className="room-desc">{room.description}</p>
                  <div className="room-features-tags">
                    {features.map((f, i) => (
                      <span className="tag" key={i}>{f}</span>
                    ))}
                  </div>
                  <div className="room-actions mb-4 flex gap-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <Link
                      to={`/event-detail/rooms/${room.id}`}
                      className="btn btn-outline cursor-pointer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Info size={18} /> Detayları Gör
                    </Link>
                    <a
                      href="https://wa.me/902223300326"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary room-cta cursor-pointer"
                    >
                      Rezervasyon Yap <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Rooms
