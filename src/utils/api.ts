import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example API call functions
export const fetchDestinations = async () => {
  try {
    const response = await apiClient.get('/destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

export const createTrip = async (tripData: any) => {
  try {
    const response = await apiClient.post('/trips', tripData);
    return response.data;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};
