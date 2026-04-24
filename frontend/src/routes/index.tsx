import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import PACList from '../components/PACList';
import PACForm from '../components/PACForm';
import RequerimientoList from '../components/RequerimientoList';
import RequerimientoForm from '../components/RequerimientoForm';
import ItemList from '../components/ItemList';
import ItemForm from '../components/ItemForm';
import OrdenList from '../components/OrdenList';
import VersionList from '../components/VersionList';
import { Box, Typography } from '@mui/material';

const AppRoutes: React.FC = () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ maxWidth: 400, width: '100%', p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
            Gestión de Compras
          </Typography>
          <LoginForm />
        </Box>
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/pac" element={<PACList />} />
      <Route path="/pac/new" element={<PACForm />} />
      <Route path="/pac/:id" element={<PACForm />} />
      <Route path="/pac/:pacId/requerimientos" element={<RequerimientoList />} />
      <Route path="/pac/:pacId/requerimiento/new" element={<RequerimientoForm />} />
      <Route path="/requerimiento/:reqId/items" element={<ItemList />} />
      <Route path="/requerimiento/:reqId/item/new" element={<ItemForm />} />
      <Route path="/pac/:pacId/ordenes" element={<OrdenList />} />
      <Route path="/pac/:pacId/versiones" element={<VersionList />} />
      <Route path="*" element={<Navigate to="/pac" replace />} />
    </Routes>
  );
};

export default AppRoutes;
