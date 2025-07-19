import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { 
  Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, 
  Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  IconButton, useTheme, useMediaQuery, Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarToday as ReservationsIcon,
  BarChart as StatsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Article as BlogIcon,
  Email as ContactIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard' },
    { text: 'Reservations', icon: <ReservationsIcon />, path: '/admin-dashboard/reservations' },
    { text: 'Menu', icon: <MenuIcon />, path: '/admin-dashboard/menu' },
    { text: 'Blog', icon: <BlogIcon />, path: '/admin-dashboard/blog' },
    { text: 'Contact', icon: <ContactIcon />, path: '/admin-dashboard/contact' },
    { text: 'Statistics', icon: <StatsIcon />, path: '/admin-dashboard/stats' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin-dashboard/settings' },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ backgroundColor: '#1e1e1e' }}>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#fff' }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: '#909090' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: '#fff' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: '#909090' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: '#fff' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#1e1e1e',
          boxShadow: 'none',
          borderBottom: '1px solid #2d2d2d'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#fff' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#fff' }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#1e1e1e',
              borderRight: '1px solid #2d2d2d'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#1e1e1e',
              borderRight: '1px solid #2d2d2d'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#121212',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;