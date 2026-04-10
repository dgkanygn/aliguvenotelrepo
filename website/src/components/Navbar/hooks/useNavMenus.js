import { useState, useEffect } from 'react';
import { fetchNavMenusData } from '../../../services/api';

export const useNavMenus = () => {
  const [menus, setMenus] = useState({ rooms: [], saloons: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        const data = await fetchNavMenusData();
        setMenus({
          rooms: data.rooms || [],
          saloons: data.saloons || []
        });
        setError(null);
      } catch (err) {
        console.error('Failed to load nav menus:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  return { menus, loading, error };
};
