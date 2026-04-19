import React from 'react';
import './styles/menu-card.css';

const MenuCard = ({ menu }) => {
  if (!menu) return null;

  return (
    <div className="compact-menu-card">
      <div className="menu-header">
        <h3 className="menu-title">{menu.title || menu.baslik || 'Günün Menüsü'}</h3>
        <div className="menu-badge">Örnek Yemek Menüsü</div>
      </div>

      <div className="menu-dishes">
        {(menu.dishes || menu.yemekler || [])?.map((yemek, index) => (
          <div key={index} className="dish-item">
            <span className="dot" />
            <span className="dish-name">{yemek}</span>
          </div>
        ))}
      </div>

      <div className="menu-footer">
        <div className="price-tag">
          <span className="price-label">Menü Fiyatı</span>
          <span className="price-value">{menu.price || menu.fiyat} ₺</span>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
