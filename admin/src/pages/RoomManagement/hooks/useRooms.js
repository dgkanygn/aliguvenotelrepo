import { useState, useEffect } from 'react';
import { roomService } from '../../../services/room.service';
import { toast } from 'react-hot-toast';

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsFetching(true);
    try {
      const response = await roomService.getRooms();
      if (response && response.success) {
        setRooms(response.data || []);
      }
    } catch (error) {
      toast.error('Odalar yüklenirken hata oluştu');
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setIsLoading(true);
    try {
      const res = await roomService.updateRoom(id, data);
      if (res.success) {
        setRooms(rooms.map(r => r.id === id ? { ...r, ...res.data } : r));
        toast.success('Oda güncellendi');
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async (data) => {
    setIsLoading(true);
    try {
      const res = await roomService.createRoom(data);
      if (res.success) {
        setRooms([...rooms, res.data]);
        toast.success('Yeni oda eklendi');
        return true;
      }
    } catch (error) {
      toast.error('Eklerken hata oluştu');
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const deleteRoom = async (id) => {
    setIsLoading(true);
    try {
      const res = await roomService.deleteRoom(id);
      if (res.success) {
        setRooms(rooms.filter(r => r.id !== id));
        toast.success('Oda silindi');
      }
    } catch (error) {
      toast.error('Silinirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rooms,
    isLoading,
    isFetching,
    handleUpdate,
    createRoom,
    deleteRoom
  };
};
