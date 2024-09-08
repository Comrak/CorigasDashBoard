import { Button, Typography, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Bienvenido a Corigas S.A.
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Líderes en distribución y suministro de gas GLP para centros
          comerciales y clientes domésticos.
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          Nos especializamos en el suministro seguro y eficiente de gas GLP.
          Nuestro equipo profesional está dedicado a brindar un servicio de
          calidad para satisfacer las necesidades energéticas de nuestros
          clientes.
        </Typography>

        <Button
          component={Link}
          to="/Login"
          variant="contained"
          color="primary"
          sx={{ marginTop: "2rem" }}
        >
          Acceso para Administradores
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
