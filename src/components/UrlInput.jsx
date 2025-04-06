import { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCruxData } from '../services/cruxService';

const UrlInput = ({ setResults, setLoading, setError }) => {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [inputError, setInputError] = useState('');

  const validateUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddUrl = () => {
    if (!url.trim()) {
      setInputError('URL cannot be empty');
      return;
    }

    if (!validateUrl(url)) {
      setInputError('Please enter a valid URL');
      return;
    }

    // Check if URL already exists in the list
    if (urls.includes(url)) {
      setInputError('URL already added');
      return;
    }

    setUrls([...urls, url]);
    setUrl('');
    setInputError('');
  };

  const handleRemoveUrl = (indexToRemove) => {
    setUrls(urls.filter((_, index) => index !== indexToRemove));
  };

  const handleSearch = async () => {
    // If no URLs in array but there's one in the input, add it automatically
    if (urls.length === 0 && url) {
      if (!validateUrl(url)) {
        setInputError('Please enter a valid URL');
        return;
      }
      urls.push(url);
      setUrl('');
    }

    if (urls.length === 0) {
      setInputError('Please add at least one URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const results = await Promise.all(urls.map(url => fetchCruxData(url)));
      setResults(results.map((result, index) => ({
        url: urls[index],
        ...result
      })));
    } catch (error) {
      console.error('Error fetching CRUX data:', error);
      setError('Failed to fetch CRUX data. Please check your API key and URLs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Enter URL(s) to analyze
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          label="URL"
          variant="outlined"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={!!inputError}
          helperText={inputError}
          placeholder="https://example.com"
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleAddUrl();
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddUrl}
          sx={{ ml: 2 }}
        >
          Add
        </Button>
      </Box>
      
      {urls.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            URLs to analyze:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {urls.map((url, index) => (
              <Chip
                key={index}
                label={url}
                onDelete={() => handleRemoveUrl(index)}
                deleteIcon={<DeleteIcon />}
              />
            ))}
          </Box>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleSearch}
          disabled={urls.length === 0 && !url}
          startIcon={urls.length === 0 && !url ? null : null}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default UrlInput; 