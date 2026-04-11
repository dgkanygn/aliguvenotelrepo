import { useState, useEffect } from 'react';
import { homeService } from '../../../services/home.service';
import { toast } from 'react-hot-toast';

export const useOverview = () => {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setIsFetching(true);
    try {
      const response = await homeService.getOverview();
      if (response && response.success) {
        setOverview(response.data);
      }
    } catch (error) {
      toast.error('Giriş yazısı yüklenirken hata oluştu');
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdate = async (data) => {
    if (!overview) return;
    setIsLoading(true);
    try {
      const res = await homeService.updateOverview(overview.id, data);
      if (res && res.success) {
        setOverview({ ...overview, ...res.data });
        toast.success('Giriş yazısı güncellendi');
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    overview,
    isLoading,
    isFetching,
    handleUpdate
  };
};
