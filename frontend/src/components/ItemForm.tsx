import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { ItemCreate } from '../types/models';

interface ItemFormProps {
  onSubmit: (data: ItemCreate) => void;
  loading?: boolean;
  requerimientoId: number;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, loading, requerimientoId }) => {
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      requerimiento_id: requerimientoId,
      codigo,
      descripcion,
      cantidad: parseInt(cantidad),
      precio_unitario: precioUnitario,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5">Crear Item</Typography>
      <TextField
        label="Código"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        fullWidth
        multiline
        rows={2}
      />
      <TextField
        label="Cantidad"
        type="number"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Precio Unitario"
        type="number"
        value={precioUnitario}
        onChange={(e) => setPrecioUnitario(e.target.value)}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </Box>
  );
};

export default ItemForm;
