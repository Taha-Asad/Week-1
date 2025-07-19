import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardMedia, CardContent, 
  CardActions, Button, TextField, Select, MenuItem, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, CircularProgress, Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const MenuPage = () => {
  // Initialize state with proper defaults
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'food',
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: ''
  });

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/admin/menu', {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      console.log('Menu items response:', response.data);
      
      // Ensure we always have an array, even if response is malformed
      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      console.log('Processed menu items:', items);
      setMenuItems(items);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch menu items');
      setMenuItems([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting form data:', formData);
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      
      // Log FormData contents
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      if (currentItem) {
        await axios.patch(`http://localhost:5000/api/v1/admin/update-menu/${currentItem._id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Menu item updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/v1/admin/postMenuItem', data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Menu item added successfully');
      }
      fetchMenuItems();
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${currentItem ? 'update' : 'add'} menu item`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/admin/delete-menu/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        type: item.type,
        category: item.category,
        image: null
      });
      setImagePreview(item.image ? `http://localhost:5000/uploads/${item.image}` : '');
    } else {
      setCurrentItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        type: 'food',
        category: '',
        image: null
      });
      setImagePreview('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff' }}>
          Menu Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            backgroundColor: '#6F4E34',
            '&:hover': { backgroundColor: '#5a3e2a' }
          }}
        >
          Add Item
        </Button>
      </Box>

      {/* Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by name"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#909090', mr: 1 }} />,
            sx: { backgroundColor: '#1e1e1e', color: '#fff' }
          }}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Select
          size="small"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          displayEmpty
          sx={{ 
            backgroundColor: '#1e1e1e', 
            color: '#fff', 
            minWidth: 120,
            '& .MuiSelect-icon': { color: '#fff' }
          }}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="regular">Regular</MenuItem>
          <MenuItem value="drinks">Drink</MenuItem>
          <MenuItem value="special">Special</MenuItem>
        </Select>
        <Select
          size="small"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          displayEmpty
          sx={{ 
            backgroundColor: '#1e1e1e', 
            color: '#fff', 
            minWidth: 120,
            '& .MuiSelect-icon': { color: '#fff' }
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="breakfast">Breakfast</MenuItem>
          <MenuItem value="lunch">Lunch</MenuItem>
          <MenuItem value="dinner">Dinner</MenuItem>
          <MenuItem value="dessert">Dessert</MenuItem>
          <MenuItem value="beverage">Beverage</MenuItem>
        </Select>
        <Button 
          variant="outlined"
          onClick={() => setFilters({ type: '', category: '', search: '' })}
          sx={{ color: '#fff', borderColor: '#6F4E34' }}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Menu Items Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : menuItems.length === 0 ? (
        <Typography variant="body1" sx={{ color: '#fff', textAlign: 'center' }}>
          No menu items found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ 
                backgroundColor: '#1e1e1e', 
                color: '#fff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {item.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="#909090" sx={{ mb: 1 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label={item.type} size="small" />
                    <Chip label={item.category} size="small" />
                  </Box>
                  <Typography variant="h6" color="#6F4E34">
                    Rs.{item.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(item)}
                    sx={{ color: '#6F4E34' }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(item._id)}
                    sx={{ color: '#f44336' }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ sx: { color: 'black' } }}
                InputLabelProps={{ sx: { color: '#909090' } }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ sx: { color: 'black' } }}
                InputLabelProps={{ sx: { color: '#909090' } }}
              />
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ sx: { color: 'black' } }}
                InputLabelProps={{ sx: { color: '#909090' } }}
              />
              <Select
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ sx: { color: 'black' } }}
              >
                <MenuItem value="regular">Regular</MenuItem>
                <MenuItem value="drinks">Drink</MenuItem>
                <MenuItem value="special">Special</MenuItem>
              </Select>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ sx: { color: 'black' } }}
                InputLabelProps={{ sx: { color: '#909090' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                border: '1px dashed #6F4E34', 
                borderRadius: 1, 
                p: 2, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        marginBottom: '16px' 
                      }} 
                    />
                    <Button 
                      variant="outlined"
                      component="label"
                      sx={{ color: '#6F4E34', borderColor: '#6F4E34' }}
                    >
                      Change Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      No image selected
                    </Typography>
                    <Button 
                      variant="outlined"
                      component="label"
                      sx={{ color: '#6F4E34', borderColor: '#6F4E34' }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#fff' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ backgroundColor: '#6F4E34', '&:hover': { backgroundColor: '#5a3e2a' } }}
          >
            {currentItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuPage;