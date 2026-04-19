import React from 'react';
import './styles/terms-and-privacy.css';

const TermsAndPrivacy = () => {
  const sections = [
    { 
      n: 1, 
      title: 'Genel Bilgilendirme', 
      text: 'Bu web sitesi Ali Güven Anadolu Otelcilik ve TML Uygulama Oteli (bundan sonra "Kurum" olarak anılacaktır) tarafından bilgilendirme amacıyla işletilmektedir. Siteyi ziyaret ederek bu sayfadaki şartları kabul etmiş sayılırsınız.' 
    },
    { 
      n: 2, 
      title: 'İçerik ve Sorumluluk Reddi', 
      text: 'Web sitemizde yer alan oda bilgileri, konaklama ücretleri, görseller ve tesis imkanları bilgilendirme amaçlıdır. Kurum, hizmet standartları ve MEB yönetmelikleri çerçevesinde sitedeki bilgileri önceden haber vermeksizin değiştirme hakkını saklı tutar. Konaklama öncesi güncel bilgiler için kurum yönetimi ile iletişime geçilmesi esastır.' 
    },
    { 
      n: 3, 
      title: 'Kişisel Veriler ve WhatsApp Yönlendirmesi', 
      text: 'Sitemizde doğrudan veri toplama formu veya üyelik sistemi bulunmamaktadır. WhatsApp butonuna tıklayarak iletişime geçtiğinizde, paylaştığınız kişisel veriler (telefon numarası, isim vb.) yalnızca rezervasyon taleplerinizi yanıtlamak amacıyla kullanılır. Verileriniz, 6698 sayılı KVKK uyarınca korunmaktadır.' 
    },
    { 
      n: 4, 
      title: 'Telif Hakları', 
      text: 'Sitede yer alan ve kuruma ait olan tüm fotoğraf, logo ve metinlerin fikri mülkiyet hakları Ali Güven Anadolu Otelcilik ve TML Uygulama Oteli’ne aittir. İzinsiz kullanımı yasal işleme tabidir.' 
    },
    { 
      n: 5, 
      title: 'Dış Bağlantılar', 
      text: 'Sitemizde yer alan Google Haritalar (Maps) veya harici sosyal medya linkleri üzerinden ulaşılan platformların gizlilik politikalarından Kurumumuz sorumlu değildir.' 
    }
  ];

  return (
    <div className="terms-and-privacy-page">
      {/* Banner */}
      <div className="legal-banner">
        <div className="legal-banner-decoration-1" />
        <div className="legal-banner-decoration-2" />
        <div className="legal-banner-content">
          <span className="legal-banner-tag">Yasal</span>
          <h1 className="legal-banner-title">
            Kullanım Koşulları ve Gizlilik Politikası
          </h1>
          <p className="legal-banner-subtitle">Ali Güven Anadolu Otelcilik ve TML Uygulama Oteli</p>
        </div>
      </div>

      {/* İçerik */}
      <div className="legal-content-container">
        <div className="legal-sections-list">
          {sections.map(({ n, title, text }) => (
            <section key={n} className="legal-section-item">
              <div className="legal-section-header">
                <span className="legal-section-number">
                  {n}
                </span>
                <h2>{title}</h2>
              </div>
              <p className="legal-section-text">{text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
