import { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Chip, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, FormControl, InputLabel,
    Select, MenuItem, Alert, CircularProgress, Checkbox, Tooltip, Avatar
} from '@mui/material';
import {
    Visibility as ViewIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Schedule as PendingIcon
} from '@mui/icons-material';
import axios from 'axios';

const CommentManagement = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedComments, setSelectedComments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalComments, setTotalComments] = useState(0);
    
    // Dialog states
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchComments();
    }, [page, rowsPerPage, statusFilter]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/v1/admin/comments/admin/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                },
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    status: statusFilter === 'all' ? undefined : statusFilter
                }
            });

            if (response.data.success) {
                setComments(response.data.comments);
                setTotalComments(response.data.total);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (commentId, status) => {
        try {
            const response = await axios.patch(
                `http://localhost:5000/api/v1/admin/comments/admin/status/${commentId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess(`Comment ${status} successfully`);
                fetchComments();
                setStatusDialogOpen(false);
                setSelectedComment(null);
            }
        } catch (error) {
            console.error('Error updating comment status:', error);
            setError('Failed to update comment status');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/v1/admin/comments/admin/delete/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess('Comment deleted successfully');
                fetchComments();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            setError('Failed to delete comment');
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedComments.length} comments?`)) return;

        try {
            const response = await axios.delete(
                'http://localhost:5000/api/v1/admin/comments/admin/bulk-delete',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    },
                    data: { ids: selectedComments }
                }
            );

            if (response.data.success) {
                setSuccess(response.data.message);
                setSelectedComments([]);
                fetchComments();
            }
        } catch (error) {
            console.error('Error bulk deleting comments:', error);
            setError('Failed to delete comments');
        }
    };

    const handleViewComment = (comment) => {
        setSelectedComment(comment);
        setViewDialogOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <ApproveIcon />;
            case 'rejected':
                return <RejectIcon />;
            case 'pending':
                return <PendingIcon />;
            default:
                return <PendingIcon />;
        }
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

    const filteredComments = comments.filter(comment =>
        comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
            <Typography variant="h4" color="#fff" sx={{ mb: 3, fontWeight: 600 }}>
                Comment Management
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    {success}
                </Alert>
            )}

            {/* Filters and Actions */}
            <Paper sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 3,
                background: '#1e1e1e',
                border: '1px solid #2d2d2d',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        label="Search comments"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{
                            minWidth: 250,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: '#2d2d2d',
                                color: '#fff',
                                '& fieldset': {
                                    borderColor: '#444'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#666'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#6F4E37'
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#ccc',
                                '&.Mui-focused': {
                                    color: '#6F4E37'
                                }
                            }
                        }}
                    />
                    
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel sx={{ color: '#ccc' }}>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Status"
                            sx={{
                                borderRadius: 2,
                                backgroundColor: '#2d2d2d',
                                color: '#fff',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#444'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#666'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#6F4E37'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: '#ccc'
                                }
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        onClick={fetchComments}
                        startIcon={<RefreshIcon />}
                        sx={{
                            backgroundColor: '#6F4E37',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#5a3d2e'
                            }
                        }}
                    >
                        Refresh
                    </Button>

                    {selectedComments.length > 0 && (
                        <Button
                            onClick={handleBulkDelete}
                            startIcon={<DeleteIcon />}
                            color="error"
                            variant="outlined"
                            sx={{
                                borderColor: '#dc3545',
                                color: '#dc3545',
                                '&:hover': {
                                    borderColor: '#c82333',
                                    backgroundColor: 'rgba(220, 53, 69, 0.1)'
                                }
                            }}
                        >
                            Delete Selected ({selectedComments.length})
                        </Button>
                    )}
                </Box>
            </Paper>

            {/* Comments Table */}
            <Paper sx={{ 
                width: '100%', 
                overflow: 'hidden',
                borderRadius: 3,
                background: '#1e1e1e',
                border: '1px solid #2d2d2d',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#2d2d2d' }}>
                                <TableCell padding="checkbox" sx={{ color: '#fff', borderBottom: '1px solid #444' }}>
                                    <Checkbox
                                        checked={selectedComments.length === comments.length && comments.length > 0}
                                        indeterminate={selectedComments.length > 0 && selectedComments.length < comments.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedComments(comments.map(c => c._id));
                                            } else {
                                                setSelectedComments([]);
                                            }
                                        }}
                                        sx={{
                                            color: '#6F4E37',
                                            '&.Mui-checked': {
                                                color: '#6F4E37'
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid #444', fontWeight: 600 }}>
                                    <strong>Name</strong>
                                </TableCell>
                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid #444', fontWeight: 600 }}>
                                    <strong>Email</strong>
                                </TableCell>
                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid #444', fontWeight: 600 }}>
                                    <strong>Comment</strong>
                                </TableCell>
                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid #444', fontWeight: 600 }}>
                                    <strong>Blog Post</strong>
                                </TableCell>
                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid #444', fontWeight: 600 }}>
                                    <strong>Status</strong>
                                </TableCell>
                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid #444', fontWeight: 600 }}>
                                    <strong>Date</strong>
                                </TableCell>
                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid #444', fontWeight: 600 }}>
                                    <strong>Actions</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredComments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ color: '#ccc' }}>
                                        No comments found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredComments.map((comment) => (
                                    <TableRow key={comment._id} hover sx={{ 
                                        '&:hover': { 
                                            backgroundColor: '#2d2d2d' 
                                        },
                                        '& .MuiTableCell-root': {
                                            borderBottom: '1px solid #444',
                                            color: '#fff'
                                        }
                                    }}>
                                        <TableCell padding="checkbox" sx={{ color: '#fff' }}>
                                            <Checkbox
                                                checked={selectedComments.includes(comment._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedComments([...selectedComments, comment._id]);
                                                    } else {
                                                        setSelectedComments(selectedComments.filter(id => id !== comment._id));
                                                    }
                                                }}
                                                sx={{
                                                    color: '#6F4E37',
                                                    '&.Mui-checked': {
                                                        color: '#6F4E37'
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon sx={{ color: '#6F4E37', fontSize: 20 }} />
                                                {comment.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#ccc' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EmailIcon sx={{ color: '#6F4E37', fontSize: 20 }} />
                                                {comment.email}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff', maxWidth: 200 }}>
                                            <Typography variant="body2" sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {comment.content}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ color: '#ccc' }}>
                                            {comment.blogId?.title || 'Unknown Post'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={getStatusIcon(comment.status)}
                                                label={comment.status}
                                                color={getStatusColor(comment.status)}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    '& .MuiChip-label': {
                                                        color: '#fff'
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#ccc' }}>
                                            {formatDate(comment.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Comment">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewComment(comment)}
                                                        sx={{ 
                                                            color: '#6F4E37',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(111, 78, 55, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                
                                                {comment.status === 'pending' && (
                                                    <>
                                                        <Tooltip title="Approve">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleStatusChange(comment._id, 'approved')}
                                                                sx={{ 
                                                                    color: '#28a745',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(40, 167, 69, 0.1)'
                                                                    }
                                                                }}
                                                            >
                                                                <ApproveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Reject">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleStatusChange(comment._id, 'rejected')}
                                                                sx={{ 
                                                                    color: '#dc3545',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(220, 53, 69, 0.1)'
                                                                    }
                                                                }}
                                                            >
                                                                <RejectIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                                
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        sx={{ 
                                                            color: '#dc3545',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(220, 53, 69, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* View Comment Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" color="#6F4E37">
                        Comment Details
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedComment && (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#6F4E37' }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{selectedComment.name}</Typography>
                                    <Typography variant="body2" color="#6c757d">
                                        {selectedComment.email}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                                {selectedComment.content}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Chip
                                    icon={getStatusIcon(selectedComment.status)}
                                    label={selectedComment.status}
                                    color={getStatusColor(selectedComment.status)}
                                />
                                <Typography variant="body2" color="#6c757d">
                                    {formatDate(selectedComment.createdAt)}
                                </Typography>
                            </Box>
                            
                            <Typography variant="body2" color="#6c757d">
                                <strong>Blog Post:</strong> {selectedComment.blogId?.title || 'Unknown Post'}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommentManagement; 