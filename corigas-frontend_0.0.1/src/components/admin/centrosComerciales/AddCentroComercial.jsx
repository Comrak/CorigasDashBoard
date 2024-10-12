import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";

const AddCentroComercial = ({ onAdd, token }) => {
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [capacidadLitros, setCapacidadLitros] = useState("");
  const [detalle, setDetalle] = useState("");
  const [personaContacto, setPersonaContacto] = useState("");
  const [mailContacto, setMailContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !nombre ||
      !ubicacion ||
      !capacidadLitros
      //|| !detalle || !personaContacto || !mailContacto || !telefonoContacto
    ) {
      setError("Por favor, rellena todos los campos");
      return;
    }
    // Valor por defecto para status y fecha_registro
    const status = 1; // O true si prefieres manejarlo así
    const fecha_registro = new Date().toISOString(); // Fecha actual en formato ISO (datetime)
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/centros_comerciales",
        {
          nombre,
          ubicacion,
          capacidad_litros: parseFloat(capacidadLitros), // Asegúrate de enviar como float
          detalle,
          persona_contacto: personaContacto,
          mail_contacto: mailContacto,
          telefono_contacto: telefonoContacto,
          status, // Asignar status por defecto
          fecha_registro, // Asignar fecha de registro actual
        },
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
      setCapacidadLitros("");
      setDetalle("");
      setPersonaContacto("");
      setMailContacto("");
      setTelefonoContacto("");
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
      <TextField
        label="Capacidad tanque (litros)"
        value={capacidadLitros}
        type="number"
        onChange={(e) => setCapacidadLitros(e.target.value)} // No convertir aquí, manejamos la conversión más tarde
        fullWidth
        margin="normal"
      />
      <TextField
        label="Detalle"
        value={detalle}
        onChange={(e) => setDetalle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nombre de contacto"
        value={personaContacto}
        onChange={(e) => setPersonaContacto(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email de contacto"
        value={mailContacto}
        onChange={(e) => setMailContacto(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Telefono de contacto"
        value={telefonoContacto}
        onChange={(e) => setTelefonoContacto(e.target.value)}
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
