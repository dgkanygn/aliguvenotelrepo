import { useState, useEffect } from 'react';
import { homeService } from '../../../services/home.service';
import { toast } from 'react-hot-toast';

export const useFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
     fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setIsFetching(true);
    try {
      const response = await homeService.getFeatures();
      if (response && response.success) {
        setFeatures(response.data || []);
      }
    } catch (error) {
      toast.error('Özellikler yüklenirken hata oluştu');
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    try {
      const res = await homeService.updateFeature(id, data);
      if (res.success) {
        setFeatures(features.map(f => f.id === id ? { ...f, ...res.data } : f));
        toast.success('Özellik başarıyla güncellendi');
      }
    } catch (error) {
       toast.error('Güncellenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const createFeature = async (data) => {
    setIsLoading(true);
    try {
      const res = await homeService.createFeature(data);
      if (res.success) {
        setFeatures([...features, res.data]);
        toast.success('Özellik eklendi');
        return true;
      }
    } catch (error) {
      toast.error('Eklerken hata oluştu');
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const removeFeature = async (id) => {
    setIsLoading(true);
    try {
      const res = await homeService.deleteFeature(id);
      if (res.success) {
         setFeatures(features.filter(f => f.id !== id));
         toast.success('Özellik başarıyla silindi');
      }
    } catch (error) {
      toast.error('Silinirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    features,
    isLoading,
    isFetching,
    handleUpdate,
    createFeature,
    removeFeature
  };
};
