import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import { Item } from '../types/models';

interface ItemListProps {
  items: Item[];
  onSelect: (id: number) => void;
  selectedItemId: number | null;
}

const ItemList: React.FC<ItemListProps> = ({ items, onSelect, selectedItemId }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Items</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                selected={selectedItemId === item.id}
                sx={{ cursor: 'pointer' }}
                onClick={() => onSelect(item.id)}
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.codigo}</TableCell>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>{item.precio_unitario}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => onSelect(item.id)}>
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ItemList;
