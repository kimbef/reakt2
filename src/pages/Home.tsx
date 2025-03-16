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
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=300&h=200',
    },
    {
      name: 'Gaming',
      image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=300&h=200',
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=200',
    },
    {
      name: 'Home',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300&h=200',
    },
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate('/products', { state: { selectedCategory: categoryName } });
  };

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
            <Heading size="2xl">Welcome to ReaktShop</Heading>
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
                _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                transition="all 0.3s"
                cursor="pointer"
                onClick={() => navigate(`/product/${product.id}`)}
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
          <VStack spacing={12}>
            <Box width="100%">
              <Heading
                textAlign="center"
                mb={8}
                size="xl"
              >
                Shop by Category
              </Heading>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
                {categories.map((category) => (
                  <Box
                    key={category.name}
                    cursor="pointer"
                    onClick={() => handleCategoryClick(category.name)}
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-4px)' }}
                  >
                    <Box
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="md"
                      position="relative"
                      height="200px"
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                      <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        right={0}
                        bg="rgba(0, 0, 0, 0.7)"
                        p={4}
                      >
                        <Text
                          color="white"
                          fontSize="lg"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          {category.name}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 