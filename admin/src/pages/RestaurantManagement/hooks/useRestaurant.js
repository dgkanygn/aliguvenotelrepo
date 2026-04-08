import { useState } from 'react';

export const useRestaurant = () => {
  const [info, setInfo] = useState({
    id: 1,
    intro_text: 'Restoranımız tüm misafirlerimize hizmet vermektedir. Haftanın tüm günleri açık büfe kahvaltı servisimiz, hafta içi ise aylık oluşturduğumuz özel menülerimizle öğle yemeği hizmeti vermekteyiz. Gruplar ve özel davetler için menü içeriğini belirleyerek akşam yemeği servisimiz de bulunmaktadır.',
    warning_text: 'Servis saatlerimiz 11.30 & 13.30 arasındadır ve menülerimizde değişiklik olabilir.',
    menu_pdf_url: 'https://aliguvenotel.vercel.app/assets/files/nisan-ayi-menu.pdf'
  });

  const [images, setImages] = useState([
    { id: 1, url: 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg' },
    { id: 2, url: 'https://aliguvenotel.vercel.app/assets/images/room_2.jpg' },
    { id: 3, url: 'https://aliguvenotel.vercel.app/assets/images/restaurant.jpg' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const updateInfo = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setInfo({ ...info, ...data });
    setIsLoading(false);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  return {
    info,
    images,
    isLoading,
    updateInfo,
    removeImage
  };
};
