import { useMeetings } from './hooks/useMeetings'
import SaloonItem from '../Events/components/SaloonItem'
import PageBanner from '../../components/PageBanner'
import Loading from '../../components/Loading'
import '../Events/styles/events.css'

const Meetings = () => {
  const { data, loading, error } = useMeetings()

  if (loading) return <Loading />;
  if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;


  console.log(data?.page_banner?.image_url)

  return (
    <section className="events-page">
      <PageBanner
        image={data?.page_banner?.image_url}
        defaultImage="/images/meeting_room.jpg"
        topTitle={data?.page_banner?.top_title || 'Kurumsal'}
        pageTitle={data?.page_banner?.page_title || 'Toplantı & Etkinlik'}
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

export default Meetings
