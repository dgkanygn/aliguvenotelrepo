import { CheckCircle, ArrowRight, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImageGallery from '../../../../components/ImageGallery'

const SaloonItem = ({ saloon, index }) => {
  let features = [];
  try {
    features = Array.isArray(saloon.amenities) ? saloon.amenities : (saloon.amenities ? JSON.parse(saloon.amenities) : []);
  } catch (e) {
    console.error('Error parsing features: ' + e);
  }

  const saloonImages = Array.isArray(saloon.images)
    ? saloon.images
        .sort((a, b) => b.is_main - a.is_main)
        .map(img => img.image_url)
    : [];

  return (
    <div className={`saloon-item alternate ${index % 2 !== 0 ? 'reverse' : ''}`}>
      <div className="saloon-image">
        <ImageGallery 
          images={saloonImages} 
          galleryId={`saloon-${saloon.id}`} 
          isCompact={true}
        />
      </div>
      <div className="saloon-content">
        <h2 className="saloon-title">{saloon.title}</h2>
        <p className="saloon-text">
          {saloon.description}
        </p>
        
        {features.length > 0 && (
          <ul className="saloon-features mb-4" style={{ marginBottom: '2rem' }}>
            {features.map((f, i) => (
              <li key={i}><CheckCircle size={18} /> {f}</li>
            ))}
          </ul>
        )}

        <div className="saloon-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link 
            to={`/event-detail/saloons/${saloon.id}`}
            className="btn btn-outline cursor-pointer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Info size={18} /> Detayları Gör
          </Link>
          <a 
            href="https://wa.me/902223300326" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary cursor-pointer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Rezervasyon Yap <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};


export default SaloonItem;

