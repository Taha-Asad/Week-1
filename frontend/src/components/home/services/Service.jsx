import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { GiKnifeFork, GiWineBottle } from "react-icons/gi";
const Service = () => {
    const serviceIte = [
        { title: "Reservation", icon: < GiWineBottle />, desc: "Lorem ipsum dolor sit amet, tong consecteturto sed eiusmod incididunt utote labore et" },
        { title: "Reservation", icon: <GiKnifeFork />, desc: "Lorem ipsum dolor sit amet, tong consecteturto sed eiusmod incididunt utote labore et" },
        { title: "Reservation", icon: <GiKnifeFork />, desc: "Lorem ipsum dolor sit amet, tong consecteturto sed eiusmod incididunt utote labore et" },
        { title: "Reservation", icon: <GiWineBottle />, desc: "Lorem ipsum dolor sit amet, tong consecteturto sed eiusmod incididunt utote labore et" }
    ]
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    py: 4,
                    marginBottom: "10%"
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
                    Our Services
                </Typography>

                <Typography
                    variant="h2"
                    color="#29272E"
                    fontFamily="'Rancho', cursive"
                    mb={4}
                >
                    What we focus On
                </Typography>
                <Container>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        {
                            serviceIte.map((item, id) => {
                                return (
                                    <>
                                        <Box key={id}

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
                                                }
                                            }
                                            }>
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
                                                <Box fontSize='3.75rem' sx={{ width: "35%", height: "35%" }}>{item.icon} </Box>
                                            </Box>
                                            <Typography variant='h5' fontSize={'17px'} fontWeight={600} sx={{ margin: "20px 0" }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant='body1' textAlign={'center'}>
                                                {item.desc}
                                            </Typography>
                                        </Box>
                                    </>
                                )
                            })
                        }
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default Service