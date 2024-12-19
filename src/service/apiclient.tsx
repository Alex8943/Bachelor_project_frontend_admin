import axios from 'axios';

interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const SECOND_API_URL = `${import.meta.env.VITE_SECOND_BACKEND_URL}`;
const THIRD_API_URL = `${import.meta.env.VITE_THIRD_BACKEND_URL}`;
const FOURTH_API_URL = `${import.meta.env.VITE_FOURTH_BACKEND_URL}`;
const FIFTH_API_URL = `${import.meta.env.VITE_FIFTH_BACKEND_URL}`;
const SIXTH_API_URL = `${import.meta.env.VITE_SIXTH_BACKEND_URL}`;
const SEVENTH_API_URL = `${import.meta.env.VITE_SEVENTH_BACKEND_URL}`;
const EIGHTH_API_URL = `${import.meta.env.VITE_EIGHTH_BACKEND_URL}`;
const NINTH_API_URL = `${import.meta.env.VITE_NINTH_BACKEND_URL}`;

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });

    const { authToken } = response.data;

    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      throw new Error('Login failed: No authToken returned');
    }

    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const signup = async ({ name, lastname, email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { name, lastname, email, password });

    const { authToken } = response.data;

    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      throw new Error('Signup failed: No authToken returned');
    }

    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

const getAuthToken = (): string => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('No auth token found');
  }
  return authToken;
};

export const getAllUsers = async () => {
  try {
    const authToken = getAuthToken();

    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getOneUser = async ({ id }) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${API_URL}/user/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log("Auth Token:", authToken);
    return response.data;
  } catch (error) {
    console.error('Error fetching one user:', error);
    throw error;
  }
};

//Is not from reviews services!!
export const getAllReviewsByUser = async (id: number) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${API_URL}/user/${id}/reviews`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by user:', error);
    throw error;
  }
};

export const getUsersByRole = async (role_fk: number) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${API_URL}/users/role/${role_fk}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${API_URL}/roles`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const searchUsers = async (value: string) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${API_URL}/findUser/${value}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const authToken = getAuthToken();
    await axios.put(`${API_URL}/update/user/${id}`, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const showAllDeletedUsers = async () => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${API_URL}/softDeletedUsers`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching deleted users:', error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const authToken = getAuthToken();
    await axios.put(`${API_URL}/delete/user/${id}`, {}, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const undeleteUser = async (id: number) => {
  try {
    const authToken = getAuthToken();
    await axios.put(`${API_URL}/undelete/user/${id}`, {}, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  } catch (error) {
    console.error('Error undeleting user:', error);
    throw error;
  }
};

export const getUpdates = (onMessageCallback: (data: any) => void) => {
  const eventSource = new EventSource(`${API_URL}/sse/events`);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("New event received:", data);
    onMessageCallback(data);
  };

  eventSource.onerror = (error) => {
    console.error("Error with SSE connection:", error);
    eventSource.close();
  };

  return eventSource;
};

export const topGenres = async () => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${API_URL}/genres/top`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top genres:', error);
    throw error;
  }
};


//Reviews services
export const showAllDeletedReviews = async () => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${SECOND_API_URL}/deleted/reviews`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching deleted reviews:', error);
    throw error;
  }
};

export const createReview = async (data: any) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.post(`${THIRD_API_URL}/review`, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};


export const searchReviews = async (value: string) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${FOURTH_API_URL}/review/${value}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log("Data from the backend: ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching reviews:', error);
    throw error;
  }
};


export const updateReview = async (id: number, data: any) => {
  try {
    const authToken = getAuthToken();
    await axios.put(`${FIFTH_API_URL}/update/review/${id}`, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};


export const getOneReview = async (id: number) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${SIXTH_API_URL}/review/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching one review:', error);
    throw error;
  }
};


export const getRangeOfReviews = async (max: number) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.get(`${SEVENTH_API_URL}/reviews/${max}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching range of reviews:', error);
    throw error;
  }
};

export const deleteReview = async (id: number) => {
  try {
    const authToken = getAuthToken();
    await axios.put(`${EIGHTH_API_URL}/delete/review/${id}`, {}, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export const undeleteReview = async (id: number) => {
  try {
    const authToken = getAuthToken();
    await axios.put(`${NINTH_API_URL}/undelete/review/${id}`, {}, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  } catch (error) {
    console.error('Error undeleting review:', error);
    throw error;
  }
};
