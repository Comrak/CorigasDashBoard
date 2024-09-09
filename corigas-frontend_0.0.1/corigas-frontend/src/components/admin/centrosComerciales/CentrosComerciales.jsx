import React from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CentrosComerciales = ({ centros }) => {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/dashboard/centros-comerciales/${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Centros Comerciales
      </Typography>

      <Grid container spacing={3}>
        {centros.map((centro, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CentrosComerciales;
