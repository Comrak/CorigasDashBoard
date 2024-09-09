import React from "react";
import { Typography } from "@mui/material";

const Home = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">Bienvenido, Administrador</Typography>
      <Typography variant="body1">
        Aquí puedes gestionar todos los aspectos de Corigas, como la
        administración de los centros comerciales, cálculos de GLP, y más.
      </Typography>
    </div>
  );
};

export default Home;
