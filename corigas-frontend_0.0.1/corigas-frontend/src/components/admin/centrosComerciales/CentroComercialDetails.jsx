import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Card, CardContent } from "@mui/material";
import axios from "axios";
import AddLocal from "./AddLocal";

const CentroComercialDetails = ({ token }) => {
  const { id } = useParams();
  const [centro, setCentro] = useState(null);
  const [locales, setLocales] = useState([]);

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

        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Locales Asociados
        </Typography>
        {locales.map((local) => (
          <Typography key={local.id}>
            {local.nombre} - Código: {local.codigo}
          </Typography>
        ))}

        {/* Formulario para añadir local */}
        <AddLocal centroComercialId={id} token={token} onAdd={handleAddLocal} />
      </CardContent>
    </Card>
  );
};

export default CentroComercialDetails;
