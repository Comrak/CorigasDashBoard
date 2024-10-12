import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";

const AddLocal = ({ centroComercialId, token, onAdd }) => {
  const [nombre, setNombre] = useState("");
  const [codigoA2, setCodigoA2] = useState("");
  const [codigo, setCodigo] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [personaContacto, setPersonaContacto] = useState("");
  const [mailContacto, setMailContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !codigo) {
      setError("Por favor, rellena todos los campos");
      return;
    }
    const status = 1; // O true si prefieres manejarlo así
    const fecha_registro = new Date().toISOString(); // Fecha actual en formato ISO (datetime)
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/admin/centros_comerciales/${centroComercialId}/locales`,
        {
          nombre,
          codigo,
          codigoA2,
          razon_social: razonSocial,
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
      onAdd(response.data); // Actualiza la lista de locales
      setNombre(""); // Limpia el formulario
      setCodigoA2("");
      setCodigo("");
      setRazonSocial("");
      setPersonaContacto("");
      setMailContacto("");
      setTelefonoContacto("");
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
      <TextField
        label="Código del A2"
        value={codigoA2}
        onChange={(e) => setCodigoA2(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Razon social del Local"
        value={razonSocial}
        onChange={(e) => setRazonSocial(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Persona de contacto"
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
        Añadir Local
      </Button>
    </form>
  );
};

export default AddLocal;
