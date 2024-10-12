import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCentroComercial from "./AddCentroComercial"; // Importamos el componente de agregar centro comercial
import axios from "axios";

const CentrosComerciales = ({ token }) => {
  const navigate = useNavigate();
  const [centrosComerciales, setCentrosComerciales] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Estado para controlar si mostramos el formulario

  useEffect(() => {
    // Lógica para cargar centros comerciales desde la API
    const fetchCentrosComerciales = async () => {
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
      } catch (err) {
        console.error("Error al obtener los centros comerciales", err);
      }
    };

    fetchCentrosComerciales();
  }, [token]);

  const handleAddCentroComercial = (nuevoCentro) => {
    // Añadir el nuevo centro comercial a la lista
    setCentrosComerciales((prevCentros) => [...prevCentros, nuevoCentro]);
    setMostrarFormulario(false); // Ocultar el formulario después de añadir
  };
  const handleViewDetails = (id) => {
    navigate(`/dashboard/centros-comerciales/${id}`);
  };
  const handleCancel = () => {
    setMostrarFormulario(false); // Oculta el formulario
  };
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Centros Comerciales
      </Typography>
      <Button
        variant="contained"
        color={mostrarFormulario ? "secondary" : "primary"} // Cambia el color a rojo si el formulario está visible
        onClick={() => setMostrarFormulario(!mostrarFormulario)} // Cambia el estado del formulario
        style={{ marginBottom: "20px" }}
      >
        {mostrarFormulario ? "Cancelar" : "Añadir Nuevo Centro Comercial"}{" "}
        {/* Cambia el texto del botón */}
      </Button>

      {mostrarFormulario && (
        <AddCentroComercial onAdd={handleAddCentroComercial} token={token} />
      )}
      <Grid2 container spacing={3}>
        {centrosComerciales.map((centro, index) => (
          <Grid2 item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5">{centro.nombre}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Ubicación: {centro.ubicacion}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewDetails(centro.id)}
                  style={{ marginTop: "10px" }}
                >
                  Ver detalles
                </Button>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
};

export default CentrosComerciales;
