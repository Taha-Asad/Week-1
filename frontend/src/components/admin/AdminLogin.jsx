import {
    Box, Container, Paper, TextField, InputAdornment, Button
} from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router';

const AdminLogin = () => {
    const [admin, setAdmin] = useState({
        email: "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await axios.post('http://localhost:5000/api/v1/admin/login', admin);
            toast.success('Admin Login Successful!');
            localStorage.setItem('adminToken', response.data.token);
            navigate('/admin-dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

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
        <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#121212',
            padding: 2
        }}>
            <Container maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit}>
                    <Paper sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                        backgroundColor: '#1e1e1e',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                        borderRadius: '8px',
                        border: '1px solid #2d2d2d'
                    }}>
                        <TextField
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={admin.email}
                            onChange={handleChange}
                            InputProps={{ 
                                startAdornment: iconBox(<EmailIcon sx={{ color: "#909090" }} />),
                                autoComplete: "off"
                            }}
                            sx={commonFieldStyles}
                            required
                        />
                        <TextField
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={admin.password}
                            onChange={handleChange}
                            InputProps={{ 
                                startAdornment: iconBox(<LockIcon sx={{ color: "#909090" }} />),
                                autoComplete: "off"
                            }}
                            sx={commonFieldStyles}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                mt: 2,
                                width: '270px',
                                backgroundColor: '#6F4E34',
                                '&:hover': {
                                    backgroundColor: '#5a3e2a',
                                },
                                borderRadius: 0,
                                py: 1.5,
                                fontWeight: 'bold',
                                letterSpacing: '1px'
                            }}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}

export default AdminLogin;