import { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardMedia, CardContent,
    Chip, Button, CircularProgress, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Comment as CommentIcon,
    Person as PersonIcon,
    ArrowForward as ArrowForwardIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import CommentSection from './CommentSection.jsx';

const Blog = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedPost, setSelectedPost] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            setLoading(true);
            console.log('Fetching blog posts...');
            
            const response = await axios.get('http://localhost:5000/api/v1/blog/posts', {
                params: {
                    status: 'published',
                    limit: 6, // Increased limit to get more posts
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                }
            });

            console.log('Blog posts response:', response.data);
            
            if (response.data.success && response.data.blogs) {
                setBlogPosts(response.data.blogs);
                console.log(`Loaded ${response.data.blogs.length} blog posts`);
                // Log first blog post structure for debugging
                if (response.data.blogs.length > 0) {
                    console.log('First blog post structure:', response.data.blogs[0]);
                    console.log('Content length:', response.data.blogs[0].content?.length);
                    console.log('Excerpt:', response.data.blogs[0].excerpt);
                }
            } else {
                console.log('No blog posts found or invalid response format');
                setBlogPosts([]);
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            console.error('Error details:', error.response?.data || error.message);
            setBlogPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        return `${day} ${month}`;
    };

    const getReadTime = (content) => {
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / 200); // Average 200 words per minute
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === blogPosts.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? blogPosts.length - 1 : prevIndex - 1
        );
    };

    const handleReadMore = async (post) => {
        setSelectedPost(post);
        setDialogOpen(true);
        
        // Track view
        try {
            await axios.post(`http://localhost:5000/api/v1/blog/post/${post._id}/view`);
        } catch (error) {
            console.error('Error tracking view:', error);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPost(null);
    };

    const getVisiblePosts = () => {
        if (blogPosts.length === 0) return [];

        const posts = [...blogPosts];
        const startIndex = currentIndex;
        const visiblePosts = [];

        for (let i = 0; i < 3; i++) {
            const index = (startIndex + i) % posts.length;
            visiblePosts.push(posts[index]);
        }

        return visiblePosts;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
            <Box sx={{
                maxWidth: 1200, mx: 'auto', px: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                py: 4,
            }}>
                <Typography
                    variant="h6"
                    color="#6F4E37"
                    sx={{
                        position: 'relative',
                        mb: 1,
                        "&::before": {
                            content: "''",
                            position: 'absolute',
                            borderBottom: '2px solid #6F4E37',
                            width: '30px',
                            top: '15px',
                            left: '-40px',
                        },
                        "&::after": {
                            content: "''",
                            position: 'absolute',
                            borderBottom: '2px solid #6F4E37',
                            width: '30px',
                            top: '15px',
                            right: '-40px',
                        },
                    }}
                >
                    Updated from
                </Typography>

                <Typography
                    variant="h2"
                    color="#29272E"
                    fontFamily="'Rancho', cursive"
                    textTransform={'uppercase'}
                    mb={4}
                >
                    our featured blog
                </Typography>

                {/* Blog Posts Carousel */}
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    py: 6,
                    px: 2
                }}>
                    {/* Navigation Arrow - Left */}
                    <IconButton
                        onClick={handlePrev}
                        sx={{
                            position: 'absolute',
                            left: { xs: 10, md: 20 },
                            zIndex: 10,
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,1)',
                                transform: 'scale(1.1)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>

                    {/* Blog Posts */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 3, md: 6 },
                        maxWidth: '100%',
                        overflow: 'visible',
                        py: 2
                    }}>
                        {getVisiblePosts().map((post, index) => (
                            <Card
                                key={`${post._id}-${index}`}
                                sx={{
                                    width: { xs: 280, sm: 320, md: 350 },
                                    minHeight: 520,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 4,
                                    position: 'relative',
                                    overflow: 'visible',
                                    boxShadow: index === 1
                                        ? '0 20px 40px rgba(139, 69, 19, 0.15), 0 8px 20px rgba(0,0,0,0.1)'
                                        : '0 8px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: index === 1 ? 'scale(1.08) translateY(-20px)' : 'scale(0.92)',
                                    zIndex: index === 1 ? 3 : 1,
                                    opacity: index === 1 ? 1 : 0.7,
                                    background: index === 1 
                                        ? 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                                        : 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        borderRadius: 4,
                                        padding: index === 1 ? '3px' : '2px',
                                        background: index === 1
                                            ? 'linear-gradient(135deg, #8B4513, #D2691E, #CD853F, #DEB887)'
                                            : 'linear-gradient(135deg, #6c757d, #adb5bd, #ced4da, #dee2e6)',
                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        maskComposite: 'exclude',
                                        opacity: index === 1 ? 0.8 : 0.4,
                                        transition: 'all 0.4s ease'
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        width: '100%',
                                        height: '100%',
                                        transform: 'translate(-50%, -50%)',
                                        background: index === 1
                                            ? 'radial-gradient(circle, rgba(139, 69, 19, 0.1) 0%, transparent 70%)'
                                            : 'radial-gradient(circle, rgba(108, 117, 125, 0.05) 0%, transparent 70%)',
                                        borderRadius: 4,
                                        zIndex: -1,
                                        opacity: 0,
                                        transition: 'opacity 0.4s ease'
                                    },
                                    '&:hover': {
                                        transform: index === 1 ? 'scale(1.12) translateY(-25px)' : 'scale(0.95)',
                                        boxShadow: index === 1
                                            ? '0 25px 50px rgba(139, 69, 19, 0.2), 0 12px 25px rgba(0,0,0,0.15)'
                                            : '0 12px 30px rgba(0,0,0,0.12), 0 6px 15px rgba(0,0,0,0.08)',
                                        '&::before': {
                                            opacity: index === 1 ? 1 : 0.6,
                                            background: index === 1
                                                ? 'linear-gradient(135deg, #8B4513, #D2691E, #CD853F, #DEB887, #8B4513)'
                                                : 'linear-gradient(135deg, #6c757d, #adb5bd, #ced4da, #dee2e6, #6c757d)'
                                        },
                                        '&::after': {
                                            opacity: 1
                                        }
                                    }
                                }}
                            >
                                {/* Metadata Bar */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    px: 2,
                                    py: 1.5,
                                    backgroundColor: index === 1 ? '#f0f8ff' : '#f8f9fa',
                                    borderBottom: `1px solid ${index === 1 ? '#e6f3ff' : '#e9ecef'}`,
                                    flexShrink: 0,
                                    borderRadius: '4px 4px 0 0'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <VisibilityIcon sx={{ fontSize: 14, color: '#6c757d' }} />
                                            <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '0.7rem' }}>
                                                {post.views || 0}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '0.7rem' }}>|</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <CommentIcon sx={{ fontSize: 14, color: '#6c757d' }} />
                                            <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '0.7rem' }}>
                                                {post.commentCount || 0}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '0.7rem' }}>|</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <PersonIcon sx={{ fontSize: 14, color: '#6c757d' }} />
                                            <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '0.7rem' }}>
                                                {post.author?.name || 'Admin'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Image with Date Overlay */}
                                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={post.image ? `http://localhost:5000/uploads/${post.image}` : '/default-blog.jpg'}
                                        alt={post.title}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    {/* Date Overlay */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 12,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: index === 1 ? '#8B4513' : '#6c757d',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: index === 1 ? 55 : 50,
                                        height: index === 1 ? 55 : 50,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        boxShadow: index === 1
                                            ? '0 4px 15px rgba(139, 69, 19, 0.3)'
                                            : '0 2px 10px rgba(0,0,0,0.2)',
                                        border: index === 1 ? '2px solid rgba(255,255,255,0.3)' : 'none'
                                    }}>
                                        <Typography variant="caption" sx={{
                                            fontSize: index === 1 ? '0.65rem' : '0.6rem',
                                            fontWeight: 600
                                        }}>
                                            {formatDate(post.createdAt)}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Content */}
                                <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 1.5,
                                            fontWeight: 700,
                                            color: index === 1 ? '#8B4513' : '#2c3e50',
                                            lineHeight: 1.2,
                                            fontSize: index === 1 ? '1.05rem' : '1rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {post.title || 'Untitled Blog Post'}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#6c757d',
                                            mb: 1.5,
                                            lineHeight: 1.5,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 4,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {post.excerpt || (post.content && post.content.length > 250 
                                            ? post.content.substring(0, 250) + '...' 
                                            : post.content || 'No content available')}
                                    </Typography>
                                    
                                    {/* Temporary debug - remove after testing */}
                                    <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', display: 'block', mt: 0.5 }}>
                                        Content length: {post.content?.length || 0} | 
                                        Has excerpt: {post.excerpt ? 'Yes' : 'No'}
                                    </Typography>
                                    


                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                                            {post.tags.slice(0, 2).map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#e9ecef',
                                                        color: '#495057',
                                                        fontSize: '0.6rem',
                                                        height: 20
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}

                                    {/* Read More Button */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pt: 1 }}>
                                        <Button
                                            endIcon={<ArrowForwardIcon />}
                                            size="small"
                                            sx={{
                                                color: index === 1 ? '#8B4513' : '#6c757d',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: index === 1 ? '0.85rem' : '0.8rem',
                                                '&:hover': {
                                                    backgroundColor: index === 1
                                                        ? 'rgba(139, 69, 19, 0.15)'
                                                        : 'rgba(108, 117, 125, 0.1)'
                                                }
                                            }}
                                            onClick={() => handleReadMore(post)}
                                        >
                                            Read More &gt;&gt;
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    {/* Navigation Arrow - Right */}
                    <IconButton
                        onClick={handleNext}
                        sx={{
                            position: 'absolute',
                            right: { xs: 10, md: 20 },
                            zIndex: 10,
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,1)',
                                transform: 'scale(1.1)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>

                {/* No Posts Message */}
                {blogPosts.length === 0 && !loading && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" sx={{ color: '#6c757d', mb: 2 }}>
                            No blog posts available at the moment
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d', mb: 3 }}>
                            Check back soon for our latest articles and recipes!
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.9rem' }}>
                            (Admin can create blog posts from the admin dashboard)
                        </Typography>
                    </Box>
                )}

                {/* Carousel Indicators */}
                {blogPosts.length > 3 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        mt: 4
                    }}>
                        {Array.from({ length: Math.ceil(blogPosts.length / 3) }, (_, i) => (
                            <Box
                                key={i}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: currentIndex >= i * 3 && currentIndex < (i + 1) * 3
                                        ? '#8B4513'
                                        : '#e9ecef',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => setCurrentIndex(i * 3)}
                            />
                        ))}
                    </Box>
                )}

                {/* View All Posts Button */}
                {blogPosts.length > 0 && (
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: '#8B4513',
                                color: '#8B4513',
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                '&:hover': {
                                    borderColor: '#6F4E34',
                                    backgroundColor: 'rgba(139, 69, 19, 0.1)'
                                }
                            }}
                        >
                            View All Posts
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Blog Post Dialog */}
            {selectedPost && (
                <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedPost.title}</Typography>
                        <IconButton onClick={handleCloseDialog} sx={{ color: '#6c757d' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={selectedPost.image ? `http://localhost:5000/uploads/${selectedPost.image}` : '/default-blog.jpg'}
                                alt={selectedPost.title}
                                sx={{ objectFit: 'cover', borderRadius: 2 }}
                            />
                            <Box sx={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: 2,
                                fontSize: '0.8rem'
                            }}>
                                {formatDate(selectedPost.createdAt)}
                            </Box>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{selectedPost.title}</Typography>
                        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {selectedPost.content}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VisibilityIcon sx={{ fontSize: 18, color: '#6c757d' }} />
                                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {selectedPost.views || 0} views
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CommentIcon sx={{ fontSize: 18, color: '#6c757d' }} />
                                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {selectedPost.commentCount || 0} comments
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PersonIcon sx={{ fontSize: 18, color: '#6c757d' }} />
                                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    By {selectedPost.author?.name || 'Admin'}
                                </Typography>
                            </Box>
                        </Box>
                        
                        {/* Comments Section */}
                        <Divider sx={{ my: 3 }} />
                        <CommentSection blogId={selectedPost._id} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default Blog; 