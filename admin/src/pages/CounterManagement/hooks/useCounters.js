import { useState, useEffect } from 'react';
import { homeService } from '../../../services/home.service';
import { toast } from 'react-hot-toast';

export const useCounters = () => {
  const [counters, setCounters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    setIsFetching(true);
    try {
      const response = await homeService.getCounters();
      if (response && response.success) {
        setCounters(response.data || []);
      }
    } catch (error) {
      toast.error('Sayaçlar yüklenirken hata oluştu');
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    try {
      const res = await homeService.updateCounter(id, data);
      if (res.success) {
         setCounters(counters.map(c => c.id === id ? { ...c, ...res.data } : c));
         toast.success('Sayaç güncellendi');
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const addCounter = async () => {
    if (counters.length >= 6) return;
    setIsLoading(true);
    try {
      const newCounterData = {
        icon: 'star',
        count: 0,
        name: 'Yeni Sayaç'
      };
      const res = await homeService.createCounter(newCounterData);
      if (res.success) {
        setCounters([...counters, res.data]);
        toast.success('Sayaç eklendi');
      }
    } catch (error) {
      toast.error('Eklerken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCounter = async (id) => {
    setIsLoading(true);
    try {
      const res = await homeService.deleteCounter(id);
      if (res.success) {
         setCounters(counters.filter(c => c.id !== id));
         toast.success('Sayaç başarıyla silindi');
      }
    } catch (error) {
      toast.error('Silinirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    counters,
    isLoading,
    isFetching,
    handleUpdate,
    addCounter,
    removeCounter
  };
};
