// src/pages/ListaZboruri/ListaZboruri.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import type { AirplaneInformation } from '../../types/AirplaneInformation';

export const ListaZboruri: React.FC = () => {
  const [flights, setFlights] = useState<AirplaneInformation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [airline, setAirline] = useState<string>('');


  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* --- HEADER --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#233f91', mb: 1 }}>
              Flight Management
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
              Browse and manage available flights
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ bgcolor: '#233f91', color: 'white', textTransform: 'none' }}
            startIcon={<AddIcon />}
          >
            Add New Flight
          </Button>
        </Box>

        {/* --- SEARCH & FILTERS --- */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search flights, cities, or flight numbers..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                }
              }}
            />
            <Button
              variant="contained"
              sx={{ bgcolor: '#233f91' }}
              startIcon={<FilterListIcon />}
            >
              Filters
            </Button>
          </Box>

          {/* Filter Grid */}
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(4, minmax(0, 1fr))',
              },
            }}
          >
            <Box>
              <TextField
                fullWidth
                label="Departure Date"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                variant="outlined"
                size="small"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Return Date"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                variant="outlined"
                size="small"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </Box>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel id="airline-label">Airline</InputLabel>
                <Select
                  labelId="airline-label"
                  id="airline-select"
                  value={airline}
                  label="Airline"
                  onChange={(e) => setAirline(e.target.value as string)}
                >
                  <MenuItem value="">All Airlines</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>

        {/* --- FLIGHT LIST (State handling) --- */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!isLoading && !error && (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
              },
            }}
          >
            {flights.map((flight) => (
              <Box key={flight.id}>
                <Card sx={{ height: '100%', boxShadow: 1, '&:hover': { boxShadow: 3 } }}>
                  <CardContent>
                    {/* Header: Flight Number and Price */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#233f91' }}>
                          {flight.airplaneName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {flight.arrivalDate}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#233f91' }}>
                          ${flight.cost}
                        </Typography>
                        <Chip
                          label={flight.status}
                          size="small"
                          sx={{
                            mt: 1,
                            bgcolor: '#e8f5e9',
                            color: '#2e7d32',
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Route */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          From
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {flight.direction} ({flight.arrivalDate})
                        </Typography>
                      </Box>
                      <FlightTakeoffIcon sx={{ color: '#999', flex: 'shrink' }} />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          To
                        </Typography>
                        
                      </Box>
                    </Box>

                    {/* Date and Time */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                      
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        🕒 {flight.duration} 
                      </Typography>
                    </Box>

                    {/* Action Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ bgcolor: '#233f91', textTransform: 'none' }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

