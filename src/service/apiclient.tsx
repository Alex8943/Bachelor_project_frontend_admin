import axios from 'axios';

interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data; // Assuming this is the format of the response
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const signup = async ({name, lastname, email, password}) => {
  try{
    const response = await axios.post(`${API_URL}/auth/signup`, { name, lastname, email, password });
    return response.data;
  }catch(error){
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getUserName = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}; 

export const getRoles = async () => {
  try{
    const response = await axios.get(`${API_URL}/roles`);
    return response.data;
  }catch(error){
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const searchReviews = async (value: string) => {
  try {
    console.log("Searching for reviews with title:", value);
    const response = await axios.get(`${API_URL}/review/${value}`); 
    console.log("Search results:: ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};
 
