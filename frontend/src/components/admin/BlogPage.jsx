import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardMedia, CardContent, 
  CardActions, Button, TextField, Select, MenuItem, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, CircularProgress, Chip, FormControl, InputLabel,
  Switch, FormControlLabel, Alert, Snackbar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import BlogEditor from './BlogEditor';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  });

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/admin/blog/all', {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      console.log('Blog posts response:', response.data);
      setBlogPosts(response.data.blogs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch blog posts');
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/admin/blog/stats/overview', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching blog stats:', error);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
    fetchStats();
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/admin/blog/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success('Blog post deleted successfully');
      fetchBlogPosts();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog post');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await axios.patch(`http://localhost:5000/api/v1/admin/blog/toggle-status/${id}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      toast.success(`Blog post ${newStatus === 'published' ? 'published' : 'moved to draft'}`);
      fetchBlogPosts();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update blog status');
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/admin/blog/update/${id}`, 
        { featured: !currentFeatured },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      toast.success(`Blog post ${currentFeatured ? 'unfeatured' : 'featured'}`);
      fetchBlogPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update blog post');
    }
  };

  const handleOpenDialog = (post = null) => {
    setCurrentPost(post);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPost(null);
  };

  const handleEditorSuccess = () => {
    handleCloseDialog();
    fetchBlogPosts();
    fetchStats();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff' }}>
          Blog Management
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
          New Post
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" color="#6F4E34">Total Posts</Typography>
              <Typography variant="h4">{stats.totalPosts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" color="success.main">Published</Typography>
              <Typography variant="h4">{stats.publishedPosts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" color="warning.main">Drafts</Typography>
              <Typography variant="h4">{stats.draftPosts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" color="info.main">Total Views</Typography>
              <Typography variant="h4">{stats.totalViews}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" color="primary.main">Total Comments</Typography>
              <Typography variant="h4">{stats.totalComments || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search posts..."
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#909090', mr: 1 }} />,
            sx: { backgroundColor: '#1e1e1e', color: '#fff' }
          }}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: '#fff' }}>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            sx={{ 
              backgroundColor: '#1e1e1e', 
              color: '#fff',
              '& .MuiSelect-icon': { color: '#fff' }
            }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: '#fff' }}>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            sx={{ 
              backgroundColor: '#1e1e1e', 
              color: '#fff',
              '& .MuiSelect-icon': { color: '#fff' }
            }}
          >
            <MenuItem value="createdAt">Date Created</MenuItem>
            <MenuItem value="updatedAt">Date Updated</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="views">Views</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="outlined"
          onClick={() => setFilters({ status: '', search: '', sortBy: 'createdAt', sortOrder: 'desc' })}
          sx={{ color: '#fff', borderColor: '#6F4E34' }}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Blog Posts Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : blogPosts.length === 0 ? (
        <Typography variant="body1" sx={{ color: '#fff', textAlign: 'center' }}>
          No blog posts found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {blogPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Card sx={{ 
                backgroundColor: '#1e1e1e', 
                color: '#fff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {post.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:5000/uploads/${post.image}`}
                    alt={post.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={post.status} 
                      size="small" 
                      color={getStatusColor(post.status)}
                      sx={{ mr: 1 }}
                    />
                    {post.featured && <StarIcon sx={{ color: '#FFD700', fontSize: 16 }} />}
                  </Box>
                  <Typography gutterBottom variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="#909090" sx={{ mb: 1 }}>
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    {post.tags?.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Typography variant="caption" color="#909090">
                    {post.readTime} min read • {post.views} views • {post.commentCount || 0} comments
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(post)}
                    sx={{ color: '#6F4E34' }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={post.status === 'published' ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    onClick={() => handleToggleStatus(post._id, post.status)}
                    sx={{ color: post.status === 'published' ? '#f44336' : '#4caf50' }}
                  >
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={post.featured ? <StarIcon /> : <StarBorderIcon />}
                    onClick={() => handleToggleFeatured(post._id, post.featured)}
                    sx={{ color: '#FFD700' }}
                  >
                    {post.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(post._id)}
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

      {/* Blog Editor Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            color: '#fff'
          }
        }}
      >
        <DialogTitle>
          {currentPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BlogEditor 
            post={currentPost} 
            onSuccess={handleEditorSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BlogPage; 