import { useState } from 'react';

export const useHero = () => {
  const [heroes, setHeroes] = useState([
    {
      id: 1,
      image_url: 'https://aliguvenotel.vercel.app/assets/images/saloon_2.jpg',
      title: 'Şehrin Kalbinde Huzurlu Bir Mola',
      description: "Eskişehir'in misafirperverliğini Ali Güven Uygulama Oteli'nde keşfedin. Modern konfor ve kusursuz hizmet anlayışıyla sizi bekliyoruz."
    },
    {
      id: 2,
      image_url: 'https://aliguvenotel.vercel.app/assets/images/saloon_2.jpg',
      title: 'Geleceğin Turizmcileriyle Tanışın',
      description: 'Genç yeteneklerin enerjisi ve profesyonel eğitmenlerin tecrübesiyle harmanlanmış, samimi bir konaklama deneyimine davetlisiniz.'
    },
    {
      id: 3,
      image_url: 'https://aliguvenotel.vercel.app/assets/images/saloon_2.jpg',
      title: 'Eskişehir Yolculuğunuz Burada Başlar',
      description: "Tepebaşı'nın merkezinde, ulaşım kolaylığı ve ev sıcaklığındaki odalarımızla seyahatlerinizi keyfe dönüştürüyoruz."
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHeroes(heroes.map(h => h.id === id ? { ...h, ...data } : h));
    setIsLoading(false);
  };

  return {
    heroes,
    isLoading,
    handleUpdate
  };
};
