import React from 'react';
import { Grid, GridItem, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext'; // Ensure the path to AuthContext is correct
import NavBar from './components/Navbar';
import FrontPage from './components/authentication/Frontpage';
import SignUp from './components/authentication/Signup';
import Dashboard from './components/protected/Reviews/Dashboard';
import UserDetails from './components/protected/Users/userDetails';
import ReviewDetails from './components/protected/Reviews/ReviewDetails';
import ProtectedRoute from './components/isProtected';
import UserManagement from './components/protected/burgermenu/userManagement';
import Statistics from './components/protected/burgermenu/statistics';
import UserProfile from './components/authentication/UserProfile';
import UpdateReview from './components/protected/Reviews/updateReview';
import UpdateUser from './components/protected/Users/updateUser';
import RealTimeUpdates from './components/protected/RealTimeUpdates';


function App() {
  return (
    <AuthProvider>
      <Router>
      <Flex direction="column" minHeight="100vh">
          <Grid
            templateAreas={{
              base: `"nav" "main"`,
              lg: `"nav nav" "aside main"`,
            }}
          >
            <GridItem gridArea="nav">
              <NavBar />
            </GridItem>
            <GridItem gridArea="main" bgColor="linear(to-r, teal.500, green.500)">
            
            <Routes>
              <Route path="/" element={<FrontPage />} /> 
              <Route path="/signup" element={<SignUp />} />

              <Route element={<ProtectedRoute />}>
              
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user/:id" element={<UserDetails />} />
                <Route path="/review/:id" element={<ReviewDetails />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/update/review/:id" element={<UpdateReview/>} />
                <Route path="/update/user/:id" element={<UpdateUser/>} />
                <Route path="/sse" element={<RealTimeUpdates />} />
              </Route>
            </Routes>
            </GridItem>
            </Grid>
          </Flex>
      </Router>
    </AuthProvider>

  )
}

export default App;


