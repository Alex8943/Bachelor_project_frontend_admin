import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { topGenres as fetchTopGenresData } from "../../../service/apiclient";

const Statistics = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [topGenres, setTopGenres] = useState([]);
  const [error, setError] = useState(null);
  const [userRoleName, setUserRoleName] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const genresData = await fetchTopGenresData();
        setTopGenres(genresData);
      } catch (err) {
        setError('Error fetching top genres');
        console.error('Error fetching top genres:', err);
      }
    };

    fetchTopGenres();
  }, []);

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    const storedName = sessionStorage.getItem('userName');
    const storedEmail = sessionStorage.getItem('userEmail');
    const storedRoleName = sessionStorage.getItem('userRoleName');
    const storedRoleFk = sessionStorage.getItem('role_fk');

    if (!authToken) {
      navigate('/');
      return;
    } else if (storedRoleName === 'Customer' || storedRoleFk === '3') {
      navigate('/dashboard');
      return;
    }

    setUserName(storedName);
    setUserEmail(storedEmail);
    setUserRoleName(storedRoleName);
    setLoading(false);

  }, [navigate]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bg="white" >
      <Box 
        bg="white" 
        p={6} 
        borderRadius="md" 
        boxShadow="lg" 
        width={{ base: '90%', md: '60%', lg: '50%' }} 
        textAlign="center"
        marginRight={400}
        marginLeft={350}
      >
        <Text fontSize="3xl" mb={6}>Top Genres</Text>
        {error && <Text color="red.500">{error}</Text>}
        {message && <Text color="green.500" mb={4}>{message}</Text>}
        
        <Box height={300}>
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
    </Box>
  );
};

export default Statistics;
