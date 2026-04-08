import { useState } from 'react';

export const useCounters = () => {
  const [counters, setCounters] = useState([
    { id: 1, icon: 'bed', count: 30, name: 'Oda' },
    { id: 2, icon: 'utensils', count: 100, name: 'Kişilik Restoran' },
    { id: 3, icon: 'sun', count: 100, name: 'Kişilik Teras' },
    { id: 4, icon: 'graduation-cap', count: 250, name: 'Kişilik Okul Salonu' },
    { id: 5, icon: 'briefcase', count: 150, name: 'Kişilik Otel Salonu' },
    { id: 6, icon: 'trees', count: 30, name: 'Açık Hava Salon' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCounters(counters.map(c => c.id === id ? { ...c, ...data } : c));
    setIsLoading(false);
  };

  const addCounter = async () => {
    if (counters.length >= 6) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCounter = {
      id: Date.now(),
      icon: 'star',
      count: 0,
      name: 'Yeni Sayaç'
    };
    setCounters([...counters, newCounter]);
    setIsLoading(false);
  };

  const removeCounter = async (id) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCounters(counters.filter(c => c.id !== id));
    setIsLoading(false);
  };

  return {
    counters,
    isLoading,
    handleUpdate,
    addCounter,
    removeCounter
  };
};
