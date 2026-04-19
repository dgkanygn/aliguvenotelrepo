import React from 'react';
import './styles/cookie-policy.css';

const CookiePolicy = () => {
  return (
    <div className="cookie-policy-page">
      {/* Banner */}
      <div className="policy-banner">
        <div className="policy-banner-decoration-1" />
        <div className="policy-banner-decoration-2" />
        <div className="policy-banner-content">
          <span className="policy-banner-tag">Yasal</span>
          <h1 className="policy-banner-title">Çerez (Cookie) Politikası</h1>
          <p className="policy-banner-subtitle">Ali Güven Anadolu Otelcilik ve TML Uygulama Oteli</p>
        </div>
      </div>

      <div className="policy-content-container">
        <div className="max-w-4xl mx-auto">
          {/* Giriş paragrafı */}
          <div className="policy-intro-box">
            <p>
              Ali Güven Anadolu Otelcilik ve TML Uygulama Oteli olarak, ziyaretçilerimize daha iyi bir
              kullanıcı deneyimi sunabilmek adına sitemizde sınırlı düzeyde çerez kullanmaktayız.
            </p>
          </div>

          <div className="policy-sections-list">
            {/* Bölüm 1 */}
            <section className="policy-section-item">
              <div className="policy-section-header">
                <span className="policy-section-number">1</span>
                <h2>Çerezlerin Kullanım Amacı</h2>
              </div>
              <p className="policy-section-text">
                Sitemizde kullanılan çerezler, sitenin performansını ölçmek (Google Analytics vb.) ve
                Google Haritalar gibi harici servislerin işlevselliğini sağlamak amacıyla kullanılmaktadır.
              </p>
            </section>

            {/* Bölüm 2 */}
            <section className="policy-section-item">
              <div className="policy-section-header">
                <span className="policy-section-number">2</span>
                <h2>Kullanılan Çerez Türleri</h2>
              </div>
              <div className="policy-types-grid">
                {[
                  { 
                    label: 'Zorunlu', 
                    type: 'required',
                    title: 'Zorunlu Çerezler', 
                    desc: 'Sitenin güvenli ve doğru çalışması için gerekli olan teknik çerezlerdir.' 
                  },
                  { 
                    label: 'İşlevsel', 
                    type: 'functional',
                    title: 'İşlevsel Çerezler', 
                    desc: 'Google Haritalar gibi üçüncü taraf servislerin içeriklerini görüntülemesini sağlar.' 
                  },
                ].map(({ label, type, title, desc }) => (
                  <div key={label} className="policy-type-card">
                    <span className={`type-badge ${type}`}>{label}</span>
                    <div className="type-info">
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bölüm 3 */}
            <section className="policy-section-item">
              <div className="policy-section-header">
                <span className="policy-section-number">3</span>
                <h2>Çerez Yönetimi</h2>
              </div>
              <p className="policy-section-text">
                Kullanıcılar, tarayıcı ayarlarından çerez kullanımını kısıtlama veya engelleme hakkına
                sahiptir. Çerezlerin engellenmesi durumunda harita servisinde aksaklıklar yaşanabilir.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
