import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'
import AboutImage from "../../../assets/home1-about.png"
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { GiKnifeFork, GiWineBottle } from "react-icons/gi";

const About = () => {
    return (
        <>
            <Container maxWidth={'xl'}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        py: 4,
                        marginBottom: "5%"
                    }}
                >
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
                        About us
                    </Typography>

                    <Typography
                        variant="h2"
                        color="#29272E"
                        fontFamily="'Rancho', cursive"
                        mb={4}
                    >
                        Our Story
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            mb: 4
                        }}
                    >
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, minWidth: 0 }}>
                            <img
                                src={AboutImage}
                                alt="About"
                                style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: 16 }}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, minWidth: 0, p: { xs: 0, sm: 2 } }}>
                            <Typography variant="h6" fontWeight={700}>
                                WE HAVE THE GLORY BEGINNING IN RESTAURANT BUSINESS WITH SOME UNIQUE FEATURES.
                            </Typography>
                            <Typography variant='body1' color='#616f7d' m={'10px 0'}>
                                <strong>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ullam laboris nisi ut aliquip ex ea commodo consequat.
                                </strong>
                            </Typography>
                            <Grid container spacing={4} sx={{ marginTop: { xs: 3, md: "70px" } }}>
                                {/* Fresh Menu */}
                                <Grid item xs={12} md={4} >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'ease-in-out 0.3s',
                                            cursor: 'pointer',
                                            "&:hover": {
                                                color: '#f15f2a',
                                                "& > .circle-container": {
                                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                                    transform: 'translateY(-5px)'
                                                }
                                            },
                                            mb: { xs: 3, md: 0 }
                                        }}
                                    >
                                        <Box
                                            className="circle-container"
                                            sx={{
                                                border: '1px dashed #6F4E37',
                                                width: 135,
                                                height: 135,
                                                bgcolor: 'white',
                                                borderRadius: "50%",
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                transition: 'ease-in-out 0.3s',
                                            }}
                                        >
                                            <MenuBookIcon fontSize='3.75rem' sx={{ width: "35%", height: "35%" }} />
                                        </Box>
                                        <Typography variant='body1' fontSize={'17px'} fontWeight={600} sx={{ margin: "20px 0" }}>
                                            FRESH MENU
                                        </Typography>
                                    </Box>
                                </Grid>
                                {/* Exclusive Dishes */}
                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            transition: 'ease-in-out 0.3s',
                                            cursor: 'pointer',
                                            "&:hover": {
                                                color: '#f15f2a',
                                                "& > .circle-container": {
                                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                                    transform: 'translateY(-5px)'
                                                }
                                            },
                                            mb: { xs: 3, md: 0 }
                                        }}
                                    >
                                        <Box
                                            className="circle-container"
                                            sx={{
                                                border: '1px dashed #6F4E37',
                                                width: 135,
                                                height: 135,
                                                bgcolor: 'white',
                                                borderRadius: "50%",
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                transition: 'ease-in-out 0.3s',
                                            }}
                                        >
                                            <GiKnifeFork fontSize='3.75rem' style={{ width: "35%", height: "35%" }} />
                                        </Box>
                                        <Typography variant='body1' fontSize={'17px'} fontWeight={600} sx={{ margin: "20px 0" }}>
                                            EXCLUSIVE DISHES
                                        </Typography>
                                    </Box>
                                </Grid>
                                {/* Various Drinks */}
                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            transition: 'ease-in-out 0.3s',
                                            cursor: 'pointer',
                                            "&:hover": {
                                                color: '#f15f2a',
                                                "& > .circle-container": {
                                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                                    transform: 'translateY(-5px)'
                                                }
                                            },
                                            mb: { xs: 3, md: 0 }
                                        }}
                                    >
                                        <Box
                                            className="circle-container"
                                            sx={{
                                                border: '1px dashed #6F4E37',
                                                width: 135,
                                                height: 135,
                                                bgcolor: 'white',
                                                borderRadius: "50%",
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                transition: 'ease-in-out 0.3s',
                                            }}
                                        >
                                            <GiWineBottle fontSize='3.75rem' style={{ width: "35%", height: "35%" }} />
                                        </Box>
                                        <Typography variant='body1' fontSize={'17px'} fontWeight={600} sx={{ margin: "20px 0" }}>
                                            VARIOUS DRINKS
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>

                </Box>
            </Container>
        </>
    )
}

export default About