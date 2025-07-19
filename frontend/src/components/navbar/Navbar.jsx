import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Instagram,
  Facebook,
  Twitter,
  LinkedIn
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Secret admin shortcut
  const handleSecretAdmin = (e) => {
    if (e.ctrlKey && e.altKey && e.key === 'a') {
      e.preventDefault();
      navigate('/admin-login');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleSecretAdmin);
    return () => document.removeEventListener('keydown', handleSecretAdmin);
  }, [navigate]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Sidebar */}
      <Box
        sx={{
          width: isOpen ? (isMobile ? '100vw' : '400px') : '0',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1200,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          overflowY: 'auto',
          borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {isOpen && (
          <Box
            sx={{
              p: 3,
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Menu Header */}
            <Typography
              variant="h6"
              sx={{
                pb: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: isMobile ? '1.5rem' : 'inherit'
              }}
            >
              MENU
            </Typography>

            {/* Menu Items */}
            <List sx={{ flexGrow: 1, mt: 2 }}>
              {['Home', 'About', 'Services', 'Contact'].map((text) => (
                <React.Fragment key={text}>
                  <ListItem
                    button
                    onClick={() => setIsOpen(false)}
                    sx={{
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiListItemText-primary': {
                          color: '#f15f2a'
                        }
                      }
                    }}
                  >
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        textAlign: 'center',
                        fontWeight: 'medium',
                        fontSize: isMobile ? '1.2rem' : 'inherit'
                      }}
                    />
                  </ListItem>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                </React.Fragment>
              ))}
            </List>

            {/* Social Icons */}
            <Box sx={{ mt: 'auto' }}>
              <Divider
                sx={{
                  borderColor: 'silver',
                  borderWidth: 1,
                  my: 2
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: isMobile ? 1 : 1.5,
                  mb: 2
                }}
              >
                {[
                  { icon: <Instagram />, color: '#E1306C' },
                  { icon: <Facebook />, color: '#1877F2' },
                  { icon: <Twitter />, color: '#1DA1F2' },
                  { icon: <LinkedIn />, color: '#0077B5' }
                ].map((social, i) => (
                  <IconButton
                    key={i}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: social.color,
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease',
                      width: isMobile ? 36 : 40,
                      height: isMobile ? 36 : 40
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Toggle Button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          top: isMobile ? 10 : 20,
          left: isMobile ? 10 : 50,
          width: isMobile ? 50 : 60,
          height: isMobile ? 50 : 60,
          zIndex: 1300,
          bgcolor: '#6F4E37',
          color: 'white',
          transition: 'all 0.5s ease',
          transform: isOpen
            ? isMobile
              ? 'translateX(calc(100vw - 60px))'
              : 'translateX(270px)'
            : 'none',
          '&:hover': {
            bgcolor: '#f15f2a',
            transform: isOpen
              ? isMobile
                ? 'translateX(calc(100vw - 60px)) rotateZ(180deg)'
                : 'translateX(270px) rotateZ(180deg)'
              : 'rotateZ(180deg)'
          }
        }}
      >
        {isOpen ? (
          <CloseIcon sx={{ width: '60%', height: '60%' }} />
        ) : (
          <MenuIcon sx={{ width: '60%', height: '60%' }} />
        )}
      </IconButton>
    </>
  );
};

export default Navbar;
