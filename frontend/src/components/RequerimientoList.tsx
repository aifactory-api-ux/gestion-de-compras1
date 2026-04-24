import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import { Requerimiento } from '../types/models';

interface RequerimientoListProps {
  requerimientos: Requerimiento[];
  onSelect: (id: number) => void;
  selectedRequerimientoId: number | null;
}

const RequerimientoList: React.FC<RequerimientoListProps> = ({ requerimientos, onSelect, selectedRequerimientoId }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Requerimientos</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Monto Estimado</TableCell>
              <TableCell>Moneda</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requerimientos.map((req) => (
              <TableRow
                key={req.id}
                selected={selectedRequerimientoId === req.id}
                sx={{ cursor: 'pointer' }}
                onClick={() => onSelect(req.id)}
              >
                <TableCell>{req.id}</TableCell>
                <TableCell>{req.descripcion}</TableCell>
                <TableCell>{req.monto_estimado}</TableCell>
                <TableCell>{req.moneda}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => onSelect(req.id)}>
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

export default RequerimientoList;
