import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { VersionPAC } from '../types/models';

interface VersionListProps {
  versiones: VersionPAC[];
}

const VersionList: React.FC<VersionListProps> = ({ versiones }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Versiones PAC</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Versión</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cambios</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versiones.map((version) => (
              <TableRow key={version.id}>
                <TableCell>{version.id}</TableCell>
                <TableCell>{version.version}</TableCell>
                <TableCell>{version.fecha}</TableCell>
                <TableCell>{version.cambios}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VersionList;
