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

export const getOneUser = async ({id}) => {
  try{ 

    const response = await axios.get(`${API_URL}/user/${id}`);
    return response.data;
  }catch(error){
    console.log("error fetching one user: ", error);
    throw error;
  }
}

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const getUsersByRole = async (role_fk: number) => {
  try {
    const response = await axios.get(`${API_URL}/users/role/${role_fk}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const getAllReviews = async () => {
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
    console.log("Search results: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};




export const searchUsers = async (value: string) => {
  try {
    const response = await axios.get(`${API_URL}/findUser/${value}`);
    console.log("Search results:: ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getOneReview = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/getReview/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review:', error);
    throw error;
  }
}

export const updateReview = async (id, data) => {
  try {
    await axios.put(`${API_URL}/update/review/${id}`, data);
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    await axios.put(`${API_URL}/update/user/${id}`, data);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}


export const getAllReviewsByUser = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/user/${id}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}


export const deleteReview = async (id: number) => {
  try {
    
    await axios.put(`${API_URL}/delete/review/${id}`);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export const showAllDeletedReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/softDeletedReviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

export const showAllDeletedUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/softDeletedUsers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    await axios.put(`${API_URL}/delete/user/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};




export const topGenres = async () => {
  try {
    const response = await axios.get(`${API_URL}/genres/top`);
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const getRangeOfReviews = async (max: any) => {
  try{
    const response = await axios.get(`${API_URL}/reviews/${max}`);
    return response.data;
  }catch(error){
    console.error('Error fetching reviews:', error);
    throw error;
  }
}
 

export const undeleteReview = async (id: number) => {
  try {
    await axios.put(`${API_URL}/undelete/review/${id}`);
  } catch (error) {
    console.error('Error undeleting review:', error);
    throw error;
  }
};

