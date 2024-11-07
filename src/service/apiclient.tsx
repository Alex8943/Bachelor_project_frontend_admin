import axios from 'axios';

interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const login = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/login`);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const signup = async () => {
  try{
    const response = await axios.post(`${API_URL}/auth/signup`);
    return response.data;
  }catch(error){
    console.error('Error fetching reviews:', error);
    throw error;
  }
};
 


