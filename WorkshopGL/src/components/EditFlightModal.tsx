import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Stack, MenuItem 
} from '@mui/material';

interface Flight {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  status: string;
}

interface EditFlightModalProps {
  flight: Flight | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFlight: Flight) => void;
}

const EditFlightModal = ({ flight, isOpen, onClose, onSave }: EditFlightModalProps) => {
  // Inițializăm starea direct cu datele primite. 
  // Datorită 'key' din Dashboard, acest rând se execută proaspăt la fiecare deschidere.
  const [formData, setFormData] = useState<Flight | null>(flight);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  // Nu randăm nimic dacă modalul e închis sau nu avem date
  if (!isOpen || !flight || !formData) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' ,color: '#000000'}}>
        Editează Zborul: {formData.flightNumber}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField label="Origine" name="origin" value={formData.origin} onChange={handleChange} fullWidth />
          <TextField label="Destinație" name="destination" value={formData.destination} onChange={handleChange} fullWidth />
          <TextField 
            label="Data Plecării" 
            name="departureDate" 
            type="date" 
            value={formData.departureDate} 
            onChange={handleChange} 
            fullWidth 
            slotProps={{ inputLabel: { shrink: true } }} 
          />
          <TextField select label="Status" name="status" value={formData.status} onChange={handleChange} fullWidth>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Delayed">Delayed</MenuItem>
            <MenuItem value="Boarding">Boarding</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Anulează</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Salvează Modificările
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFlightModal;