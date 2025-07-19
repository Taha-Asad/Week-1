import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import IcecreamIcon from '@mui/icons-material/Icecream';
import CoffeeIcon from '@mui/icons-material/Coffee';
import axios from "axios"
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import breakFast from "../../../assets/pd-cat-lunch.png";
import lunch from "../../../assets/pd-cat-lunch.png";
import dessert from "../../../assets/pd-cat-dessert.png";
import dinner from "../../../assets/pd-cat-dinner.png";
import drinks from "../../../assets/pd-cat-dinner.png";
const menuIcons = [
  { key: 'breakfast', text: 'Breakfast', icon: <KebabDiningIcon />, image: breakFast  },
  { key: 'lunch', text: 'Lunch', icon: <RamenDiningIcon />, image: lunch  },
  { key: 'dinner', text: 'Dinner', icon: <DinnerDiningIcon />, image:  dinner },
  { key: 'dessert', text: 'Dessert', icon: <IcecreamIcon />, image:  dessert  },
  { key: 'drinks', text: 'Drinks', icon: <CoffeeIcon />, image: drinks  },
];
const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('breakfast');
  const [activeMenu, setActiveMenu] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUrl = async (category) => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:5000/api/v1/user/menu?category=${category}`);
      setActiveMenu(res.data.data || []);
      console.log(`Data: ${res.data.data}`)
    } catch (error) {
      console.error(`Error fetching data from backend: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUrl(activeCategory)
  }, [activeCategory])
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
        }}
      >
        {/* Heading with Lines */}
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
          Our Menu
        </Typography>

        <Typography
          variant="h2"
          color="#29272E"
          fontFamily="'Rancho', cursive"
          textAlign={'center'}
          mb={4}
        >
          Tasty and Good Price
        </Typography>

        {/* Icon Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
            mb: 4,
          }}
        >
          {menuIcons.map((item, index) => (
            <Box
              key={index}
              onClick={() => setActiveCategory(item.key)}
              sx={{
                cursor: 'pointer',
                width: 80,
                height: 80,
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border:
                  activeCategory === item.key
                    ? '2px solid #f15f2a'
                    : '1px solid #6F4E37',
                backgroundColor:
                  activeCategory === item.key ? '#6F4E37' : 'transparent',
                color:
                  activeCategory === item.key ? '#fff' : '#6F4E37',
                transition: '0.3s ease',
                '&:hover': {
                  backgroundColor: '#f15f2a',
                  color: '#fff',
                },
              }}
            >
              {item.icon}
              <Typography
                variant="caption"
                fontWeight="bold"
                mt={0.5}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Active Category Title */}
        {/* <Typography
          variant="h5"
          fontWeight="bold"
          color="#29272E"
          fontFamily="'Rancho', cursive"
        >
          {activeCategory.charAt(0).toUpperCase() +
            activeCategory.slice(1)}{' '}
          Menu Coming Soon!
        </Typography>
        {

        } */}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'flex-start',
              mt: 4,
            }}
          >
            {/* Left Side Category Image */}
            <Box
              sx={{
                width: { xs: '100%', md: '30%' },
                textAlign: 'center',
              }}
            >
              <img
                src={menuIcons.find(icon => icon.key === activeCategory)?.image}
                alt={activeCategory}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                }}
              />
              <Typography
                variant="h6"
                mt={1}
                fontWeight="bold"
                color="#6F4E37"
                fontFamily="'Rancho', cursive"
              >
                {activeCategory.toUpperCase()}
              </Typography>
            </Box>

            {/* Right Side Grid of Items */}
            <Box
              sx={{
                width: { xs: '100%', md: '65%' },
                display: 'grid',
              }}
            >
              {activeMenu.slice(0, 5).map((item) => (
                <Container>
                  <Box
                    key={item._id}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1, // Add some spacing between elements
                    }}
                  >
                    {/* Name and description */}
                    <Box sx={{ flexShrink: 1, minWidth: 0 }}> {/* Prevent overflow */}
                      <Typography
                        variant="h4"
                        mt={1}
                        fontFamily={"'Rancho', cursive"}
                        noWrap // Prevent text wrapping
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>

                    {/* Divider that grows to fill available space */}
                    <Divider
                      sx={{
                        bgcolor: 'black',
                        flexGrow: 1, // Makes the divider expand
                        mx: 1, // Horizontal margin
                        minWidth: 30, // Minimum width
                      }}
                    />

                    {/* Price - prevent wrapping */}
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mt={1}
                      fontFamily={"'Rancho', cursive"}
                      color='#6F4E37'
                      sx={{ flexShrink: 0, mb: 3 }}
                    >
                      Rs {item.price}
                    </Typography>
                  </Box>
                </Container>
              ))}
            </Box>
          </Box>
        )}

      </Box>
    </>
  );
};

export default Menu;
