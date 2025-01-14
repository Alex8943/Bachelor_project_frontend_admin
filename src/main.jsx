import * as React from 'react'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import App from './App';
import theme from './theme'
import { EventProvider } from './components/EventContext';

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode='={theme.config.initialColorMode}' />
      <EventProvider>
      <App />
      </EventProvider>
    </ChakraProvider>
  </React.StrictMode>,
)