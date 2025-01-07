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
  const [userRoleName, setUserRoleName] = useState(''); // Track role name
  const [userName, setUserName] = useState(''); // Track user name
  const [userEmail, setUserEmail] = useState(''); // Track user email
  const [loading, setLoading] = useState(true);

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
          const storedName = sessionStorage.getItem('userName');
          const storedEmail = sessionStorage.getItem('userEmail');
          const storedRoleName = sessionStorage.getItem('userRoleName');
          const storedRoleFk = sessionStorage.getItem('role_fk');
  
          if (!authToken) {
              navigate('/');
              return;
          }else if(storedRoleName === 'Customer' || storedRoleFk === '3'){
              navigate('/dashboard');
              return;
          }
  
          setUserName(storedName);
          setUserEmail(storedEmail);
          setUserRoleName(storedRoleName);
          setLoading(false);
  
          console.log('User profile:', 'Name;', storedName, '\nEmail', storedEmail, '\nRolename', storedRoleName);
          console.log("Auth token: ", authToken);
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