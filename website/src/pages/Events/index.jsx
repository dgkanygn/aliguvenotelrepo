import { useEvents } from './hooks/useEvents'
import SaloonItem from './components/SaloonItem'
import './styles/events.css'

const Events = () => {
  const { data, loading, error } = useEvents()

  if (loading) return <div className="loading-state h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;

  return (
    <section className="events-page">
      <div
        className="events-hero"
        style={{ backgroundImage: `url('${data?.page_banner?.image_url || '/images/saloon_1.jpg'}')` }}
      >
        <div className="container container-hero-events">
          <span className="section-subtitle">{data?.page_banner?.top_title || 'Organizasyon'}</span>
          <h1 className="page-title">{data?.page_banner?.page_title || 'Düğün & Davet'}</h1>
        </div>
      </div>

      <div className="container">
        <div className="saloon-types section-padding">
          {data?.saloons?.map((saloon, index) => (
            <SaloonItem
              key={saloon.id}
              saloon={saloon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Events
