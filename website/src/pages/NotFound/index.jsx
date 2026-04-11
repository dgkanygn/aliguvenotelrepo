import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './styles/notfound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-error">404</div>
        <div className="not-found-content">
          <h1 className="not-found-title">Sayfa Bulunamadı</h1>
          <p className="not-found-text">
            Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-rounded">
              <Home size={18} />
              Ana Sayfaya Dön
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-outline btn-rounded"
            >
              <ArrowLeft size={18} />
              Geri Git
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
