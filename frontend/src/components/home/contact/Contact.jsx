import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Container,
    CircularProgress,
    Grid,
    IconButton
} from '@mui/material';
import {
    Send as SendIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/v1/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Message sent successfully! We will get back to you soon.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error(data.message || 'Failed to send message');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ py: 8, backgroundColor: '#f8f9fa', marginBottom: "10%" }}>
            <Container maxWidth="lg">
                <Box sx={{
                    textAlign: 'center', mb: 6, display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    py: 4,
                }}>
                    <Typography
                        variant="h6"
                        color="#6F4E37"
                        sx={{
                            position: 'relative',
                            mb: 1,
                            "&::before": {
                                content: "''",
                                position: 'absolute',
                                borderBottom: '2px solid #6F4E37',
                                width: '30px',
                                top: '15px',
                                left: '-40px',
                            },
                            "&::after": {
                                content: "''",
                                position: 'absolute',
                                borderBottom: '2px solid #6F4E37',
                                width: '30px',
                                top: '15px',
                                right: '-40px',
                            },
                        }}
                    >
                        Get In Touch
                    </Typography>

                    <Typography
                        variant="h2"
                        color="#29272E"
                        fontFamily="'Rancho', cursive"
                        textTransform={'uppercase'}
                        mb={2}
                    >
                        Contact Us
                    </Typography>

                    <Typography
                        variant="h6"
                        color="#8B7355"
                        sx={{ opacity: 0.8 }}
                    >
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </Typography>
                </Box>

                <Grid container spacing={6} direction={{ xs: 'column', sm: 'row' }}>
                    {/* Contact Information */}
                    <Grid item xs={12} sm={6} md={6} sx={{ width: { xs: '100%', sm: '35%' }, flexBasis: { sm: '35%' }, maxWidth: { sm: '35%' } }}>
                        <Paper
                            elevation={0}
                            sx={{
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: 3,
                                p: 4,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                height: '100%',
                                width: '100%',
                                mb: { xs: 4, sm: 0 }
                            }}
                        >
                            <Typography variant="h5" color="#6F4E37" sx={{ mb: 3, fontWeight: 600 }}>
                                Contact Information
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        backgroundColor: 'rgba(111, 78, 55, 0.1)',
                                        borderRadius: '50%',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <EmailIcon sx={{ color: '#6F4E37' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" color="#6F4E37" sx={{ fontWeight: 600 }}>
                                            Email
                                        </Typography>
                                        <Typography variant="body2" color="#8B7355">
                                            info@cafebliss.com
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        backgroundColor: 'rgba(111, 78, 55, 0.1)',
                                        borderRadius: '50%',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <PhoneIcon sx={{ color: '#6F4E37' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" color="#6F4E37" sx={{ fontWeight: 600 }}>
                                            Phone
                                        </Typography>
                                        <Typography variant="body2" color="#8B7355">
                                            +1 (555) 123-4567
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        backgroundColor: 'rgba(111, 78, 55, 0.1)',
                                        borderRadius: '50%',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <LocationIcon sx={{ color: '#6F4E37' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" color="#6F4E37" sx={{ fontWeight: 600 }}>
                                            Address
                                        </Typography>
                                        <Typography variant="body2" color="#8B7355">
                                            123 Coffee Street<br />
                                            Brew City, BC 12345
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        backgroundColor: 'rgba(111, 78, 55, 0.1)',
                                        borderRadius: '50%',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <TimeIcon sx={{ color: '#6F4E37' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" color="#6F4E37" sx={{ fontWeight: 600 }}>
                                            Hours
                                        </Typography>
                                        <Typography variant="body2" color="#8B7355">
                                            Mon-Fri: 7AM - 10PM<br />
                                            Sat-Sun: 8AM - 11PM
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} sx={{ width: { xs: '100%', sm: '60%' }, flexBasis: { sm: '60%' }, maxWidth: { sm: '60%' } }}>
                        <Paper
                            elevation={0}
                            sx={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: 3,
                                p: 4,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                height: '100%',
                                width: '100%',
                                mb: { xs: 4, sm: 0 },
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
                            <Typography variant="h5" color="#6F4E37" sx={{ mb: 3, fontWeight: 600 }}>
                                Send us a Message
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Your Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
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

                                    <TextField
                                        fullWidth
                                        label="Your Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
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

                                    <TextField
                                        fullWidth
                                        label="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
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

                                    <TextField
                                        fullWidth
                                        label="Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        multiline
                                        rows={4}
                                        variant="outlined"
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
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                                        sx={{
                                            background: 'linear-gradient(135deg, #6F4E37 0%, #8B7355 100%)',
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            boxShadow: '0 4px 15px rgba(111, 78, 55, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #8B7355 0%, #6F4E37 100%)',
                                                boxShadow: '0 6px 20px rgba(111, 78, 55, 0.4)',
                                            },
                                        }}
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Contact; 