import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../store/slices/productsSlice';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: products, isLoading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 4);
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.100, purple.100)',
    'linear(to-r, blue.900, purple.900)'
  );

  const categories = [
    { name: 'Electronics', image: 'https://source.unsplash.com/random/400x300/?electronics' },
    { name: 'Fashion', image: 'https://source.unsplash.com/random/400x300/?fashion' },
    { name: 'Home & Living', image: 'https://source.unsplash.com/random/400x300/?home' },
    { name: 'Sports', image: 'https://source.unsplash.com/random/400x300/?sports' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        py={20}
        px={4}
        textAlign="center"
      >
        <Container maxW="container.xl">
          <VStack spacing={6}>
            <Heading size="2xl">Welcome to E-Shop</Heading>
            <Text fontSize="xl" maxW="container.md">
              Discover amazing products at great prices. Shop now and enjoy exclusive deals!
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate('/products')}
            >
              Shop Now
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxW="container.xl" py={16}>
        <Heading size="xl" mb={8}>Featured Products</Heading>
        {isLoading ? (
          <Text>Loading products...</Text>
        ) : (
          <Grid
            templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
            gap={6}
          >
            {featuredProducts.map(product => (
              <Box
                key={product.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                _hover={{ shadow: 'lg' }}
                onClick={() => navigate(`/product/${product.id}`)}
                cursor="pointer"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Text fontSize="xl" fontWeight="semibold" mb={2}>
                    {product.name}
                  </Text>
                  <Text color="blue.600" fontSize="lg" fontWeight="bold">
                    ${product.price}
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Container>

      {/* Categories */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
        <Container maxW="container.xl">
          <Heading size="xl" mb={8}>Shop by Category</Heading>
          <SimpleGrid columns={[1, 2, 4]} spacing={6}>
            {categories.map(category => (
              <Box
                key={category.name}
                borderRadius="lg"
                overflow="hidden"
                position="relative"
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => navigate('/products')}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  bg="blackAlpha.600"
                  p={4}
                >
                  <Text color="white" fontSize="xl" fontWeight="bold">
                    {category.name}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 