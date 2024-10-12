import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Card, CardContent, Box } from "@mui/material";
import axios from "axios";
import AddLocal from "./AddLocal";

const CentroComercialDetails = ({ token }) => {
  const { id } = useParams();
  const [centro, setCentro] = useState(null);
  const [locales, setLocales] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Estado para controlar si mostramos el formulario

  useEffect(() => {
    const fetchCentroDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/admin/centros_comerciales/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCentro(response.data);
        setLocales(response.data.locales);
      } catch (error) {
        console.error("Error fetching centro comercial details", error);
      }
    };

    fetchCentroDetails();
  }, [id, token]);

  const handleAddLocal = (nuevoLocal) => {
    setLocales([...locales, nuevoLocal]); // Actualiza la lista de locales
  };

  if (!centro) return <p>Cargando detalles del centro comercial...</p>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">{centro.nombre}</Typography>
        <Typography variant="body1">Ubicación: {centro.ubicacion}</Typography>
        <Typography variant="body1">
          Capacidad Tanque: {centro.capacidad_litros}
        </Typography>
        <Typography variant="body1">Detalles: {centro.detalle}</Typography>
        <Typography variant="body1">
          Persona de contacto: {centro.persona_contacto}
        </Typography>
        <Typography variant="body1">
          Email persona de contacto: {centro.mail_contacto}
        </Typography>
        <Typography variant="body1">
          Telefono persona de contacto: {centro.telefono_contacto}
        </Typography>
        <Typography variant="body1">
          Fecha de registro: {centro.fecha_registro}
        </Typography>

        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Locales Asociados:
        </Typography>

        {locales.map((local) => (
          <Card ba>
            <CardContent>
              <Typography key={local.id}>
                {local.nombre} - Código: {local.codigo}
              </Typography>
            </CardContent>
          </Card>
        ))}
        <Button
          variant="contained"
          color={mostrarFormulario ? "secondary" : "primary"} // Cambia el color a rojo si el formulario está visible
          onClick={() => setMostrarFormulario(!mostrarFormulario)} // Cambia el estado del formulario
          style={{ marginBottom: "20px" }}
        >
          {mostrarFormulario ? "Cancelar" : "Añadir Nuevo Local"}{" "}
          {/* Cambia el texto del botón */}
        </Button>
        {/* Formulario para añadir local */}

        {mostrarFormulario && (
          <AddLocal
            centroComercialId={id}
            token={token}
            onAdd={handleAddLocal}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CentroComercialDetails;
