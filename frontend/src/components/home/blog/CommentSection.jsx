import { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Avatar, Divider,
    CircularProgress, Alert, Paper, Chip
} from '@mui/material';
import {
    Send as SendIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Comment as CommentIcon
} from '@mui/icons-material';
import axios from 'axios';

const CommentSection = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        content: ''
    });

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/v1/comments/blog/${blogId}`);
            
            if (response.data.success) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.content) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.content.length < 10) {
            setError('Comment must be at least 10 characters long');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            
            const response = await axios.post('http://localhost:5000/api/v1/comments/add', {
                blogId,
                ...formData
            });

            if (response.data.success) {
                setSuccess('Comment submitted successfully! It will be visible after approval.');
                setFormData({ name: '', email: '', content: '' });
                // Refresh comments after a short delay
                setTimeout(() => {
                    fetchComments();
                }, 1000);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            setError(error.response?.data?.message || 'Failed to submit comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                Comments ({comments.length})
            </Typography>

            {/* Comment Form */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#6F4E37' }}>
                    Leave a Comment
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />
                    </Box>
                    
                    <TextField
                        fullWidth
                        label="Comment"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        multiline
                        rows={4}
                        placeholder="Share your thoughts..."
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    
                    <Button
                        type="submit"
                        variant="contained"
                        endIcon={<SendIcon />}
                        disabled={submitting}
                        sx={{
                            backgroundColor: '#6F4E37',
                            borderRadius: 2,
                            px: 3,
                            '&:hover': {
                                backgroundColor: '#5a3d2e'
                            }
                        }}
                    >
                        {submitting ? <CircularProgress size={20} /> : 'Submit Comment'}
                    </Button>
                </Box>
            </Paper>

            {/* Comments List */}
            <Box>
                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : comments.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                        <CommentIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#6c757d', mb: 1 }}>
                            No comments yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d' }}>
                            Be the first to share your thoughts!
                        </Typography>
                    </Paper>
                ) : (
                    <Box>
                        {comments.map((comment, index) => (
                            <Paper key={comment._id} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#6F4E37', width: 40, height: 40 }}>
                                        <PersonIcon />
                                    </Avatar>
                                    
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {comment.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#6c757d' }}>
                                                {formatDate(comment.createdAt)}
                                            </Typography>
                                        </Box>
                                        
                                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                            {comment.content}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CommentSection; 