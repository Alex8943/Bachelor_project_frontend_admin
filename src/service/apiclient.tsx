import axios from 'axios';
//import env from 'react-dotenv';

interface ImportMeta {
  env: {
    VITE_BACKEND_URL: string;
  };
}

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;

export const login = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};
 


