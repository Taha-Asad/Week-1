import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import axios from 'axios';
import { 
  Today as TodayIcon, 
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  EventAvailable  as UpcomingIcon
} from '@mui/icons-material';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/admin/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        setStats(response.data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ backgroundColor: '#1e1e1e', color: '#fff', height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', mb: 4 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<TodayIcon sx={{ color: '#4caf50' }} />} 
            title="Today's Reservations" 
            value={stats?.totalReservation || 0} 
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<ApprovedIcon sx={{ color: '#2196f3' }} />} 
            title="Approved" 
            value={stats?.approvedStats || 0} 
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<RejectedIcon sx={{ color: '#f44336' }} />} 
            title="Rejected" 
            value={stats?.rejectedStats || 0} 
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<UpcomingIcon sx={{ color: '#ff9800' }} />} 
            title="Upcoming" 
            value={stats?.upcoming || 0} 
            color="#ff9800"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;