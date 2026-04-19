import { useState, useEffect } from 'react';
import { fetchRestaurantData } from '../../../services/api';

export const useRestaurant = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const restData = await fetchRestaurantData();
                setData(restData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const sampleMenu = (() => {
        try {
            const menu = data?.restaurant_info?.sample_menu;
            if (!menu) return null;
            return typeof menu === 'string' ? JSON.parse(menu) : menu;
        } catch (e) {
            console.error('Menu parse error:', e);
            return null;
        }
    })();

    return { data, sampleMenu, loading, error };
};
