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
        py={{ base: 16, md: 24 }}
        px={4}
        position="relative"
        overflow="hidden"
      >
        <Box
          className="glass-effect"
          borderRadius="0"
          m={{ base: 4, md: 8 }}
          p={{ base: 8, md: 16 }}
          textAlign="center"
          position="relative"
          zIndex={1}
        >
          <Container maxW="container.xl">
            <VStack spacing={8}>
              <Heading 
                size="2xl" 
                className="animate-fade-in-up hero-title"
                fontSize={{ base: "3rem", md: "5rem", lg: "6rem" }}
                fontWeight="800"
              >
                ReaktShop
              </Heading>
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                maxW="container.md" 
                className="animate-fade-in-up stagger-2 hero-subtitle"
              >
                Discover extraordinary products crafted with precision and style.
              </Text>
              <Button
                size="lg"
                onClick={() => navigate('/products')}
                className="neon-button-blue animate-fade-in-up stagger-3"
                px={10}
                py={6}
                fontSize="lg"
                fontWeight="600"
              >
                Browse Products
              </Button>
            </VStack>
          </Container>
        </Box>
      </Box>

      {/* Featured Products */}
      <Container maxW="container.xl" py={20}>
        <Box 
          className="glass-effect"
          p={{ base: 6, md: 10 }}
        >
          <Heading 
            size="xl" 
            mb={10}
            className="text-gradient"
            fontWeight="700"
          >
            Featured Products
          </Heading>
          {isLoading ? (
            <Text>Loading products...</Text>
          ) : (
            <Grid
              templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
              gap={8}
            >
              {featuredProducts.map((product, index) => (
                <Box
                  key={product.id}
                  className="glass-card slide-up"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    height="220px"
                    width="100%"
                    objectFit="cover"
                    transition="all 0.5s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                  <Box p={5}>
                    <Text 
                      fontSize="lg" 
                      fontWeight="600" 
                      mb={2}
                    >
                      {product.name}
                    </Text>
                    <Text 
                      className="text-gradient"
                      fontSize="xl" 
                      fontWeight="bold"
                    >
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
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box width="100%" className="glass-effect" p={{ base: 6, md: 10 }}>
              <Heading
                textAlign="center"
                mb={10}
                size="xl"
                className="text-gradient"
                fontWeight="700"
              >
                Shop by Category
              </Heading>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
                {categories.map((category, index) => (
                  <Box
                    key={category.name}
                    cursor="pointer"
                    onClick={() => handleCategoryClick(category.name)}
                    className="slide-up"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                    transition="all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                    _hover={{ transform: 'translateY(-8px)' }}
                  >
                    <Box
                      overflow="hidden"
                      className="glass-card"
                      position="relative"
                      height="240px"
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        transition="all 0.5s ease"
                        _hover={{ transform: "scale(1.08)" }}
                      />
                      <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        right={0}
                        bg="var(--glass-bg)"
                        backdropFilter="blur(10px)"
                        p={4}
                        borderTop="1px solid var(--glass-border)"
                      >
                        <Text
                          fontSize="lg"
                          fontWeight="600"
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