import { useState, useEffect } from 'react';
import { restaurantService } from '../../../services/restaurant.service';
import { uploadService } from '../../../services/upload.service';
import { toast } from 'react-hot-toast';

export const useRestaurant = () => {
  const [info, setInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const updateInfo = async (formData, pdfFile1, pdfFile2, newImages, existingImages) => {
    if (!info) return;

    setIsUploading(true);
    let finalPdfUrl1 = formData.menu_pdf_url;
    let finalPdfUrl2 = formData.menu_pdf_url_2;
    let finalImages = [...existingImages];

    try {
      // 1. Handle PDF Uploads
      if (pdfFile1) {
        const pdfUrl1 = await uploadService.uploadFile(pdfFile1);
        if (pdfUrl1) {
          finalPdfUrl1 = pdfUrl1;
        } else {
          toast.error("1. Menü dosyası yüklenemedi");
          setIsUploading(false);
          return false;
        }
      }

      if (pdfFile2) {
        const pdfUrl2 = await uploadService.uploadFile(pdfFile2);
        if (pdfUrl2) {
          finalPdfUrl2 = pdfUrl2;
        } else {
          toast.error("2. Menü dosyası yüklenemedi");
          setIsUploading(false);
          return false;
        }
      }

      // 2. Handle Image Uploads
      if (newImages && newImages.length > 0) {
        const uploadedImgUrls = await Promise.all(
          newImages.map(file => uploadService.uploadFile(file))
        );

        const validUrls = uploadedImgUrls.filter(url => url);
        if (validUrls.length !== newImages.length) {
          toast.error("Bazı resimler yüklenemedi");
        }

        finalImages = [
          ...finalImages,
          ...validUrls.map((url, i) => ({ id: `new_${Date.now()}_${i}`, image_url: url }))
        ];
      }

      setIsUploading(false);
      setIsLoading(true);

      // 3. Final Update
      const res = await restaurantService.updateRestaurant(info.id, {
        ...formData,
        sample_menu: JSON.stringify(formData.sample_menu),
        menu_pdf_url: finalPdfUrl1,
        menu_pdf_url_2: finalPdfUrl2,
        restaurant_images: finalImages
      });

      if (res && res.success) {
        if (res.data.restaurant_info) {
          setInfo(res.data.restaurant_info);
        }
        if (res.data.restaurant_images) {
          setImages(res.data.restaurant_images);
        }
        toast.success('Restoran bilgileri güncellendi');
        return true;
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
      return false;
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  return {
    info,
    images,
    setImages,
    isLoading,
    isUploading,
    isFetching,
    updateInfo
  };
};
