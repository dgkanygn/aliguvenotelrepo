import { useState, useEffect } from 'react';
import { saloonService } from '../../../services/saloon.service';
import { toast } from 'react-hot-toast';

export const useSaloons = () => {
  const [saloons, setSaloons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchSaloons();
  }, []);

  const fetchSaloons = async () => {
    setIsFetching(true);
    try {
      const response = await saloonService.getSaloons();
      if (response && response.success) {
        setSaloons(response.data || []);
      }
    } catch (error) {
      toast.error('Salonlar yüklenirken hata oluştu');
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    try {
      const res = await saloonService.updateSaloon(id, data);
      if (res.success) {
        setSaloons(saloons.map(s => s.id === id ? { ...s, ...res.data } : s));
        toast.success('Salon güncellendi');
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const addSaloon = async () => {
    setIsLoading(true);
    try {
      const newSaloonData = {
        title: 'Yeni Salon',
        description: 'Salon açıklamasını buraya girin.',
        amenities: [],
        images: []
      };
      const res = await saloonService.createSaloon(newSaloonData);
      if (res.success) {
        setSaloons([...saloons, res.data]);
        toast.success('Yeni salon eklendi');
      }
    } catch (error) {
      toast.error('Eklerken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSaloon = async (id) => {
    setIsLoading(true);
    try {
      const res = await saloonService.deleteSaloon(id);
      if (res.success) {
        setSaloons(saloons.filter(s => s.id !== id));
        toast.success('Salon silindi');
      }
    } catch (error) {
      toast.error('Silinirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saloons,
    isLoading,
    isFetching,
    handleUpdate,
    addSaloon,
    deleteSaloon
  };
};
