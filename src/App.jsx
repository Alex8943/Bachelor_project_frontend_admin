import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Grid, GridItem, Show } from '@chakra-ui/react'

function App() {

  return (
    <div className="App">
      <Grid
          templateAreas={{
          base: `"nav" "main"`,
          lg: `"nav nav" "aside main"`,
          }}
        >
        <GridItem gridArea="nav" bg="tomato">
        nav
        </GridItem>
        <Show above="lg">
        <GridItem gridArea="aside" bg="green">
        aside
        </GridItem>
        </Show>
        <GridItem gridArea="main" bg="orange">
        main
        </GridItem>
      </Grid>
      
    </div>
  )
}

export default App
