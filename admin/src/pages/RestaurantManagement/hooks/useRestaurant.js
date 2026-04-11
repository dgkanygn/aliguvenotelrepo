import { useState, useEffect } from 'react';
import { restaurantService } from '../../../services/restaurant.service';
import { toast } from 'react-hot-toast';

export const useRestaurant = () => {
  const [info, setInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    setIsFetching(true);
    try {
      const response = await restaurantService.getRestaurant();
      if (response && response.success) {
        setInfo(response.data.restaurant_info || {});
        setImages(response.data.restaurant_images || []);
      }
    } catch (error) {
      toast.error('Restoran bilgileri yüklenirken hata oluştu');
    } finally {
      setIsFetching(false);
    }
  };

  const updateInfo = async (data) => {
    if (!info) return;
    setIsLoading(true);
    try {
      const res = await restaurantService.updateRestaurant(info.id, data);
      if (res && res.success) {
        setInfo({ ...info, ...res.data });
        toast.success('Restoran bilgileri güncellendi');
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    info,
    images,
    setImages,
    isLoading,
    isFetching,
    updateInfo
  };
};
