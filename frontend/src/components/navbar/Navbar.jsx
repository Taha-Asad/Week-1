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
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Instagram,
  Facebook,
  Twitter,
  LinkedIn,
  Home as HomeIcon,
  Info as AboutIcon,
  Restaurant as MenuIcon2,
  ContactSupport as ContactIcon,
  CalendarToday as ReservationIcon,
  Search as SearchIcon,
  Article as BlogIcon,
  LocalOffer as ServicesIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
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

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  // Menu items with icons and section IDs
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, sectionId: 'home' },
    { text: 'About', icon: <AboutIcon />, sectionId: 'about' },
    { text: 'Reservation', icon: <ReservationIcon />, sectionId: 'reservation' },
    { text: 'Search Reservation', icon: <SearchIcon />, sectionId: 'search-reservation' },
    { text: 'Menu', icon: <MenuIcon2 />, sectionId: 'menu' },
    { text: 'Services', icon: <ServicesIcon />, sectionId: 'services' },
    { text: 'Blog', icon: <BlogIcon />, sectionId: 'blog' },
    { text: 'Contact', icon: <ContactIcon />, sectionId: 'contact' }
  ];

  // Social media links
  const socialLinks = [
    { icon: <Instagram />, color: '#E1306C', url: 'https://instagram.com/cafebliss' },
    { icon: <Facebook />, color: '#1877F2', url: 'https://facebook.com/cafebliss' },
    { icon: <Twitter />, color: '#1DA1F2', url: 'https://twitter.com/cafebliss' },
    { icon: <LinkedIn />, color: '#0077B5', url: 'https://linkedin.com/company/cafebliss' }
  ];

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>


      <Box
        sx={{
          width: isOpen ? (isMobile ? '100vw' : '400px') : '0',
          height: '100vh',
          background: 'rgba(34,34,34,0.97)', // solid dark background
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1200,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          overflowY: 'auto',
          borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isOpen ? '0 0 30px rgba(0, 0, 0, 0.3)' : 'none',
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '0px',
            background: 'transparent'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'transparent'
          },
          // Firefox scrollbar
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
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
            <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
                variant="h4"
              sx={{
                fontWeight: 'bold',
                  fontSize: isMobile ? '1.8rem' : '2.2rem',
                  fontFamily: "'Rancho', cursive",
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 1
                }}
              >
                Café Bliss
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.8,
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
              >
                Experience the Taste of Bliss
            </Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />

            {/* Menu Items */}
            <List sx={{ flexGrow: 1 }}>
              {menuItems.map((item) => (
                <React.Fragment key={item.text}>
                  <ListItem
                    button
                    onClick={() => scrollToSection(item.sectionId)}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      mb: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateX(10px)',
                        '& .MuiListItemText-primary': {
                          color: '#f15f2a'
                        },
                        '& .MuiListItemIcon-root': {
                          color: '#f15f2a'
                        }
                      },
                      '&:active': {
                        transform: 'scale(0.98)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      width: '100%',
                      gap: 2
                    }}>
                      <Box sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        transition: 'color 0.3s ease'
                      }}>
                        {item.icon}
                      </Box>
                    <ListItemText
                        primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 'medium',
                          fontSize: isMobile ? '1.1rem' : '1.2rem',
                          color: '#fff',
                          transition: 'color 0.3s ease'
                      }}
                    />
                    </Box>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>

            {/* Contact Info */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                📍 123 Coffee Street, Brew City
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                ☎️ +1 (555) 123-4567
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                🕒 Mon-Fri: 7AM - 10PM
              </Typography>
            </Box>

            {/* Social Icons */}
            <Box>
              <Divider
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  mb: 2
                }}
              />
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Follow Us
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 2
                }}
              >
                {socialLinks.map((social, i) => (
                  <Tooltip key={i} title={`Follow us on ${social.text || 'social media'}`}>
                  <IconButton
                      onClick={() => handleSocialClick(social.url)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                        width: 45,
                        height: 45,
                      '&:hover': {
                        bgcolor: social.color,
                          transform: 'scale(1.1) rotate(5deg)',
                          boxShadow: `0 4px 15px ${social.color}40`
                      },
                        transition: 'all 0.3s ease'
                    }}
                  >
                    {social.icon}
                  </IconButton>
                  </Tooltip>
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
          top: isMobile ? 15 : 25,
          left: isMobile ? 15 : 60,
          width: isMobile ? 55 : 65,
          height: isMobile ? 55 : 65,
          zIndex: 1300,
          background: 'linear-gradient(135deg, #6F4E37 0%, #8B7355 100%)',
          color: 'white',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen
            ? isMobile
              ? 'translateX(calc(100vw - 70px)) rotate(180deg)'
              : 'translateX(320px) rotate(180deg)'
            : 'rotate(0deg)',
          boxShadow: '0 4px 20px rgba(111, 78, 55, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #f15f2a 0%, #e74c3c 100%)',
            transform: isOpen
              ? isMobile
                ? 'translateX(calc(100vw - 70px)) rotate(180deg) scale(1.1)'
                : 'translateX(320px) rotate(180deg) scale(1.1)'
              : 'rotate(0deg) scale(1.1)',
            boxShadow: '0 6px 25px rgba(241, 95, 42, 0.5)'
          },
          '&:active': {
            transform: isOpen
              ? isMobile
                ? 'translateX(calc(100vw - 70px)) rotate(180deg) scale(0.95)'
                : 'translateX(320px) rotate(180deg) scale(0.95)'
              : 'rotate(0deg) scale(0.95)'
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
