import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FlightIcon from '@mui/icons-material/Flight';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink } from 'react-router-dom';

export const drawerWidth = 240;

export const Sidebar = () => {
    const items = [
        { name: "Flights", icon: <FlightIcon />, path: "/" },
        { name: "Cities", icon: <LocationCityIcon />, path: "/cities" }
    ]

    return(
        <Drawer
            sx={{
             width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                bgcolor: "#233f91",
                color: "white",
                },
            }}
            variant="permanent"
        >
            <Box sx={{ p: 3, display: "flex", flexDirection: "row", gap: 1, alignItems: "center"}}>
                <FlightIcon sx={{ fontSize: 40 }} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h5">
                        FlightHub
                    </Typography>
                    <Typography variant="body2">Management System</Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

            <List sx={{ flexGrow: 1, mt: 2 }}>
                {items.map((item) => (
                <ListItem key={item.name} disablePadding>
                    <ListItemButton
                    component={NavLink}
                    to={item.path}
                    sx={{
                        color: "white",
                        px: 3,
                        py: 1.5,
                        "&.active": {
                            bgcolor: "rgba(255,255,255,0.15)",
                        },
                        "&:hover": {
                            bgcolor: "rgba(255,255,255,0.10)",
                        },
                    }}
                    >
                    <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
        </Drawer>          
    )
}