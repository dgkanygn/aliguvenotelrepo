import { CheckCircle } from 'lucide-react'
import './styles/experience.css'

const Experience = () => {
  return (
    <section className="experience section-padding" id="rooms">
      <div className="container experience-container">
        <div className="experience-image">
          <img src="/images/hotel_room_1_1775384455722.png" alt="Konaklama Deneyimi" />
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
          <span className="section-subtitle">Konaklama</span>
          <h2 className="section-title">Evinizdeki Rahatlığı <br /> Keşfedin</h2>
          <p className="experience-text">
            Ali Güven Uygulama Oteli olarak, misafirlerimize modern ve huzurlu bir konaklama deneyimi sunuyoruz.
            Öğrencilerimizin taze enerjisi ve profesyonel eğitmenlerimizin gözetiminde,
            her detayın titizlikle düşünüldüğü odalarımızda kendinizi evinizde hissedeceksiniz.
          </p>
          <ul className="experience-features">
            <li><CheckCircle size={18} /> Modern &amp; Ferah Oda Tasarımı</li>
            <li><CheckCircle size={18} /> Yüksek Hızlı Ücretsiz Wi-Fi</li>
          </ul>
          <a href="https://wa.me/902223300326" className="btn btn-primary cursor-pointer">
            Oda Seçeneklerini Gör
          </a>
        </div>
      </div>
    </section>
  )
}

export default Experience
