import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { PACCreate } from '../types/models';

interface PACFormProps {
  onSubmit: (data: PACCreate) => void;
  loading?: boolean;
  initialData?: PACCreate;
}

const PACForm: React.FC<PACFormProps> = ({ onSubmit, loading, initialData }) => {
  const [organismoId, setOrganismoId] = useState(initialData?.organismo_id?.toString() || '');
  const [usuarioId, setUsuarioId] = useState(initialData?.usuario_id?.toString() || '');
  const [nombre, setNombre] = useState(initialData?.nombre || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      organismo_id: parseInt(organismoId),
      usuario_id: parseInt(usuarioId),
      nombre,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5">{initialData ? 'Editar PAC' : 'Crear PAC'}</Typography>
      <TextField
        label="ID Organismo"
        type="number"
        value={organismoId}
        onChange={(e) => setOrganismoId(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="ID Usuario"
        type="number"
        value={usuarioId}
        onChange={(e) => setUsuarioId(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </Box>
  );
};

export default PACForm;
