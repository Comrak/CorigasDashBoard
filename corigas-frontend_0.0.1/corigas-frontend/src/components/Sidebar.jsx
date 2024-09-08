import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import CalculateIcon from "@mui/icons-material/Calculate";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ onSelectSection }) => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem button onClick={() => onSelectSection("home")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItem>
        <ListItem button onClick={() => onSelectSection("centros")}>
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="Centros Comerciales" />
        </ListItem>
        <ListItem button onClick={() => onSelectSection("calculos")}>
          <ListItemIcon>
            <CalculateIcon />
          </ListItemIcon>
          <ListItemText primary="Cálculos de GLP" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
