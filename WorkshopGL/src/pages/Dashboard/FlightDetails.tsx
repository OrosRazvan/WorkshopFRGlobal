import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Box,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const flight = {
    id: id,
    number: "RO123",
    airline: "TAROM",
    departure: "București (OTP)",
    arrival: "Londra (LHR)",
    time: "14:30",
    status: "La timp",
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/ListaZboruri")}
        sx={{ mb: 2 }}
      >
        Înapoi la Zboruri
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header - Înlocuit div cu Box (flexbox) */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <FlightTakeoffIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Detalii Zbor {flight.number}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Info Grid - Replaced with Box-based grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Companie Aeriană
            </Typography>
            <Typography variant="h6">{flight.airline}</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Status
            </Typography>
            <Typography variant="h6" color="success.main">
              {flight.status}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Plecare
            </Typography>
            <Typography variant="h6">{flight.departure}</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Sosire
            </Typography>
            <Typography variant="h6">{flight.arrival}</Typography>
          </Box>

          <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
            <Typography variant="overline" color="text.secondary">
              Ora decolare
            </Typography>
            <Typography variant="h6">{flight.time}</Typography>
          </Box>
        </Box>

        {/* Footer Actions - Înlocuit div cu Box */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" size="large" color="primary">
            Rezervă Loc
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FlightDetails;
