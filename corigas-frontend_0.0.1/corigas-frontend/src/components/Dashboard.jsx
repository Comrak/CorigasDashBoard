import { Grid2, Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";

const Dashboard = ({ centrosComerciales }) => {
  return (
    <Grid2 container spacing={3} sx={{ padding: 3 }}>
      {centrosComerciales.map((centro) => (
        <Grid2 item xs={12} sm={6} md={4} key={centro.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {centro.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ubicación: {centro.ubicacion}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};

Dashboard.propTypes = {
  centrosComerciales: PropTypes.array.isRequired,
};

export default Dashboard;
