import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { topGenres as fetchTopGenresData } from "../../../service/apiclient";

const Statistics = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [topGenres, setTopGenres] = useState([]); // State for storing genres
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const genresData = await fetchTopGenresData();
        setTopGenres(genresData); // Store the genres data as-is
      } catch (err) {
        setError('Error fetching top genres');
        console.error('Error fetching top genres:', err);
      }
    };

    fetchTopGenres();
  }, []);

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken'); // or localStorage.getItem('authToken')
    if (!authToken) {
      navigate('/'); // Redirect to login page if token is missing
    }
    const checkAccess = () => {
      const userRole = localStorage.getItem('userRole');
      if (userRole === '2') {
        console.log("Admins can't access this page");
        navigate('/dashboard'); // Redirect to another page
      } else if (userRole === '1') {
        setMessage('Access granted to Statistics!');
      } else {
        console.log("Unrecognized role:", userRole);
        navigate('/dashboard');
      }
    };

    checkAccess(); 
  }, [navigate]);

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Top Genres</Text>
      {error && <Text color="red.500">{error}</Text>}
      {message && <Text color="green.500">{message}</Text>}
      
    </Box>
  );
};

export default Statistics;
