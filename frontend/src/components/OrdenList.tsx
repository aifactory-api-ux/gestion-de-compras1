import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { OrdenCompra } from '../types/models';

interface OrdenListProps {
  ordenes: OrdenCompra[];
}

const OrdenList: React.FC<OrdenListProps> = ({ ordenes }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Órdenes de Compra</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Número OC</TableCell>
              <TableCell>Monto Transado</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes.map((orden) => (
              <TableRow key={orden.id}>
                <TableCell>{orden.id}</TableCell>
                <TableCell>{orden.numero_oc}</TableCell>
                <TableCell>{orden.monto_transado}</TableCell>
                <TableCell>{orden.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdenList;
