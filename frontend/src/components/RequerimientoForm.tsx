import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { RequerimientoCreate } from '../types/models';

interface RequerimientoFormProps {
  onSubmit: (data: RequerimientoCreate) => void;
  loading?: boolean;
  pacId: number;
}

const RequerimientoForm: React.FC<RequerimientoFormProps> = ({ onSubmit, loading, pacId }) => {
  const [descripcion, setDescripcion] = useState('');
  const [montoEstimado, setMontoEstimado] = useState('');
  const [moneda, setMoneda] = useState('CLP');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pac_id: pacId,
      descripcion,
      monto_estimado: montoEstimado,
      moneda,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5">Crear Requerimiento</Typography>
      <TextField
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        fullWidth
        multiline
        rows={3}
      />
      <TextField
        label="Monto Estimado"
        type="number"
        value={montoEstimado}
        onChange={(e) => setMontoEstimado(e.target.value)}
        required
        fullWidth
      />
      <TextField
        select
        label="Moneda"
        value={moneda}
        onChange={(e) => setMoneda(e.target.value)}
        required
        fullWidth
      >
        <MenuItem value="CLP">CLP</MenuItem>
        <MenuItem value="USD">USD</MenuItem>
        <MenuItem value="EUR">EUR</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </Box>
  );
};

export default RequerimientoForm;
