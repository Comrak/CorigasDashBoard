import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";

const AddLocal = ({ centroComercialId, token, onAdd }) => {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !codigo) {
      setError("Por favor, rellena todos los campos");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/admin/centros_comerciales/${centroComercialId}/locales`,
        { nombre, codigo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onAdd(response.data); // Actualiza la lista de locales
      setNombre(""); // Limpia el formulario
      setCodigo("");
      setError("");
    } catch (err) {
      setError("Hubo un error al añadir el local");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Nombre del Local"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Código del Local"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button type="submit" variant="contained" color="primary">
        Añadir Local
      </Button>
    </form>
  );
};

export default AddLocal;
