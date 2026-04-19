import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useCookieBanner } from './hooks/useCookieBanner';
import './styles/cookie-banner.css';

const CookieBanner = () => {
  const { isVisible, acceptCookies } = useCookieBanner();

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-wrapper">
      <div className="cookie-banner-content">
        <div className="cookie-banner-icon">
          <Clock size={24} />
        </div>

        <div className="cookie-banner-text">
          <p>
            Sitemizi kullanarak{' '}
            <Link to="/terms-and-privacy" className="cookie-banner-link">
              Kullanım Koşulları ve Gizlilik Politikamızı
            </Link>{' '}kabul etmiş sayılırsınız.{' '}
            <Link to="/cookie-policy" className="cookie-banner-link">
              Çerez Politikamızı
            </Link>{' '}inceleyebilirsiniz.
          </p>
        </div>

        <div className="cookie-banner-action">
          <button
            onClick={acceptCookies}
            className="cookie-banner-btn"
          >
            Anladım, Kabul Ediyorum
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
