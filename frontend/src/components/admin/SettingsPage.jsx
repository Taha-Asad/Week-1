import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent,
  Divider, Switch, FormControlLabel, CircularProgress,
  Alert, Avatar, IconButton, Grid
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: null
  });

  const [settings, setSettings] = useState({
    reservationLimit: 60,
    notifyOnReservation: true,
    notifyOnApproval: true,
    notificationEmail: ''
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      console.log('Token:', token);
      
      const response = await axios.get('http://localhost:5000/api/v1/admin/settings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = response.data;
      console.log('Admin data:', data);
      
      setAdminData({
        ...adminData,
        name: data.name || '',
        email: data.email || '',
      });
      
      setSettings({
        reservationLimit: data.settings?.reservationLimit || 60,
        notifyOnReservation: data.settings?.notifyOnReservation ?? true,
        notifyOnApproval: data.settings?.notifyOnApproval ?? true,
        notificationEmail: data.settings?.notificationEmail || data.email || ''
      });
      
      if (data.profileImage) {
        const imageUrl = `http://localhost:5000/uploads/${data.profileImage}`;
        console.log('Setting image preview URL:', imageUrl);
        setImagePreview(imageUrl);
      } else {
        console.log('No profile image found in data');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSettingChange = (e) => {
    const { name, checked } = e.target;
    setSettings({ ...settings, [name]: checked });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: parseInt(value) || 0 });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file);
    if (file) {
      setAdminData({ ...adminData, profileImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (adminData.newPassword && adminData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (adminData.newPassword !== adminData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setUpdating(true);
      const formData = new FormData();
      
      formData.append('name', adminData.name);
      formData.append('email', adminData.email);
      if (adminData.currentPassword) formData.append('currentPassword', adminData.currentPassword);
      if (adminData.newPassword) formData.append('newPassword', adminData.newPassword);
      if (adminData.profileImage) {
        console.log('Appending profile image to form data:', adminData.profileImage);
        formData.append('profileImage', adminData.profileImage);
      }
      
      formData.append('reservationLimit', settings.reservationLimit);
      formData.append('notifyOnReservation', settings.notifyOnReservation);
      formData.append('notifyOnApproval', settings.notifyOnApproval);
      formData.append('notificationEmail', settings.notificationEmail);

      const response = await axios.put(
        'http://localhost:5000/api/v1/admin/settings', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const successMessage = response.data.message || 'Settings updated successfully';
      toast.success(successMessage);
      
      // If password was changed, log out the user
      if (adminData.currentPassword && adminData.newPassword) {
        toast.info('Password changed successfully. Please log in again with your new password.');
        localStorage.removeItem('adminToken');
        // Redirect to login page
        window.location.href = '/admin-login';
        return;
      }
      
      // If only image was changed, refresh the data to show the new image
      if (adminData.profileImage && adminData.profileImage instanceof File) {
        console.log('Image was updated, refreshing data...');
      }
      
      // Refresh data after update
      await fetchAdminData();
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update settings';
      toast.error(errorMessage);
      
      // Clear password fields if password change failed
      if (errorMessage.includes('password') || errorMessage.includes('Password')) {
        setAdminData({
          ...adminData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#fff', mb: 3 }}>
        Admin Settings
      </Typography>

      {/* Profile Information Card */}
      <Card sx={{ backgroundColor: '#1e1e1e', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            Profile Information
          </Typography>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              src={imagePreview}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="profile-image-upload">
                <Button 
                  variant="outlined" 
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                  sx={{ color: '#6F4E34', borderColor: '#6F4E34' }}
                >
                  Change Photo
                </Button>
              </label>
              <Typography variant="caption" display="block" sx={{ color: '#909090', mt: 1 }}>
                Recommended size: 200x200 pixels
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={adminData.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ sx: { color: '#fff' } }}
                InputLabelProps={{ sx: { color: '#909090' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={adminData.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ sx: { color: '#fff' } }}
                InputLabelProps={{ sx: { color: '#909090' } }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card sx={{ backgroundColor: '#1e1e1e', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            Change Password
          </Typography>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={adminData.currentPassword}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#909090' } }}
          />
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={adminData.newPassword}
            onChange={handleInputChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#909090' } }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={adminData.confirmPassword}
            onChange={handleInputChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{ sx: { color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#909090' } }}
          />
        </CardContent>
      </Card>

      {/* Notification Settings Card */}
      <Card sx={{ backgroundColor: '#1e1e1e', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            Notification Settings
          </Typography>
          <TextField
            fullWidth
            label="Notification Email"
            name="notificationEmail"
            type="email"
            value={settings.notificationEmail}
            onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})}
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#909090' } }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifyOnReservation}
                onChange={handleSettingChange}
                name="notifyOnReservation"
                color="primary"
              />
            }
            label="Receive notifications for new reservations"
            sx={{ color: '#fff', display: 'block', mb: 1 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifyOnApproval}
                onChange={handleSettingChange}
                name="notifyOnApproval"
                color="primary"
              />
            }
            label="Receive notifications when reservations are approved/rejected"
            sx={{ color: '#fff', display: 'block' }}
          />
        </CardContent>
      </Card>

      {/* System Settings Card */}
      <Card sx={{ backgroundColor: '#1e1e1e', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            System Settings
          </Typography>
          <TextField
            fullWidth
            label="Maximum Reservations Per Time Slot"
            name="reservationLimit"
            type="number"
            value={settings.reservationLimit}
            onChange={handleNumberChange}
            sx={{ mb: 2 }}
            InputProps={{ 
              sx: { color: '#fff' },
              inputProps: { min: 1 }
            }}
            InputLabelProps={{ sx: { color: '#909090' } }}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={updating}
          sx={{ 
            backgroundColor: '#6F4E34',
            '&:hover': { backgroundColor: '#5a3e2a' },
            minWidth: 120
          }}
        >
          {updating ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;