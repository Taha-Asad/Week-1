import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Reply as ReplyIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';

const ContactPage = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [replyDialogOpen, setReplyDialogOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchContacts();
        fetchStats();
    }, [page, rowsPerPage, statusFilter, searchTerm]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/v1/admin/contact/all', {
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    status: statusFilter,
                    search: searchTerm
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            setContacts(response.data.contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setError('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/admin/contact/stats', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleViewContact = async (contactId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/admin/contact/${contactId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            setSelectedContact(response.data.contact);
            setViewDialogOpen(true);
        } catch (error) {
            console.error('Error fetching contact:', error);
            setError('Failed to fetch contact details');
        }
    };

    const handleReply = async () => {
        try {
            await axios.put(`http://localhost:5000/api/v1/admin/contact/${selectedContact._id}/reply`, {
                adminReply: replyMessage
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            setReplyDialogOpen(false);
            setReplyMessage('');
            setSelectedContact(null);
            fetchContacts();
            fetchStats();
        } catch (error) {
            console.error('Error sending reply:', error);
            setError('Failed to send reply');
        }
    };

    const handleStatusChange = async (contactId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/v1/admin/contact/${contactId}/status`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            fetchContacts();
            fetchStats();
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update status');
        }
    };

    const handleDeleteContact = async (contactId) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/v1/admin/contact/${contactId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            fetchContacts();
            fetchStats();
        } catch (error) {
            console.error('Error deleting contact:', error);
            setError('Failed to delete contact');
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedContacts.length} contacts?`)) return;

        try {
            await axios.delete('http://localhost:5000/api/v1/admin/contact/bulk-delete', {
                data: { contactIds: selectedContacts },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            setSelectedContacts([]);
            fetchContacts();
            fetchStats();
        } catch (error) {
            console.error('Error bulk deleting contacts:', error);
            setError('Failed to delete contacts');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unread':
                return 'error';
            case 'read':
                return 'warning';
            case 'replied':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'unread':
                return <ErrorIcon />;
            case 'read':
                return <WarningIcon />;
            case 'replied':
                return <CheckCircleIcon />;
            default:
                return <ScheduleIcon />;
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

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" color="#6F4E37" sx={{ mb: 3, fontWeight: 600 }}>
                Contact Management
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #6F4E37 0%, #8B7355 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                        {stats.total || 0}
                                    </Typography>
                                    <Typography variant="body2">Total Messages</Typography>
                                </Box>
                                <EmailIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                        {stats.unread || 0}
                                    </Typography>
                                    <Typography variant="body2">Unread</Typography>
                                </Box>
                                <ErrorIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #ffc107 0%, #f39c12 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                        {stats.read || 0}
                                    </Typography>
                                    <Typography variant="body2">Read</Typography>
                                </Box>
                                <WarningIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                        {stats.replied || 0}
                                    </Typography>
                                    <Typography variant="body2">Replied</Typography>
                                </Box>
                                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters and Actions */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Search contacts"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="unread">Unread</MenuItem>
                                <MenuItem value="read">Read</MenuItem>
                                <MenuItem value="replied">Replied</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {selectedContacts.length > 0 && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleBulkDelete}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete Selected ({selectedContacts.length})
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Contacts Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedContacts.length === contacts.length && contacts.length > 0}
                                        indeterminate={selectedContacts.length > 0 && selectedContacts.length < contacts.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedContacts(contacts.map(c => c._id));
                                            } else {
                                                setSelectedContacts([]);
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Subject</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : contacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No contacts found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contacts.map((contact) => (
                                    <TableRow key={contact._id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedContacts.includes(contact._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedContacts([...selectedContacts, contact._id]);
                                                    } else {
                                                        setSelectedContacts(selectedContacts.filter(id => id !== contact._id));
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon sx={{ color: '#6F4E37', fontSize: 20 }} />
                                                {contact.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EmailIcon sx={{ color: '#6F4E37', fontSize: 20 }} />
                                                {contact.email}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{contact.subject}</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={getStatusIcon(contact.status)}
                                                label={contact.status}
                                                color={getStatusColor(contact.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(contact.createdAt)}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewContact(contact._id)}
                                                    sx={{ color: '#6F4E37' }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                {contact.status !== 'replied' && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedContact(contact);
                                                            setReplyDialogOpen(true);
                                                        }}
                                                        sx={{ color: '#28a745' }}
                                                    >
                                                        <ReplyIcon />
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteContact(contact._id)}
                                                    sx={{ color: '#dc3545' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={contacts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>

            {/* View Contact Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" color="#6F4E37">
                        Contact Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedContact && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedContact.name}
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedContact.email}
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary">
                                        Subject
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedContact.subject}
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary">
                                        Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {formatDate(selectedContact.createdAt)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Chip
                                        icon={getStatusIcon(selectedContact.status)}
                                        label={selectedContact.status}
                                        color={getStatusColor(selectedContact.status)}
                                        sx={{ mb: 2 }}
                                    />

                                    {selectedContact.adminReply && (
                                        <>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Admin Reply
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 2 }}>
                                                {selectedContact.adminReply}
                                            </Typography>
                                        </>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Message
                                    </Typography>
                                    <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', mt: 1 }}>
                                        <Typography variant="body1">
                                            {selectedContact.message}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                    {selectedContact && selectedContact.status !== 'replied' && (
                        <Button
                            onClick={() => {
                                setViewDialogOpen(false);
                                setReplyDialogOpen(true);
                            }}
                            variant="contained"
                            startIcon={<ReplyIcon />}
                        >
                            Reply
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Reply Dialog */}
            <Dialog
                open={replyDialogOpen}
                onClose={() => setReplyDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" color="#6F4E37">
                        Reply to {selectedContact?.name}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Your Reply"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleReply}
                        variant="contained"
                        disabled={!replyMessage.trim()}
                        startIcon={<ReplyIcon />}
                    >
                        Send Reply
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ContactPage; 