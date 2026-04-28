import React, { useState } from 'react';
import { 
  Container, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Box, Chip 
} from '@mui/material';
import EditFlightModal from '../../components/EditFlightModal';

interface Flight {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  status: string;
}

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  
  const [flights, setFlights] = useState<Flight[]>([
    { id: 1, flightNumber: 'RO-2024', origin: 'București (OTP)', destination: 'Londra (LHR)', departureDate: '2026-05-10', departureTime: '08:00', status: 'Scheduled' },
    { id: 2, flightNumber: 'AF-1020', origin: 'Paris (CDG)', destination: 'New York (JFK)', departureDate: '2026-05-12', departureTime: '14:30', status: 'Delayed' },
    { id: 3, flightNumber: 'LH-4456', origin: 'Munchen (MUC)', destination: 'Tokyo (HND)', departureDate: '2026-05-15', departureTime: '22:15', status: 'Boarding' },
  ]);

  const handleOpenEdit = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedFlight: Flight) => {
    setFlights(flights.map(f => f.id === updatedFlight.id ? updatedFlight : f));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          ✈️ Panou Control Zboruri
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={6}>
        <Table>
          <TableHead sx={{ bgcolor: '#1a237e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nr. Zbor</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ruta</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data & Ora</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Acțiuni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((f) => (
              <TableRow key={f.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{f.flightNumber}</TableCell>
                <TableCell>{f.origin} ➔ {f.destination}</TableCell>
                <TableCell>{f.departureDate} | {f.departureTime}</TableCell>
                <TableCell>
                  <Chip 
                    label={f.status} 
                    color={f.status === 'Delayed' ? 'error' : f.status === 'Boarding' ? 'success' : 'primary'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <Button variant="contained" size="small" onClick={() => handleOpenEdit(f)}>
                    Editează
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CHEIA (key) forțează modalul să se reseteze curat la fiecare zbor nou */}
      <EditFlightModal 
        key={selectedFlight?.id || 'none'} 
        isOpen={isModalOpen} 
        flight={selectedFlight} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleUpdate} 
      />
    </Container>
  );
};

export default Dashboard;