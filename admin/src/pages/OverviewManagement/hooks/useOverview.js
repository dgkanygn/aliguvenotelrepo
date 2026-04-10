import { useState } from 'react';

export const useOverview = () => {
  const [overview, setOverview] = useState({
    id: 1,
    image_url: 'https://aliguvenotel.vercel.app/assets/images/hotel_room_1_1775384455722.png',
    tagline: 'Konaklama',
    title: 'Evinizdeki Rahatlığı Keşfedin',
    summary: 'Ali Güven Uygulama Oteli olarak, misafirlerimize modern ve huzurlu bir konaklama deneyimi sunuyoruz. Öğrencilerimizin taze enerjisi ve profesyonel eğitmenlerimizin gözetiminde, her detayın titizlikle düşünüldüğü odalarımızda kendinizi evinizde hissedeceksiniz.',
    feature_list: ["Modern & Ferah Oda Tasarımı", "Yüksek Hızlı Ücretsiz Wi-Fi"]
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (data) => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOverview({ ...overview, ...data });
    setIsLoading(false);
  };

  return {
    overview,
    isLoading,
    handleUpdate
  };
};
