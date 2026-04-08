import { useState } from 'react';

export const useBanners = () => {
  const [banners, setBanners] = useState([
    { id: 1, page_key: 'rooms', top_title: 'Konaklama', page_title: 'Oda ve Süitlerimiz', image_url: 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg' },
    { id: 2, page_key: 'room-detail', top_title: 'Oda Detayı', page_title: 'Konforlu Konaklama', image_url: 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg' },
    { id: 3, page_key: 'restaurant', top_title: 'Gastronomi', page_title: 'Restoranımız', image_url: 'https://aliguvenotel.vercel.app/assets/images/restaurant.jpg' },
    { id: 4, page_key: 'events', top_title: 'Organizasyon', page_title: 'Düğün & Davet', image_url: 'https://aliguvenotel.vercel.app/assets/images/saloon_1.jpg' },
    { id: 5, page_key: 'contact', top_title: 'Bize Ulaşın', page_title: 'İletişim', image_url: 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setBanners(banners.map(b => b.id === id ? { ...b, ...data } : b));
    setIsLoading(false);
  };

  return {
    banners,
    isLoading,
    handleUpdate
  };
};
