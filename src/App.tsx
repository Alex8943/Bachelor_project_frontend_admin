import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Grid, GridItem, Flex } from '@chakra-ui/react';
import NavBar from './components/navbar';
import FrontPage from './components/authentication/frontpage';
import SignUp from './components/authentication/signup';
import Dashboard from './components/protected/dashboard';
import UserDetails from './components/protected/userDetails';
import ReviewDetails from './components/protected/reviewDetails';
import ProtectedRoute from './components/isProtected';


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
            </Routes>
          </GridItem>
        </Grid>
      </Flex>
    </Router>
  );
}

export default App;
