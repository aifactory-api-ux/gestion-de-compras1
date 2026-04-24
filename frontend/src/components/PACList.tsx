import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import { usePAC } from '../hooks/usePAC';
import { PAC } from '../types/models';

interface PACListProps {
  pacs: PAC[];
  onSelect: (id: number) => void;
  selectedPACId: number | null;
}

const PACList: React.FC<PACListProps> = ({ pacs, onSelect, selectedPACId }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>PACs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacs.map((pac) => (
              <TableRow
                key={pac.id}
                selected={selectedPACId === pac.id}
                sx={{ cursor: 'pointer' }}
                onClick={() => onSelect(pac.id)}
              >
                <TableCell>{pac.id}</TableCell>
                <TableCell>{pac.nombre}</TableCell>
                <TableCell>{pac.fecha_creacion}</TableCell>
                <TableCell>{pac.estado}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => onSelect(pac.id)}>
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

export default PACList;
