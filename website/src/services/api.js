const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchHomeData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/home`);
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
        const response = await fetch(`${API_BASE_URL}/rooms`);
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
        const response = await fetch(`${API_BASE_URL}/restaurant`);
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
        const response = await fetch(`${API_BASE_URL}/event`);
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
        const response = await fetch(`${API_BASE_URL}/contact`);
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

