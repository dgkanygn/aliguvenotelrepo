const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchHomeData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/home-page`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        throw new Error(result.message || 'Error fetching data');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchRoomsData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms-page`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        throw new Error(result.message || 'Error fetching data');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchRestaurantData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurant-page`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        throw new Error(result.message || 'Error fetching data');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchEventData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/events-page`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        throw new Error(result.message || 'Error fetching data');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchMeetingsData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/meetings-page`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        throw new Error(result.message || 'Error fetching data');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchContactData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/contact-page`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        throw new Error(result.message || 'Error fetching data');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchSpaceDetailData = async (type, id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${type}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        throw new Error(result.message || 'Error fetching data');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchNavMenusData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/nav-menus`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        throw new Error(result.message || 'Error fetching data');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
