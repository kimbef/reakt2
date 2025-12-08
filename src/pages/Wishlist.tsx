import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Grid,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const products = useSelector((state: RootState) => state.products.items);

  const isLightMode = useColorModeValue(true, false);

  const favoriteProducts = products.filter(product => user?.favorites.includes(product.id));

  return (
    <Box className="animated-gradient-bg" minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Box
          className={isLightMode ? "glass-effect" : "dark-glass-effect"}
          p={6}
          borderRadius="lg"
        >
          <VStack align="stretch" spacing={8}>
            <Heading size="xl">My Wishlist</Heading>
            {favoriteProducts.length > 0 ? (
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(5, 1fr)'
                }}
                gap={6}
              >
                {favoriteProducts.map(product => (
                  <Box
                    key={product.id}
                    className={isLightMode ? "glass-card" : "dark-glass-effect"}
                    borderRadius="lg"
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-4px) scale(1.02)',
                    }}
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      height="200px"
                      width="100%"
                      objectFit="cover"
                      onClick={() => navigate(`/product/${product.id}`)}
                      cursor="pointer"
                      transition="all 0.5s"
                      _hover={{ transform: 'scale(1.05)' }}
                    />
                    <VStack p={4} spacing={2} align="stretch">
                      <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        noOfLines={1}
                        cursor="pointer"
                        onClick={() => navigate(`/product/${product.id}`)}
                        _hover={{ color: 'blue.500' }}
                      >
                        {product.name}
                      </Text>
                      <Text
                        color={isLightMode ? "gray.700" : "gray.300"}
                        fontSize="sm"
                        noOfLines={2}
                        height="40px"
                      >
                        {product.description}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </Grid>
            ) : (
              <Text>Your wishlist is empty.</Text>
            )}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Wishlist;
