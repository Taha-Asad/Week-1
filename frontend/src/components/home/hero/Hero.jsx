import React from 'react';
import heroImage from "../../../assets/header-bg.jpg";
import { Box, Typography } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';

const Hero = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: "10%",
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100%',
      }}
    >
      {/* Top Label with Icons */}
      <Typography
        variant="h6"
        color="#fff"
        sx={{
          position: 'relative',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          "&::before": {
            content: "''",
            position: 'absolute',
            borderBottom: '2px solid #fff',
            width: { xs: '20px', sm: '25px', md: '30px' },
            top: '15px',
            left: { xs: '-30px', sm: '-35px', md: '-40px' },
          },
          "&::after": {
            content: "''",
            position: 'absolute',
            borderBottom: '2px solid #fff',
            width: { xs: '20px', sm: '25px', md: '30px' },
            top: '15px',
            right: { xs: '-30px', sm: '-35px', md: '-40px' },
          },
        }}
      >
        <RestaurantIcon />
        <span>Welcome to Café Bliss</span>
        <LocalBarIcon />
      </Typography>

      {/* Main Heading */}
      <Typography
        variant="h2"
        color="#fff"
        fontFamily="'Rancho', cursive"
        textTransform={'uppercase'}
        mb={4}
        sx={{
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.75rem' },
          textAlign: 'center',
          px: { xs: 2, sm: 3, md: 4 },
          lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
          textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
        }}
      >
        Experience the Taste of Bliss
      </Typography>
    </Box>
  );
};

export default Hero;
