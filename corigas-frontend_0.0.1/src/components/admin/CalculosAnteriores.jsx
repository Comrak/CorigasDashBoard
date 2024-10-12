import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const CalculosAnteriores = () => {
  const handleExportToExcel = () => {
    // Lógica para exportar los cálculos a Excel
  };

  const handleExportToPDF = () => {
    // Lógica para exportar los cálculos a PDF
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mes</TableCell>
            <TableCell>Centro Comercial</TableCell>
            <TableCell>Local</TableCell>
            <TableCell>Litros Consumidos</TableCell>
            <TableCell>Costo Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Aquí irían las filas de cálculos anteriores */}
        </TableBody>
      </Table>

      <Button variant="contained" color="primary" onClick={handleExportToExcel}>
        Exportar a Excel
      </Button>
      <Button variant="contained" color="secondary" onClick={handleExportToPDF}>
        Exportar a PDF
      </Button>
      <Button variant="contained" onClick={handlePrint}>
        Imprimir
      </Button>
    </div>
  );
};

export default CalculosAnteriores;
