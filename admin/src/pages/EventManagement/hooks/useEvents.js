import { useState } from 'react';

export const useEvents = () => {
  const [data, setData] = useState({
    id: 1,
    intro_text: 'En özel günlerinizi ölümsüzleştirmek için Ali Güven Uygulama Oteli\'nin profesyonel organizasyon ekibi ve şık salonları ile yanınızdayız.',
    video_url: 'https://www.youtube.com/watch?v=pnDDWq4T4Fk',
    title: 'Küçük Salon - 130 Kişilik',
    description: 'Salonumuz 130 kişilik misafir kapasitesinde olup, çeşitli organizasyonlarınıza ev sahipliği yapabilmektedir. Nişan töreni-kına gecesi-Mevlid-i şerifleriniz için uygun ses sistemi düzeni ve dekorasyonu ile donatılmıştır.',
    amenities: ["Profesyonel Ses Sistemi", "Özel Dekorasyon Seçenekleri", "Nişan & Kına İçin İdeal", "130 Kişilik Kapasite"]
  });

  const [images, setImages] = useState([
    { id: 1, url: 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg' },
    { id: 2, url: 'https://aliguvenotel.vercel.app/assets/images/room_2.jpg' },
    { id: 3, url: 'https://aliguvenotel.vercel.app/assets/images/restaurant.jpg' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (newData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setData({ ...data, ...newData });
    setIsLoading(false);
  };

  return {
    data,
    images,
    isLoading,
    handleUpdate
  };
};
