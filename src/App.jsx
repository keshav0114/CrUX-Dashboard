import { useState } from 'react'
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import UrlInput from './components/UrlInput'
import ResultsTable from './components/ResultsTable'
import './App.css'

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" className="main-container">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            CRUX Dashboard
          </Typography>
          <UrlInput 
            setResults={setResults} 
            setLoading={setLoading} 
            setError={setError}
          />
          <ResultsTable 
            results={results} 
            loading={loading} 
            error={error} 
          />
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
