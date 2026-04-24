import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, Box, Typography } from '@mui/material';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <AppRoutes />
      </Box>
    </BrowserRouter>
  );
};

export default App;
