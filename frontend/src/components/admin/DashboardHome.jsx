import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import axios from 'axios';
import {
  Today as TodayIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  EventAvailable as UpcomingIcon,
  Article as BlogIcon,
  Email as ContactIcon,
  Visibility as PublishedIcon,
  Edit as DraftIcon,
  Error as UnreadIcon,
  CheckCircle as ReadIcon,
  Reply as RepliedIcon,
  Archive as ArchiveIcon,
  Comment as CommentIcon,
  Schedule as PendingIcon
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
    <Card sx={{
      backgroundColor: '#1e1e1e',
      color: '#fff',
      height: '100%',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
      }
    }}>
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

      {/* Reservations Section */}
      <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
        Reservations
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
      {/* Blog Section */}
      <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
        Blog Posts
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<BlogIcon sx={{ color: '#6F4E37' }} />}
            title="Total Blogs"
            value={stats?.totalBlogs || 0}
            color="#6F4E37"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PublishedIcon sx={{ color: '#28a745' }} />}
            title="Published"
            value={stats?.publishedBlogs || 0}
            color="#28a745"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<DraftIcon sx={{ color: '#ffc107' }} />}
            title="Drafts"
            value={stats?.draftBlogs || 0}
            color="#ffc107"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ArchiveIcon sx={{ color: '#6c757d' }} />}
            title="Archived"
            value={stats?.archivedBlogs || 0}
            color="#6c757d"
          />
        </Grid>
      </Grid>

      {/* Contact Section */}
      <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
        Contact Messages
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ContactIcon sx={{ color: '#9c27b0' }} />}
            title="Total Messages"
            value={stats?.totalContacts || 0}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<UnreadIcon sx={{ color: '#f44336' }} />}
            title="Unread"
            value={stats?.unreadContacts || 0}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ReadIcon sx={{ color: '#2196f3' }} />}
            title="Read"
            value={stats?.readContacts || 0}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<RepliedIcon sx={{ color: '#4caf50' }} />}
            title="Replied"
            value={stats?.repliedContacts || 0}
            color="#4caf50"
          />
        </Grid>
      </Grid>

      {/* Comment Section */}
      <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
        Comments
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CommentIcon sx={{ color: '#007bff' }} />}
            title="Total Comments"
            value={stats?.totalComments || 0}
            color="#007bff"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PendingIcon sx={{ color: '#ff9800' }} />}
            title="Pending"
            value={stats?.pendingComments || 0}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ReadIcon sx={{ color: '#2196f3' }} />}
            title="Approved"
            value={stats?.approvedComments || 0}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<RejectedIcon sx={{ color: '#f44336' }} />}
            title="Rejected"
            value={stats?.rejectedComments || 0}
            color="#f44336"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;