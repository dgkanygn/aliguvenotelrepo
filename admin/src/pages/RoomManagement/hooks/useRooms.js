import { useState } from 'react';

export const useRooms = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      title: 'Standart Oda',
      description: 'Konforlu ve ekonomik bir konaklama deneyimi sunan standart odalarımız...',
      amenities: ["TV", "Ücretsiz Wi-Fi", "7/24 Sıcak Su", "Saç Kurutma Makinesi", "Minibar"],
      images: [
        { id: 1, url: 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg', is_main: true },
        { id: 2, url: 'https://aliguvenotel.vercel.app/assets/images/room_2.jpg', is_main: false },
      ]
    },
    {
      id: 2,
      title: 'Süit Oda',
      description: 'Daha geniş bir yaşam alanı ve ekstra konfor arayan misafirlerimiz için...',
      amenities: ["Oturma Grubu", "Klima", "Geniş Balkon", "Smart TV", "Ücretsiz Wi-Fi", "Kettle Seti"],
      images: [
        { id: 4, url: 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg', is_main: true },
        { id: 5, url: 'https://aliguvenotel.vercel.app/assets/images/room_2.jpg', is_main: false },
      ]
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRooms(rooms.map(r => r.id === id ? { ...r, ...data } : r));
    setIsLoading(false);
  };

  const addRoom = () => {
    const newRoom = {
      id: Date.now(),
      title: 'Yeni Oda Tipi',
      description: 'Oda açıklamasını buraya girin.',
      amenities: [],
      images: []
    };
    setRooms([...rooms, newRoom]);
  };

  const deleteRoom = (id) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  return {
    rooms,
    isLoading,
    handleUpdate,
    addRoom,
    deleteRoom
  };
};
