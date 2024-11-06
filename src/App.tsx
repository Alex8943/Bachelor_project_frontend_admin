import React from 'react';
import { Grid, GridItem, Flex } from '@chakra-ui/react';
import NavBar from './components/navbar';
import FrontPage from './components/frontpage';

function App() {
  return (
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
            <FrontPage />
          </GridItem>
        </Grid>
      </Flex>
  );
}

export default App;
