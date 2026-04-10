import { useState, useEffect } from 'react';
import { contactService } from '../../../services/contact.service';
import { toast } from 'react-hot-toast';

export const useContact = () => {
  const [contact, setContact] = useState({
    id: 1,
    address: '',
    landline_phone: '',
    mobile_phone: '',
    whatsapp_number: '',
    email: '',
    fax: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    pinterest: '',
    youtube: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    setIsFetching(true);
    try {
      const response = await contactService.getContact();
      if (response.success && response.data) {
        const fetchedData = response.data;
        // Replace nulls with empty strings to keep inputs controlled
        const processedData = { ...fetchedData };
        Object.keys(processedData).forEach(key => {
          if (processedData[key] === null) {
            processedData[key] = '';
          }
        });
        setContact(processedData);
      }
    } catch (error) {
      toast.error('İletişim bilgileri yüklenirken bir hata oluştu');
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdate = async (data) => {
    if (!data.id) {
      toast.error('Güncellenecek kayıt bulunamadı.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await contactService.updateContact(data.id, data);
      if (response.success) {
        toast.success('İletişim bilgileri başarıyla güncellendi');
        const updatedData = response.data;
        Object.keys(updatedData).forEach(key => {
          if (updatedData[key] === null) {
            updatedData[key] = '';
          }
        });
        setContact(updatedData);
      }
    } catch (error) {
      toast.error('Güncelleme sırasında bir hata oluştu');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contact,
    isLoading,
    isFetching,
    handleUpdate
  };
};
