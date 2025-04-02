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
  const isLightMode = useColorModeValue(true, false);

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
        className="animated-gradient-bg"
        py={20}
        px={4}
        
      >
        <Box
          className={isLightMode ? "hero-glass-effect" : "dark-hero-glass-effect"}
          borderRadius="lg"
          m={{ base: 4, md: 8 }}
          p={8}
          textAlign="center"
        >
          <Container maxW="container.xl">
            <VStack spacing={6}>
              <Heading size="2xl" className="hero-gradient-text">
                Welcome to ReaktShop
              </Heading>
              <Text fontSize="xl" maxW="container.md" className="hero-gradient-text">
                Discover amazing products at great prices. Shop now and enjoy exclusive deals!
              </Text>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => navigate('/products')}
                className="neon-button-blue glass-effect"
                _hover={{ transform: 'scale(1.05)' }}
              >
                Shop Now
              </Button>
            </VStack>
          </Container>
        </Box>
      </Box>

      {/* Featured Products */}
      <Container maxW="container.xl" py={16}>
        <Box 
          className={isLightMode ? "glass-effect" : "dark-glass-effect"}
          p={6}
          borderRadius="lg"
        >
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
                  className={isLightMode ? "glass-card" : "dark-glass-card"}
                  borderRadius="lg"
                  overflow="hidden"
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
        </Box>
      </Container>

      {/* Categories */}
      <Box py={16}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box width="100%" className={isLightMode ? "glass-effect" : "dark-glass-effect"} p={6} borderRadius="lg">
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
                    _hover={{ transform: 'translateY(-4px) scale(1.03)' }}
                  >
                    <Box
                      borderRadius="lg"
                      overflow="hidden"
                      className={isLightMode ? "glass-card" : "dark-glass-card"}
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
                        className={isLightMode ? "glass-effect" : "dark-glass-effect"}
                        p={4}
                      >
                        <Text
                          color={isLightMode ? "black" : "white"}
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