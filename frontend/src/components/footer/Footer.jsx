import React from 'react'
import Box from '@mui/material/Box';
import bgImage from "../../assets/footer-bg.jpg"
import bgSmallImage from "../../assets/ft-res-bg.jpg"
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import socialIcons from './SocialIcons';
import Grid from '@mui/material/Grid';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import EmailIcon from '@mui/icons-material/Email';
const Footer = () => {
    return (
        <>
            <Box
                sx={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    minHeight: "200px",
                    position: "relative",
                    color: "#fff",
                    padding: "2rem",
                }}
            >
                <Container maxWidth={'xl'} sx={{ position: "relative", minHeight: "500px" }}>
                    <Grid container spacing={2} alignItems="stretch">
                        <Grid item xs={12} sm={6} md={6}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: 'column',
                                alignContent: 'center',
                                justifyContent: "center",
                                // width: { xs: "100%", md: "60%" },
                                // padding: "2rem",
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: "row",
                                    flexWrap: 'wrap',
                                    justifyContent: "space-between",
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    margin: "20px 0"
                                }}>
                                    <Typography variant="h4" fontStyle={'italic'}>Reservation Cafe</Typography>
                                    <Box sx={{ display: "flex", gap: 2, }}>
                                        {
                                            socialIcons.map((icon, id) => (
                                                <Box key={id} sx={{
                                                    width: 40,
                                                    height: 40,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#191c1e",
                                                    mx: 1,
                                                    transition: "ease-in-out 0.3s",
                                                    '&:hover': {
                                                        bgcolor: "#f15f2a"
                                                    }
                                                }}>
                                                    <a href={icon.url} target="_blank" rel="noopener noreferrer" title={icon.name} style={{
                                                        color: "white", fontSize: "20px", display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}>
                                                        {icon.icon}
                                                    </a>
                                                </Box>
                                            ))
                                        }
                                    </Box>

                                </Box>
                                <Typography variant="body1" mt={"20px"} color='#BCBAC1' fontSize={"17px"}>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore <br /> magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo <br /> consequat Duis aute irure dolor.
                                </Typography>
                                <Box sx={{ width: '100%', my: 2 }}>
                                    <Divider sx={{ bgcolor: "#fff", opacity: 0.2 }} />
                                </Box>
                                <Grid container spacing={10}>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Box>
                                                <LocationOnSharpIcon sx={{
                                                    fontSize: '30px'
                                                }} />
                                                <Divider sx={{ bgcolor: '#fff', height: '2px' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant='body1' sx={{
                                                    color: '#BCBAC1',
                                                    padding: '0 15px',
                                                    margin: '5px 0'
                                                }}>
                                                    157 White Oak Drive Kansas City
                                                </Typography>
                                                <Typography variant='body1' sx={{
                                                    color: '#BCBAC1',
                                                    padding: '0 15px',
                                                }}>
                                                    689 Lynn Street South Boston
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={4} md={4}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Box>
                                                <SmartphoneRoundedIcon sx={{
                                                    fontSize: '30px'
                                                }} />
                                                <Divider sx={{ bgcolor: '#fff', height: '2px' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant='body1' sx={{
                                                    color: '#BCBAC1',
                                                    padding: '0 15px',
                                                }}>
                                                    (617)-276-8031
                                                </Typography>
                                                <Typography variant='body1' sx={{
                                                    color: '#BCBAC1',
                                                    padding: '0 15px',
                                                    margin: "5px 0"
                                                }}>
                                                    (617)-276-8031
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={4} md={4}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Box >
                                                <EmailIcon sx={{
                                                    fontSize: '30px'
                                                }} />
                                                <Divider sx={{ bgcolor: '#fff', height: '2px' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant='body1' sx={{
                                                    color: '#BCBAC1',
                                                    padding: '0 15px',
                                                }}>
                                                    admin@fooday.com
                                                </Typography>
                                                <Typography variant='body1' sx={{
                                                    color: '#BCBAC1',
                                                    padding: '0 15px',
                                                    margin: '5px 0'
                                                }}>
                                                    support@fooday.com
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {/* </Box> */}
                                    </Grid>
                                </Grid>
                            </Box>

                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: { xs: "unset", md: "20%" },
                                    right: { xs: "unset", md: "0-2rem" },
                                    transform: { xs: "none", md: "translateY(-50%)" },
                                    width: { xs: "100%", md: "30%" },
                                    backgroundImage: `url(${bgSmallImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    border: "1px solid white",
                                    padding: "2rem",
                                    zIndex: 10,
                                }}
                            >
                                <Container sx={{ border: '1px solid white' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography
                                            variant="h3"
                                            textAlign="center"
                                            m="20px"
                                            fontFamily="'Rancho', cursive"
                                        >
                                            Open Hours
                                        </Typography>

                                        {/* Days Loop Example */}
                                        {[
                                            'Monday',
                                            'Tuesday',
                                            'Wednesday',
                                            'Thursday',
                                            'Friday',
                                            'Saturday',
                                            'Sunday',
                                        ].map((day, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    margin: '7px 0',
                                                }}
                                            >
                                                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                    {day}:
                                                </Typography>
                                                <Typography sx={{ color: '#1d1b20', fontWeight: 600 }}>
                                                    7:00 AM - 9:00 PM
                                                </Typography>
                                            </Box>
                                        ))}

                                        <Typography
                                            variant="h4"
                                            textAlign="center"
                                            m="10px"
                                            fontFamily="'Rancho', cursive"
                                        >
                                            Reservation Number
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            color="black"
                                            textAlign="center"
                                            mb="20px"
                                            fontFamily="'Rancho', cursive"
                                        >
                                            (617)-276-8031
                                        </Typography>
                                    </Box>
                                </Container>
                            </Box>
                        </Grid>

                    </Grid>

                </Container>
            </Box>

        </>
    )
}

export default Footer