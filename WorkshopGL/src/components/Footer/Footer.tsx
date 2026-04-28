import { Box, Typography, Button, Stack } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "#233f91",
        color: "white",
        px: 4,
        py: 2,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Stack>
        <FlightIcon />
        <Typography>FlightHub</Typography>
      </Stack>

      <Typography sx={{ mx: "auto" }}>
        © {new Date().getFullYear()}
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button component={NavLink} to="/" size="small" startIcon={<FlightIcon />} sx={{ color: "white" }}>
          Flights
        </Button>

        <Button component={NavLink} to="/cities" size="small" startIcon={<LocationCityIcon />} sx={{ color: "white" }}>
          Cities
        </Button>
      </Stack>
    </Box>
  );
};