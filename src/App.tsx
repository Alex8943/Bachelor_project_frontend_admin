import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Grid, GridItem, Flex } from '@chakra-ui/react';
import NavBar from './components/navbar';
import FrontPage from './components/authentication/frontpage';
import SignUp from './components/authentication/signup';
import Dashboard from './components/protected/Reviews/dashboard';
import UserDetails from './components/protected/Users/userDetails';
import ReviewDetails from './components/protected/Reviews/reviewDetails';
import ProtectedRoute from './components/isProtected';
import UserManagement from './components/protected/burgermenu/userManagement';
import Statistics from './components/protected/burgermenu/statistics';
import UserProfile from './components/authentication/UserProfile';
import UpdateReview from './components/protected/Reviews/updateReview';
import UpdateUser from './components/protected/Users/updateUser';
import RealTimeUpdates from './components/protected/RealTimeUpdates';
import RuleSetComponent from './components/terms_and_conditions';

function App() {
  
  return (
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

          <GridItem gridArea="main">
            <Routes>
              <Route path="/" element={<FrontPage />} /> {/* Home route for login */}
              <Route path="/signup" element={<SignUp />} /> {/* Signup route */}
              <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              /> 
              <Route path="/user/:id" element={<UserDetails />} />
              <Route path="/review/:id" element={<ReviewDetails />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/update/review/:id" element={<UpdateReview/>} />
              <Route path="/update/user/:id" element={<UpdateUser/>} />
              <Route path="/sse" element={<RealTimeUpdates />} />
              <Route path="/rules" element={<RuleSetComponent />} />
            </Routes>
          </GridItem>
        </Grid>
      </Flex>
    </Router>
  );
}

export default App;