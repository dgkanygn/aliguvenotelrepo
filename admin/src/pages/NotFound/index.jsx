import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';
import './styles/notfound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-error">404</div>
        <div className="not-found-content">
          <h1 className="not-found-title">Sayfa Bulunamadı</h1>
          <p className="not-found-text">
            Aradığınız yönetim sayfası mevcut değil veya taşınmış olabilir.
          </p>
          <div className="not-found-actions">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="btn-admin btn-admin-primary"
            >
              <LayoutDashboard size={18} />
              Panele Dön
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="btn-admin btn-admin-outline"
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
