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
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      navigate('/'); // Redirect to login page if token is missing
    } else {
      const userRole = localStorage.getItem('userRole');
      if (userRole === '2') {
        console.log("Admins can't access this page");
        navigate('/dashboard'); // Redirect to another page
      } else if (userRole === '1') {
        setMessage('Access granted to Statistics!');
        console.log("Access granted for statistics");
      } else {
        console.log("Unrecognized role:", userRole);
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Top Genres</Text>
      {error && <Text color="red.500">{error}</Text>}
      {message && <Text color="green.500" mb={4}>{message}</Text>}

      {/* Add margin-top to move the chart down */}
      <Box mt={10} height={400}> 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topGenres}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="review_count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Statistics;