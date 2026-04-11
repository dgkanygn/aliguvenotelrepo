import { useState, useEffect } from 'react';
import { homeService } from '../../../services/home.service';
import { toast } from 'react-hot-toast';

export const useHero = () => {
  const [heroes, setHeroes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    setIsFetching(true);
    try {
      const response = await homeService.getHeroes();
      if (response && response.success) {
        setHeroes(response.data || []);
      }
    } catch (error) {
      toast.error('Hero slaytları yüklenirken hata oluştu');
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    try {
      const res = await homeService.updateHero(id, data);
      if (res.success) {
        setHeroes(heroes.map(h => h.id === id ? { ...h, ...res.data } : h));
        toast.success('Slayt güncellendi');
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const addHero = async () => {
    setIsLoading(true);
    try {
      const newHeroData = {
        title: 'Yeni Slayt Başlığı',
        description: 'Yeni slayt açıklamasını buraya girin.',
        image_url: '' // Will be updated when user edits
      };
      const res = await homeService.createHero(newHeroData);
      if (res.success) {
        setHeroes([...heroes, res.data]);
        toast.success('Yeni slayt eklendi');
      }
    } catch (error) {
      toast.error('Eklerken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHero = async (id) => {
    setIsLoading(true);
    try {
      const res = await homeService.deleteHero(id);
      if (res.success) {
        setHeroes(heroes.filter(h => h.id !== id));
        toast.success('Slayt silindi');
      }
    } catch (error) {
      toast.error('Silinirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    heroes,
    isLoading,
    isFetching,
    handleUpdate,
    addHero,
    deleteHero
  };
};
