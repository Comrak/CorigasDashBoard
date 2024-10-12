import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ExitToApp from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { useNavigate } from "react-router-dom";

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;

const Sidebar = ({ onSelectSection }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Botón de apertura/cierre del Drawer */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          top: 10,
          left: open ? drawerWidthOpen + 10 : drawerWidthClosed + 10,
          zIndex: 1300,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer que se colapsa */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{ width: open ? drawerWidthOpen : drawerWidthClosed }}
      >
        <List>
          {/* Home - Redirige a HomeAdmin */}
          <ListItem button onClick={() => navigate("/dashboard/home")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItem>

          {/* Centros Comerciales - Redirige al listado */}
          <ListItem
            button
            onClick={() => navigate("/dashboard/centros-comerciales")}
          >
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Centros Comerciales" />}
          </ListItem>

          {/* Calculo de litros */}
          <ListItem
            button
            onClick={() => navigate("/dashboard/calculo-actual")}
          >
            <ListItemIcon>
              <FormatIndentIncreaseIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Calculo de litros" />}
          </ListItem>

          {/* Historico de litros */}
          <ListItem
            button
            onClick={() => navigate("/dashboard/calculo-anteriores")}
          >
            <ListItemIcon>
              <WorkHistoryIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Historico calculo de litros" />}
          </ListItem>

          {/* Botón para cerrar sesión */}
          <ListItem button onClick={() => navigate("/")}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            {open && <ListItemText primary="Salir" />}
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
