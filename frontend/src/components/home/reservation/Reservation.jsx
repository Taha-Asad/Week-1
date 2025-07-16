import React, { useState } from 'react';
import {
    Grid,
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
} from '@mui/material';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import resImage from "../../../assets/Reservation-bg-1.jpeg";

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
            const res = await axios.post(
                'http://localhost:5000/api/v1/user/reservation',
                user
            );
            alert('Reservation submitted successfully!');
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
            alert(error.response?.data?.message || 'Failed to send reservation');
        }
    };

    const commonFieldStyles = {
        width: { xs: '100%', sm: '250px' }, // Responsive width
        borderRadius: 0,
        "& .MuiInputBase-root": {
            backgroundColor: "#161616",
            color: "#909090",
            boxShadow: "none",
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
                <Grid item xs={12} md={6} bgcolor={'#090909'}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 4,
                        }}
                    >
                        <Typography
                            variant="h3"
                            fontFamily="'Rancho', cursive"
                            color="white"
                            sx={{
                                position: 'relative',
                                mb: 1,
                                "&::before": {
                                    content: "''",
                                    position: 'absolute',
                                    borderBottom: '2px solid #6F4E37',
                                    width: '50px',
                                    top: '35px',
                                    left: { xs: '-30px', sm: '-55px' },
                                },
                                "&::after": {
                                    content: "''",
                                    position: 'absolute',
                                    borderBottom: '2px solid #6F4E37',
                                    width: '50px',
                                    top: '35px',
                                    right: { xs: '-30px', sm: '-55px' },
                                },
                            }}
                        >
                            Make A Reservation
                        </Typography>
                        <Typography variant="h6" color="white">
                            You can call us directly at{' '}
                            <span style={{ color: '#6F4E37' }}>225-88888</span>
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            px: { xs: 2, sm: 4 },
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Grid container spacing={2} sx={{ width: '100%', maxWidth: '600px' }}>
                            {/* First Column */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    placeholder="Full Name"
                                    value={user.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    InputProps={{
                                        startAdornment: iconBox(<PersonIcon sx={{ color: "#909090" }} />),
                                    }}
                                    sx={commonFieldStyles}
                                    fullWidth
                                />
                            </Grid>

                            {/* Second Column */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="email"
                                    placeholder="Email"
                                    value={user.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: iconBox(<EmailIcon sx={{ color: "#909090" }} />),
                                    }}
                                    sx={commonFieldStyles}
                                    fullWidth
                                />
                            </Grid>

                            {/* First Column */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="phoneNo"
                                    placeholder="Phone Number"
                                    value={user.phoneNo}
                                    onChange={handleChange}
                                    error={!!errors.phoneNo}
                                    helperText={errors.phoneNo}
                                    InputProps={{
                                        startAdornment: iconBox(<PhoneIcon sx={{ color: "#909090" }} />),
                                    }}
                                    sx={commonFieldStyles}
                                    fullWidth
                                />
                            </Grid>

                            {/* Second Column */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="date"
                                    type="date"
                                    placeholder="Date"
                                    value={user.date}
                                    onChange={handleChange}
                                    error={!!errors.date}
                                    helperText={errors.date}
                                    InputProps={{
                                        startAdornment: iconBox(<CalendarTodayIcon sx={{ color: "#909090" }} />),
                                    }}
                                    sx={commonFieldStyles}
                                    fullWidth
                                />
                            </Grid>

                            {/* First Column */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="time"
                                    type="time"
                                    placeholder="Time"
                                    value={user.time}
                                    onChange={handleChange}
                                    error={!!errors.time}
                                    helperText={errors.time}
                                    InputProps={{
                                        startAdornment: iconBox(<AccessTimeIcon sx={{ color: "#909090" }} />),
                                    }}
                                    sx={commonFieldStyles}
                                    fullWidth
                                />
                            </Grid>

                            {/* Second Column */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="noOfPeople"
                                    placeholder="No. of People"
                                    value={user.noOfPeople}
                                    onChange={handleChange}
                                    error={!!errors.noOfPeople}
                                    helperText={errors.noOfPeople}
                                    InputProps={{
                                        startAdornment: iconBox(<PeopleIcon sx={{ color: "#909090" }} />),
                                    }}
                                    sx={commonFieldStyles}
                                    fullWidth
                                />
                            </Grid>

                            {/* Note Field - spans full width */}
                            <Grid item xs={12}>
                                <TextField
                                    name="note"
                                    placeholder="Additional Note (optional)"
                                    multiline
                                    minRows={3}
                                    value={user.note}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: iconBox(<NoteAltIcon sx={{ color: "#909090" }} />),
                                    }}
                                    sx={{
                                        ...commonFieldStyles,
                                        width: '100%',
                                        "& .MuiInputBase-root": {
                                            height: 'auto',
                                        }
                                    }}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Button 
                            variant="contained" 
                            sx={{
                                bgcolor: "#6f4e34",
                                borderRadius: "50px",
                                mt: 2,
                                width: { xs: '100%', sm: 'auto' },
                                maxWidth: '250px'
                            }} 
                            type="submit"
                        >
                            Submit Reservation
                        </Button>
                    </Box>
                </Grid>

                {/* Right Column - Image */}
                <Grid item xs={12} md={6} sx={{ height: { xs: '50vh', md: '100vh' } }}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={resImage}
                            alt="Form Visual"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reservation;