import { useState, useEffect } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Chip, TextField,
    MenuItem, Select, Pagination, Stack, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, CircularProgress
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const ReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReservations, setTotalReservations] = useState(0);
    const [filters, setFilters] = useState({
        status: '',
        date: '',
        from: '',
        to: '',
        search: '',
        useFilterEndpoint: false // New flag to determine which endpoint to use
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [note, setNote] = useState('');

    const fetchReservations = async () => {
        try {
            setLoading(true);

            const hasFilters = filters.status || filters.date || filters.search || (filters.from && filters.to);
            const endpoint = hasFilters ? '/filter' : '/all-reservations';

            const params = {
                page,
                limit: 10,
                ...(filters.status && { status: filters.status }),
                ...(filters.date && { date: moment(filters.date).format('YYYY-MM-DD') }),
                ...(filters.from && filters.to && {
                    from: moment(filters.from).format('YYYY-MM-DD'),
                    to: moment(filters.to).format('YYYY-MM-DD')
                }),
                ...(filters.search && { search: filters.search })
            };

            const response = await axios.get(`http://localhost:5000/api/v1/admin${endpoint}`, {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            // Handle different response structures
            const data = response.data || {};
            let reservationList = [];
            let total = 0;

            if (endpoint === '/filter') {
                reservationList = Array.isArray(data.reservation) ? data.reservation : [];
                total = data.total || 0;
            } else {
                reservationList = Array.isArray(data.reservation) ? data.reservation : [];
                total = data.count || 0;
            }

            setReservations(reservationList);
            setTotalReservations(total);
            setTotalPages(Math.ceil(total / 10));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch reservations');
            setReservations([]);
            setTotalReservations(0);
            console.log(totalReservations);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Debounce filter changes to prevent too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReservations();
        }, 500);

        return () => clearTimeout(timer);
    }, [filters, page]);

    const handleStatusChange = async (reservationId, status) => {
        try {
            await axios.put(`http://localhost:5000/api/v1/admin/reservations/${reservationId}`,
                { status, note },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                }
            );
            toast.success(`Reservation ${status}`);
            fetchReservations();
            setOpenDialog(false);
            setNote('');
        } catch (error) {
            toast.error(`Failed to update status: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/admin/delete-reservation/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            toast.success('Reservation deleted successfully');
            fetchReservations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete reservation');
        }
    };

    const handleOpenDialog = (reservation, action) => {
        setSelectedReservation({ ...reservation, action });
        setOpenDialog(true);
    };

    const handleFilterChange = (name, value) => {
        setPage(1); // Reset to first page when filters change
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setPage(1);
        setFilters({
            status: '',
            date: '',
            from: '',
            to: '',
            search: '',
            useFilterEndpoint: false
        });
    };

    const StatusChip = ({ status }) => {
        const color = status === 'approved' ? 'success' :
            status === 'rejected' ? 'error' : 'warning';
        return <Chip label={status} color={color} size="small" />;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#fff', mb: 3 }}>
                Reservations Management
            </Typography>

            {/* Filter Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    size="small"
                    placeholder="Search by name or ID"
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: '#909090', mr: 1 }} />,
                        sx: { backgroundColor: '#1e1e1e', color: '#fff' }
                    }}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <Select
                    size="small"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    displayEmpty
                    sx={{
                        backgroundColor: '#1e1e1e',
                        color: '#fff',
                        minWidth: 120,
                        '& .MuiSelect-icon': { color: '#fff' }
                    }}
                >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
                <TextField
                    size="small"
                    type="date"
                    label="Single Date"
                    InputLabelProps={{
                        shrink: true,
                        sx: { color: '#909090' }
                    }}
                    InputProps={{
                        sx: {
                            backgroundColor: '#1e1e1e',
                            color: '#fff',
                            '& .MuiSvgIcon-root': {
                                color: '#6F4E34',
                            },
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#2d2d2d',
                            },
                            '&:hover fieldset': {
                                borderColor: '#6F4E34',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#6F4E34',
                            },
                        },
                    }}
                    value={filters.date}
                    onChange={(e) => {
                        handleFilterChange('date', e.target.value);
                        handleFilterChange('from', '');
                        handleFilterChange('to', '');
                    }}
                />
                <TextField
                    size="small"
                    type="date"
                    label="From Date"
                    InputLabelProps={{
                        shrink: true,
                        sx: { color: '#909090' }
                    }}
                    InputProps={{
                        sx: {
                            backgroundColor: '#1e1e1e',
                            color: '#fff',
                            '& .MuiSvgIcon-root': {
                                color: '#6F4E34',
                            },
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#2d2d2d',
                            },
                            '&:hover fieldset': {
                                borderColor: '#6F4E34',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#6F4E34',
                            },
                        },
                    }}
                    value={filters.from}
                    onChange={(e) => {
                        handleFilterChange('from', e.target.value);
                        handleFilterChange('date', '');
                    }}
                />
                <TextField
                    size="small"
                    type="date"
                    label="To Date"
                    InputLabelProps={{
                        shrink: true,
                        sx: { color: '#909090' }
                    }}
                    InputProps={{
                        sx: {
                            backgroundColor: '#1e1e1e',
                            color: '#fff',
                            '& .MuiSvgIcon-root': {
                                color: '#6F4E34',
                            },
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#2d2d2d',
                            },
                            '&:hover fieldset': {
                                borderColor: '#6F4E34',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#6F4E34',
                            },
                        },
                    }}
                    value={filters.to}
                    onChange={(e) => {
                        handleFilterChange('to', e.target.value);
                        handleFilterChange('date', '');
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<FilterIcon />}
                    onClick={handleClearFilters}
                    sx={{
                        backgroundColor: '#6F4E34',
                        '&:hover': { backgroundColor: '#5a3e2a' }
                    }}
                >
                    Clear Filters
                </Button>
            </Box>

            {/* Reservations Table */}
            <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Date & Time</TableCell>
                            <TableCell sx={{ color: '#fff' }}>People</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : reservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: '#fff' }}>
                                    No reservations found
                                </TableCell>
                            </TableRow>
                        ) : (
                            reservations.map((reservation) => (
                                <TableRow key={reservation._id}>
                                    <TableCell sx={{ color: '#fff' }}>{reservation.reservationID}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{reservation.name}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>
                                        {moment(reservation.date).format('MMM Do YYYY')} at {reservation.time}
                                    </TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{reservation.noOfPeople}</TableCell>
                                    <TableCell>
                                        <StatusChip status={reservation.status} />
                                    </TableCell>
                                    <TableCell>
                                        {reservation.status === 'pending' && (
                                            <>
                                                <IconButton
                                                    onClick={() => handleOpenDialog(reservation, 'approve')}
                                                    sx={{ color: '#4caf50' }}
                                                >
                                                    <ApproveIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleOpenDialog(reservation, 'reject')}
                                                    sx={{ color: '#f44336', ml: 1 }}
                                                >
                                                    <RejectIcon />
                                                </IconButton>
                                            </>
                                        )}
                                        <IconButton
                                            onClick={() => handleDelete(reservation._id)}
                                            sx={{ color: '#ff5252', ml: 1 }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#fff',
                        },
                        '& .Mui-selected': {
                            backgroundColor: '#6F4E34',
                        },
                    }}
                />
            </Box>

            {/* Approval/Rejection Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {selectedReservation?.action === 'approve' ? 'Approve Reservation' : 'Reject Reservation'}
                    <IconButton
                        onClick={() => setOpenDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        {selectedReservation?.action === 'approve'
                            ? 'Are you sure you want to approve this reservation?'
                            : 'Please provide a reason for rejection (optional)'}
                    </Typography>
                    {selectedReservation?.action === 'reject' && (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Reason for rejection"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={() => handleStatusChange(
                            selectedReservation?._id,
                            selectedReservation?.action === 'approve' ? 'approved' : 'rejected'
                        )}
                        color={selectedReservation?.action === 'approve' ? 'success' : 'error'}
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReservationsPage;