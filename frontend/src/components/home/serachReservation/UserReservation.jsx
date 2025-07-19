import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';

const UserReservation = () => {
  const [reservationID, setReservationID] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!reservationID.trim()) {
      setError('Please enter a reservation ID');
      return;
    }

    setLoading(true);
    setError('');
    setReservation(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/user/yourReservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationID }),
      });

      const data = await response.json();

      if (data.success) {
        setReservation(data.reservation);
      } else {
        setError(data.message || 'Reservation not found');
      }
    } catch (error) {
      setError('Failed to fetch reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          color="#6F4E37"
          fontFamily="'Rancho', cursive"
          sx={{
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Find Your Reservation
        </Typography>
        <Typography
          variant="h6"
          color="#8B7355"
          sx={{ mb: 4, opacity: 0.8 }}
        >
          Enter your reservation ID to check your booking status
        </Typography>
      </Box>

      {/* Glass Effect Search Field */}
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            zIndex: -1,
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Reservation ID"
            value={reservationID}
            onChange={(e) => setReservationID(e.target.value)}
            variant="outlined"
            placeholder="Enter your reservation ID"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#6F4E37',
                fontWeight: 500,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            sx={{
              background: 'linear-gradient(135deg, #6F4E37 0%, #8B7355 100%)',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(111, 78, 55, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8B7355 0%, #6F4E37 100%)',
                boxShadow: '0 6px 20px rgba(111, 78, 55, 0.4)',
              },
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Reservation Details */}
      {reservation && (
        <Card
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6F4E37 0%, #8B7355 100%)',
              p: 3,
              color: 'white',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Reservation Details
            </Typography>
            <Chip
              label={reservation.status}
              color={getStatusColor(reservation.status)}
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RestaurantIcon sx={{ color: '#6F4E37', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Reservation ID
                    </Typography>
                    <Typography variant="h6" color="#6F4E37" fontWeight={600}>
                      {reservation.reservationID}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: '#6F4E37', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="h6" color="#6F4E37" fontWeight={600}>
                      {reservation.name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ color: '#6F4E37', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="h6" color="#6F4E37" fontWeight={600}>
                      {reservation.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ color: '#6F4E37', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="h6" color="#6F4E37" fontWeight={600}>
                      {reservation.phoneNo}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ color: '#6F4E37', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Date & Time
                    </Typography>
                    <Typography variant="h6" color="#6F4E37" fontWeight={600}>
                      {formatDate(reservation.date)} at {reservation.time}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: '#6F4E37', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Number of People
                    </Typography>
                    <Typography variant="h6" color="#6F4E37" fontWeight={600}>
                      {reservation.noOfPeople} {reservation.noOfPeople === 1 ? 'person' : 'people'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ color: '#6F4E37', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="h6" color="#6F4E37" fontWeight={600}>
                      {reservation.duration} hours
                    </Typography>
                  </Box>
                </Box>

                {reservation.message && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <MessageIcon sx={{ color: '#6F4E37', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Special Request
                      </Typography>
                      <Typography variant="body1" color="#6F4E37">
                        {reservation.message}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default UserReservation;