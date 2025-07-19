import { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Switch, Chip, IconButton, Typography, Alert
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const BlogEditor = ({ post, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft',
    featured: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        tags: post.tags ? post.tags.join(', ') : '',
        status: post.status || 'draft',
        featured: post.featured || false
      });
      if (post.image) {
        setImagePreview(`http://localhost:5000/uploads/${post.image}`);
      }
    } else {
      // Reset form when creating new post
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        tags: '',
        status: 'draft',
        featured: false
      });
      setImagePreview('');
      setImage(null);
    }
  }, [post?._id]); // Only depend on post ID to prevent infinite loops

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }
    
    if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }
    
    if (formData.excerpt && formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt cannot exceed 300 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('excerpt', formData.excerpt);
      data.append('tags', formData.tags);
      data.append('status', formData.status);
      data.append('featured', formData.featured);
      
      if (image) {
        data.append('image', image);
      }

      if (post) {
        // Update existing post
        await axios.patch(
          `http://localhost:5000/api/v1/admin/blog/update/${post._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Blog post updated successfully');
      } else {
        // Create new post
        await axios.post(
          'http://localhost:5000/api/v1/admin/blog/create',
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Blog post created successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !formData.tags.split(',').map(t => t.trim()).includes(tag.trim())) {
      setFormData({
        ...formData,
        tags: formData.tags ? `${formData.tags}, ${tag}` : tag
      });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t !== tagToRemove);
    setFormData({
      ...formData,
      tags: tags.join(', ')
    });
  };

  const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </Typography>
        <IconButton onClick={onCancel} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Left Column - Form Fields */}
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#909090' } }}
          />

          <TextField
            fullWidth
            label="Excerpt (optional)"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            error={!!errors.excerpt}
            helperText={errors.excerpt || 'Brief description of the post (max 300 characters)'}
            multiline
            rows={2}
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#909090' } }}
          />

          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            error={!!errors.content}
            helperText={errors.content || 'Write your blog post content here (min 50 characters)'}
            multiline
            rows={12}
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#909090' } }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: '#909090' }}>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                sx={{ color: '#fff' }}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#6F4E34',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#6F4E34',
                    },
                  }}
                />
              }
              label="Featured Post"
              sx={{ color: '#fff' }}
            />
          </Box>

          <TextField
            fullWidth
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., food, recipe, cooking"
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#909090' } }}
          />

          {currentTags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
                Current Tags:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {currentTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ backgroundColor: '#6F4E34', color: '#fff' }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Right Column - Image Upload */}
        <Box sx={{ width: { xs: '100%', lg: 300 } }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            Featured Image
          </Typography>
          
          <Box sx={{ 
            border: '2px dashed #6F4E34', 
            borderRadius: 2, 
            p: 2, 
            textAlign: 'center',
            mb: 2
          }}>
            {imagePreview ? (
              <>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    marginBottom: '16px',
                    borderRadius: '8px'
                  }} 
                />
                <Button 
                  variant="outlined"
                  component="label"
                  sx={{ color: '#6F4E34', borderColor: '#6F4E34', mb: 1 }}
                >
                  Change Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                <Button 
                  variant="text"
                  onClick={() => {
                    setImage(null);
                    setImagePreview('');
                  }}
                  sx={{ color: '#f44336' }}
                >
                  Remove
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body2" sx={{ color: '#fff', mb: 2 }}>
                  No image selected
                </Typography>
                <Button 
                  variant="outlined"
                  component="label"
                  startIcon={<AddIcon />}
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

          <Alert severity="info" sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
            <Typography variant="body2">
              • Recommended size: 1200x630px<br/>
              • Supported formats: JPG, PNG, GIF<br/>
              • Max file size: 5MB
            </Typography>
          </Alert>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button 
          onClick={onCancel}
          variant="outlined"
          sx={{ color: '#fff', borderColor: '#6F4E34' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
          sx={{ 
            backgroundColor: '#6F4E34',
            '&:hover': { backgroundColor: '#5a3e2a' }
          }}
        >
          {loading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
        </Button>
      </Box>
    </Box>
  );
};

export default BlogEditor; 