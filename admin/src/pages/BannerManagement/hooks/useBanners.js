import { useState, useEffect } from 'react';
import { bannerService } from '../../../services/banner.service';
import { toast } from 'react-hot-toast';

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsFetching(true);
    try {
      const response = await bannerService.getBanners();
      if (response && response.success) {
        setBanners(response.data || []);
      }
    } catch (error) {
      toast.error('Bannerlar yüklenirken hata oluştu');
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    try {
      const res = await bannerService.updateBanner(id, data);
      if (res && res.success) {
        setBanners(banners.map(b => b.id === id ? { ...b, ...res.data } : b));
        toast.success('Banner güncellendi');
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    banners,
    isLoading,
    isFetching,
    handleUpdate
  };
};
