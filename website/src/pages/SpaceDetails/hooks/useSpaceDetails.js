import { useState, useEffect } from 'react';
import { fetchSpaceDetailData } from '../../../services/api';

export const useSpaceDetails = (type, id) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await fetchSpaceDetailData(type, id);
                
                // Bazı rotalar tekil obje, bazıları array dönebilir. (Örn: saloons GET array dönüyor olabilir)
                const spaceData = Array.isArray(result) ? result.find(item => item.id == id) : result;
                
                if (!spaceData) {
                    throw new Error("Kayıt bulunamadı");
                }
                
                setData({
                    space: spaceData,
                    images: spaceData.images || []
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id && type) {
            loadData();
        }
    }, [id, type]);

    return { data, loading, error };
};
