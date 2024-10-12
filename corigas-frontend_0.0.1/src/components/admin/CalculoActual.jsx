import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";

const CalculoActual = ({ token }) => {
  const [centrosComerciales, setCentrosComerciales] = useState([]);
  const [selectedCentro, setSelectedCentro] = useState("");
  const [locales, setLocales] = useState([]);
  const [updatedLocales, setUpdatedLocales] = useState([]);
  const [litrosDespachados, setLitrosDespachados] = useState(0); // Litros despachados por el centro comercial
  const [precioPorLitro, setPrecioPorLitro] = useState(0); // Precio por litro proporcionado por el usuario

  // Obtener los centros comerciales al montar el componente
  useEffect(() => {
    const fetchCentros = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/admin/centros_comerciales",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCentrosComerciales(response.data);
      } catch (error) {
        console.error("Error al obtener centros comerciales", error);
      }
    };
    fetchCentros();
  }, [token]);

  // Manejar el cambio de selección de centro comercial
  const handleCentroChange = async (event) => {
    const centroId = event.target.value;
    setSelectedCentro(centroId);

    try {
      // Obtener los locales del centro comercial seleccionado
      const response = await axios.get(
        `http://127.0.0.1:8000/admin/centros_comerciales/${centroId}/locales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocales(response.data);
      setUpdatedLocales(response.data);
    } catch (error) {
      console.error("Error al obtener locales", error);
    }
  };

  // Función para calcular la sumatoria de M3
  const sumatoriaM3 = (locales) => {
    return locales.reduce((sum, local) => sum + (local.m3 || 0), 0);
  };

  // Calcular totales de Lectura Inicial, Lectura Final, M3, Litros y Precio
  const calcularTotales = () => {
    const totalLecturaInicial = updatedLocales.reduce(
      (sum, local) => sum + (parseFloat(local.lecturaInicial) || 0),
      0
    );
    const totalLecturaFinal = updatedLocales.reduce(
      (sum, local) => sum + (parseFloat(local.lecturaFinal) || 0),
      0
    );
    const totalM3 = updatedLocales.reduce(
      (sum, local) => sum + (local.m3 || 0),
      0
    );
    const totalLitros = updatedLocales.reduce(
      (sum, local) => sum + (local.litros || 0),
      0
    );
    const totalPrecio = updatedLocales.reduce(
      (sum, local) => sum + (local.precioPorLocal || 0),
      0
    );

    return {
      totalLecturaInicial,
      totalLecturaFinal,
      totalM3,
      totalLitros,
      totalPrecio,
    };
  };

  // Manejar cambios en las lecturas iniciales y finales
  const handleChange = (index, field, value) => {
    const newLocales = [...updatedLocales];
    newLocales[index][field] = value;

    // Recalcular M3 y litros
    if (field === "lecturaInicial" || field === "lecturaFinal") {
      const lecturaInicial = parseFloat(newLocales[index].lecturaInicial || 0);
      const lecturaFinal = parseFloat(newLocales[index].lecturaFinal || 0);
      newLocales[index].m3 = Math.max(lecturaFinal - lecturaInicial, 0); // Evitar negativos
      const totalM3 = sumatoriaM3(newLocales);
      newLocales[index].litros =
        totalM3 > 0 ? (newLocales[index].m3 * litrosDespachados) / totalM3 : 0;
      newLocales[index].precioPorLocal =
        newLocales[index].litros * precioPorLitro; // Calcular precio
    }

    setUpdatedLocales(newLocales);
  };

  // Enviar cálculos al backend
  const handleSubmit = () => {
    axios
      .post(
        "http://127.0.0.1:8000/admin/calculo_litros",
        {
          locales: updatedLocales,
          litrosDespachados, // Cantidad de litros despachados al centro comercial
          precioPorLitro, // Precio por litro proporcionado por el usuario
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert(response.data.message);
      });
  };

  const {
    totalLecturaInicial,
    totalLecturaFinal,
    totalM3,
    totalLitros,
    totalPrecio,
  } = calcularTotales(); // Calcular los totales

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Selecciona un Centro Comercial</InputLabel>
        <Select value={selectedCentro} onChange={handleCentroChange}>
          {centrosComerciales.map((centro) => (
            <MenuItem key={centro.id} value={centro.id}>
              {centro.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {locales.length > 0 && (
        <>
          <TextField
            label="Litros Despachados"
            type="number"
            value={litrosDespachados}
            onChange={(e) => setLitrosDespachados(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Precio por Litro"
            type="number"
            value={precioPorLitro}
            onChange={(e) => setPrecioPorLitro(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Local</TableCell>
                <TableCell>Lectura Inicial</TableCell>
                <TableCell>Lectura Final</TableCell>
                <TableCell>M3</TableCell>
                <TableCell>Litros</TableCell>
                <TableCell>Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedLocales.map((local, index) => (
                <TableRow key={local.id}>
                  <TableCell>{local.nombre}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={local.lecturaInicial || ""}
                      onChange={(e) =>
                        handleChange(index, "lecturaInicial", e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={local.lecturaFinal || ""}
                      onChange={(e) =>
                        handleChange(index, "lecturaFinal", e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{local.m3 || 0}</TableCell>
                  <TableCell>{local.litros || 0}</TableCell>
                  <TableCell>{local.precioPorLocal || 0}</TableCell>
                </TableRow>
              ))}

              {/* Fila de totales */}
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Totales</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  {totalLecturaInicial}
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  {totalLecturaFinal}
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>{totalM3}</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  {totalLitros}
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  {totalPrecio}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Guardar Cálculos
          </Button>
        </>
      )}
    </div>
  );
};

export default CalculoActual;
