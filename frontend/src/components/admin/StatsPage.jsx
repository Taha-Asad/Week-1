import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Select, 
  MenuItem, CircularProgress, TextField
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StatsPage = () => {
  const [stats, setStats] = useState({
    totalReservation: 0,
    approvedStats: 0,
    rejectedStats: 0,
    pendingStats: 0,
    upcoming: 0,
    reservationTrend: []
  });
  const [timeRange, setTimeRange] = useState('month'); // Default to month
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const COLORS = ['#6F4E34', '#5a3e2a', '#4a3323', '#3a281b'];

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = { timeRange };
      
      if (timeRange === 'custom') {
        params.startDate = startDate.toISOString().split('T')[0];
        params.endDate = endDate.toISOString().split('T')[0];
      }

      const response = await axios.get('http://localhost:5000/api/v1/admin/dashboard-stats', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      console.log('API Response:', response.data);
      
      // Handle both response structures (with and without nested stats object)
      const responseData = response.data.stats ? response.data : { stats: response.data };
      
      setStats({
        totalReservation: responseData.stats.totalReservation || 0,
        approvedStats: responseData.stats.approvedStats || 0,
        rejectedStats: responseData.stats.rejectedStats || 0,
        pendingStats: responseData.stats.pendingStats || 0,
        upcoming: responseData.stats.upcoming || 0,
        reservationTrend: responseData.reservationTrend || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch statistics');
      setStats({
        totalReservation: 0,
        approvedStats: 0,
        rejectedStats: 0,
        pendingStats: 0,
        upcoming: 0,
        reservationTrend: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange, startDate, endDate]);

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    if (value !== 'custom') {
      const today = new Date();
      setStartDate(today);
      setEndDate(today);
    }
  };

  const reservationData = [
    { name: 'Approved', value: stats.approvedStats },
    { name: 'Rejected', value: stats.rejectedStats },
    { name: 'Pending', value: stats.pendingStats },
  ];

  const timeRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const StatCard = ({ title, value, color }) => (
    <Card sx={{ backgroundColor: '#1e1e1e', height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle2" color="#909090" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#fff' }}>
          Advanced Statistics
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            sx={{ 
              backgroundColor: '#1e1e1e', 
              color: '#fff',
              '& .MuiSelect-icon': { color: '#fff' }
            }}
          >
            {timeRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {timeRange === 'custom' && (
            <>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                customInput={
                  <TextField 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#1e1e1e',
                      '& .MuiInputBase-input': { color: '#fff' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#6F4E34' }
                    }}
                  />
                }
              />
              <Typography sx={{ color: '#fff' }}>to</Typography>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                customInput={
                  <TextField 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#1e1e1e',
                      '& .MuiInputBase-input': { color: '#fff' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#6F4E34' }
                    }}
                  />
                }
              />
            </>
          )}
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Total Reservations" 
                value={stats.totalReservation} 
                color="#4caf50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Approved" 
                value={stats.approvedStats} 
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Rejected" 
                value={stats.rejectedStats} 
                color="#f44336"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Upcoming" 
                value={stats.upcoming} 
                color="#ff9800"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: '#1e1e1e', p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                  Reservations Trend
                </Typography>
                {stats.reservationTrend && stats.reservationTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={stats.reservationTrend}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis dataKey="date" stroke="#909090" />
                      <YAxis stroke="#909090" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e1e1e', 
                          borderColor: '#6F4E34' 
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="reservations" fill="#6F4E34" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <Typography color="#909090">No data available for the selected period</Typography>
                  </Box>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: '#1e1e1e', p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                  Reservation Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reservationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {reservationData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e1e1e', 
                        borderColor: '#6F4E34' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default StatsPage;