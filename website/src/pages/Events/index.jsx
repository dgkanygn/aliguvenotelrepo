import { useEvents } from './hooks/useEvents'
import SaloonItem from './components/SaloonItem'
import PageBanner from '../../components/PageBanner'
import './styles/events.css'

const Events = () => {
  const { data, loading, error } = useEvents()

  if (loading) return <div className="loading-state h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;

  return (
    <section className="events-page">
      <PageBanner
        image={data?.page_banner?.image_url}
        defaultImage="/images/saloon_1.jpg"
        topTitle={data?.page_banner?.top_title || 'Organizasyon'}
        pageTitle={data?.page_banner?.page_title || 'Düğün & Davet'}
      />

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
