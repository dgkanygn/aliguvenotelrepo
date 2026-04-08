import { useState } from 'react';

export const useContact = () => {
  const [contact, setContact] = useState({
    id: 1,
    address: 'Uluönder Mahallesi Şehit Rüstem Demirbaş Sk No:8 26190 Tepebaşı/Eskişehir',
    landline_phone: '0 (222) 330 03 26',
    mobile_phone: '0 553 209 47 57',
    email: 'bilgi@aliguvenuygulamaoteli.com',
    fax: '0 (222) 330 05 06'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setContact({ ...contact, ...data });
    setIsLoading(false);
  };

  return {
    contact,
    isLoading,
    handleUpdate
  };
};
