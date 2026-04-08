import { useState } from 'react';

export const useFounder = () => {
  const [founder, setFounder] = useState({
    id: 1,
    image_url: 'https://aliguvenotel.vercel.app/assets/images/ali_guven.png',
    title: 'Ali Güven Kimdir?',
    content: 'Okulumuza adını veren Ali Güven 01.01.1931 tarihinde Eskişehir’in Mahmudiye ilçesinin Şevkiye köyünde doğdu. Uzun yıllar çiftçilik yaptıktan sonra ticaret hayatına atıldı. Disiplinli ve özverili çalışmaları sayesinde iş dünyasındaki yerini aldı. Hayırsever bir iş adamı olarak tanındı ve hayatını bu şekilde sürdürdü. <br><br> Ülke kalkınmasında eğitimin önemini her fırsatta dile getiren Ali Güven, sağlığında birçok eğitim kurumuna bağışta bulunmuştur. En büyük isteği ise yüzlerce öğrencinin eğitim göreceği bir okul yaptırmaktır. 26.01.1993 tarihinde hayata veda etmiştir.',
    special_text: 'Oğlu Cafer Güven babasının bu isteğini yerine getirmek için 16.08.2004 tarihinde Ali Güven Otelcilik ve Turizm Meslek Lisesi Uygulama Otelini yaptırmıştır.'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFounder({ ...founder, ...data });
    setIsLoading(false);
  };

  return {
    founder,
    isLoading,
    handleUpdate
  };
};
