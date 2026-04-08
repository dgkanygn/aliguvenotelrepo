import { useState } from 'react';

export const useFeatures = () => {
  const [features, setFeatures] = useState([
    {
      id: 1,
      icon: 'sparkles',
      title: 'Genç ve Dinamik Kadro',
      description: 'Turizm öğrencilerimizin enerjisi ve profesyonel eğitmenlerimizin gözetimiyle samimi bir hizmet.'
    },
    {
      id: 2,
      icon: 'map-pin',
      title: 'Stratejik Lokasyon',
      description: 'Şehrin önemli noktalarına yakın, sakin ve huzurlu bir Tepebaşı deneyimi.'
    },
    {
      id: 3,
      icon: 'heart-handshake',
      title: 'Samimi Misafirperverlik',
      description: 'Bir uygulama otelinden beklediğiniz sıcaklıkta, bütçe dostu konaklama çözümleri.'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFeatures(features.map(f => f.id === id ? { ...f, ...data } : f));
    setIsLoading(false);
  };

  return {
    features,
    isLoading,
    handleUpdate
  };
};
