import { useMeetings } from './hooks/useMeetings'
import SaloonItem from '../Events/components/SaloonItem'
import '../Events/styles/events.css'

const Meetings = () => {
  const { data, loading, error } = useMeetings()

  if (loading) return <div className="loading-state h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;


  console.log(data?.page_banner?.image_url)

  return (
    <section className="events-page">
      <div
        className="events-hero"
        style={{ backgroundImage: `url('${data?.page_banner?.image_url || '/images/meeting_room.jpg'}')` }}
      >
        <div className="container container-hero-events">
          <span className="section-subtitle">{data?.page_banner?.top_title || 'Kurumsal'}</span>
          <h1 className="page-title">{data?.page_banner?.page_title || 'Toplantı & Etkinlik'}</h1>
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

export default Meetings
