import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import './styles/experience.css'

const Experience = ({ data }) => {
  if (!data) return null;

  return (
    <section className="experience section-padding" id="rooms">
      <div className="container experience-container">
        <div className="experience-image">
          <img src={data.image_url} alt={data.title} />
          <div className="experience-stats">
            <div className="exp-stat-item">
              <span className="exp-val">4+</span>
              <span className="exp-label">Yıldız Memnuniyet</span>
            </div>
            <div className="exp-stat-item">
              <span className="exp-val">7/24</span>
              <span className="exp-label">Resepsiyon</span>
            </div>
          </div>
        </div>

        <div className="experience-content">
          <span className="section-subtitle">{data.tagline}</span>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: data.title }}></h2>
          <p className="experience-text">
            {data.summary}
          </p>
          <ul className="experience-features">
            {data.feature_list?.map((feature, index) => (
              <li key={index}><CheckCircle size={18} /> {feature}</li>
            ))}
          </ul>
          <Link to="/rooms" className="btn btn-primary cursor-pointer">
            Oda Seçeneklerini Gör
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Experience
