import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";

const AddCentroComercial = ({ onAdd, token }) => {
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !ubicacion) {
      setError("Por favor, rellena todos los campos");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/centros_comerciales",
        { nombre, ubicacion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onAdd(response.data); // Llama a la función onAdd con el nuevo centro comercial
      setNombre(""); // Limpiar el formulario
      setUbicacion("");
      setError("");
    } catch (err) {
      setError("Hubo un error al añadir el centro comercial");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <TextField
        label="Nombre del Centro Comercial"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Ubicación"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button type="submit" variant="contained" color="primary">
        Añadir Centro Comercial
      </Button>
    </form>
  );
};

export default AddCentroComercial;
