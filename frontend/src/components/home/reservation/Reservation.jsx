import React, { useState } from 'react';
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Container,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import resImage from "../../../assets/Reservation-bg-1.jpeg";
import { toast } from 'react-toastify';

const Reservation = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phoneNo: '',
    date: '',
    time: '',
    noOfPeople: '',
    note: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!user.name) newErrors.name = 'Name is required';
    if (!user.email) newErrors.email = 'Email is required';
    if (!user.phoneNo) newErrors.phoneNo = 'Phone number is required';
    if (!user.date) newErrors.date = 'Date is required';
    if (!user.time) newErrors.time = 'Time is required';
    if (!user.noOfPeople) newErrors.noOfPeople = 'Guest count is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/v1/user/postReservations', user);
      toast.success('Reservation submitted successfully!');
      setUser({
        name: '',
        email: '',
        phoneNo: '',
        date: '',
        time: '',
        noOfPeople: '',
        note: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reservation');
    }
  };

  const commonFieldStyles = {
    borderRadius: 0,
    width: "270px",
    margin: "10px 0",
    "& .MuiInputBase-root": {
      backgroundColor: "#161616",
      color: "#909090",
      borderRadius: 0,
      border: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiInputBase-root:hover .MuiSvgIcon-root": {
      color: "#6F4E34",
    },
    "& .Mui-focused .MuiSvgIcon-root": {
      color: "#6F4E34",
    },
  };

  const iconBox = (icon) => (
    <InputAdornment position="start">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          pr: 1,
          borderRight: '1px solid #ccc',
        }}
      >
        {icon}
      </Box>
    </InputAdornment>
  );

  return (
    <Box>
      <Grid container>
        <Grid item size={{ xs: 12, sm: 6, md: 6 }} sx={{ bgcolor: '#090909' }}>
          <Container >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                py: 4,
                marginBottom: "5%"
              }}
            >
              <Typography
                variant="h3"
                fontFamily="'Rancho', cursive"
                color="white"
                sx={{
                  position: 'relative',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                  wordBreak: 'break-word',
                  textAlign: { xs: 'center', sm: 'left' },
                  "&::before": {
                    content: "''",
                    position: 'absolute',
                    borderBottom: '2px solid #6F4E37',
                    width: '50px',
                    top: '35px',
                    left: '-60px',
                  },
                  "&::after": {
                    content: "''",
                    position: 'absolute',
                    borderBottom: '2px solid #6F4E37',
                    width: '50px',
                    top: '35px',
                    right: '-60px',
                  },

                }}
              >
                Make A Reservation
              </Typography>
              <Typography variant='h6' color='white' textAlign={'center'}>
                You can call us directly at <span style={{ color: '#6F4E37' }}>225-88888</span>
              </Typography>
            </Box>
            <Box
              component="form"
              onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ width: '100%', marginLeft: "40px" }}>
                {/* First Column */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    placeholder="Full Name"
                    autoComplete='off'
                    value={user.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{ startAdornment: iconBox(<PersonIcon sx={{ color: "#909090" }} />) }}
                    sx={{ ...commonFieldStyles, width: '100%' }}
                    fullWidth
                  />
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      name="phoneNo"
                      autoComplete='off'

                      placeholder="Phone Number"
                      value={user.phoneNo}
                      onChange={handleChange}
                      error={!!errors.phoneNo}
                      helperText={errors.phoneNo}
                      InputProps={{ startAdornment: iconBox(<PhoneIcon sx={{ color: "#909090" }} />) }}
                      sx={{ ...commonFieldStyles, width: '100%' }}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      name="date"
                      type="date"
                      value={user.date}
                      onChange={handleChange}
                      error={!!errors.date}
                      helperText={errors.date}
                      InputProps={{ startAdornment: iconBox(<CalendarTodayIcon sx={{ color: "#909090" }} />) }}
                      sx={{ ...commonFieldStyles, width: '100%' }}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Grid>

                {/* Second Column */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    placeholder="Email"
                    autoComplete='off'
                    value={user.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{ startAdornment: iconBox(<EmailIcon sx={{ color: "#909090" }} />) }}
                    sx={{ ...commonFieldStyles, width: '100%' }}
                    fullWidth
                  />
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      name="noOfPeople"
                      select
                      value={user.noOfPeople}
                      onChange={handleChange}
                      error={!!errors.noOfPeople}
                      helperText={errors.noOfPeople}
                      InputProps={{ startAdornment: iconBox(<PeopleIcon sx={{ color: "#909090" }} />) }}
                      sx={{ ...commonFieldStyles, width: '100%' }}
                      fullWidth
                    >
                      {[2, 4, 6, 8, 10, 12].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option} {option === 1 ? 'person' : 'people'}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      name="time"
                      select
                      value={user.time}
                      onChange={handleChange}
                      error={!!errors.time}
                      helperText={errors.time}
                      InputProps={{ startAdornment: iconBox(<AccessTimeIcon sx={{ color: "#909090" }} />) }}
                      sx={{ ...commonFieldStyles, width: '100%' }}
                      fullWidth
                    >
                      {[
                        "07:00 AM", "07:30 AM",
                        "08:00 AM", "08:30 AM",
                        "09:00 AM", "09:30 AM",
                        "10:00 AM", "10:30 AM",
                        "11:00 AM", "11:30 AM",
                        "12:00 PM", "12:30 PM",
                        "01:00 PM", "01:30 PM",
                        "02:00 PM", "02:30 PM",
                        "03:00 PM", "03:30 PM",
                        "04:00 PM", "04:30 PM",
                        "05:00 PM", "05:30 PM",
                        "06:00 PM", "06:30 PM",
                        "07:00 PM", "07:30 PM",
                        "08:00 PM", "08:30 PM",
                        "09:00 PM", "09:30 PM",
                        "10:00 PM", "10:30 PM",
                        "11:00 PM", "11:30 PM",
                        "12:00 AM"
                      ].map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <TextField
                  name="note"
                  placeholder="Additional Note (optional)"
                  multiline
                  minRows={3}
                  value={user.note}
                  onChange={handleChange}
                  sx={{
                    borderRadius: 0,
                    width: "85%",
                    margin: "10px 0",
                    "& .MuiInputBase-root": {
                      backgroundColor: "#161616",
                      color: "#909090",
                      borderRadius: 0,
                      border: "none",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiInputBase-root:hover .MuiSvgIcon-root": {
                      color: "#6F4E34",
                    },
                    "& .Mui-focused .MuiSvgIcon-root": {
                      color: "#6F4E34",
                    },
                  }}
                />

              </Grid>
              <Button
                type='submit'
                sx={{
                  bgcolor: '#6F4E34',
                  color: 'white',
                  fontFamily: "'Rancho', cursive",
                  mt: 4,
                  width: { xs: '100%', sm: 200, md: 230 },
                  fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                  display: 'block',
                  mx: 'auto',
                  py: { xs: 1.2, sm: 1.5 },
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(111, 78, 52, 0.15)',
                  '&:hover': {
                    bgcolor: '#5a3e2a'
                  }
                }}
              >
                Reserve
              </Button>
            </Box>
          </Container>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
          <Box
            sx={{
              width: '100%',
              height: { xs: '50vh', md: '120vh' }, // Adjust height for different screens
              overflow: 'hidden',
              display: 'flex'
            }}
          >
            <img
              src={resImage}
              alt="Restaurant reservation"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // Changed from 'contain' to 'cover' to fill space
                objectPosition: 'center'
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reservation;
