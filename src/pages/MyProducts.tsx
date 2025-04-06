import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Heading,
  Grid,
  Text,
  Image,
  VStack,
  HStack,
  Tag,
  useColorModeValue,
  Skeleton,
  Container,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchProducts, deleteProduct } from '../store/slices/productsSlice';
import { useAuth } from '../hooks/useAuth';

const MyProducts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const { items: products, isLoading, error } = useSelector((state: RootState) => state.products);
  const isLightMode = useColorModeValue(true, false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const myProducts = products.filter(product => product.userId === user?.uid);

  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id));
  };

  if (error) {
    return (
      <Alert status="error" mt={4}>
        <AlertIcon />
        <Text>Error loading products: {error}</Text>
      </Alert>
    );
  }

  return (
    <Box className="animated-gradient-bg" minH="100vh" pb={10}>
      <Container maxW="container.xl" pt={6}>
        <Box className={isLightMode ? "glass-effect" : "dark-glass-effect"} p={6} borderRadius="lg" mb={8}>
          <Heading size="xl" mb={6} textAlign="center">My Products</Heading>
          <Box textAlign="center" mb={8}>
            <Button colorScheme="blue"  onClick={() => navigate('/products')}>
              Check all products
            </Button>
          </Box>
        </Box>

        {myProducts.length === 0 && !isLoading ? (
          <Box
            className={isLightMode ? "glass-effect" : "dark-glass-effect"}
            p={12}
            borderRadius="lg"
            textAlign="center"
            mb={8}
            style={{ height: '400px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            <Heading size="xl" mb={8}>No products created yet</Heading>
            <Button size="lg" colorScheme="blue" onClick={() => navigate('/create-product')}>
              Create a product
            </Button>
          </Box>
        ) : (
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
            {isLoading
              ? Array(8).fill(0).map((_, i) => (
                  <Box
                    key={i}
                    className={isLightMode ? "glass-card" : "dark-glass-effect"}
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    <Skeleton height="200px" />
                    <VStack p={4} spacing={3}>
                      <Skeleton height="20px" width="80%" />
                      <Skeleton height="20px" width="60%" />
                      <Skeleton height="20px" width="40%" />
                    </VStack>
                  </Box>
                ))
              : myProducts.map(product => (
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
                    <Box position="relative">
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
                    <Tag
                      position="absolute"
                      top={2}
                      right={2}
                      bg="rgba(0, 0, 0, 0.5)"
                      color="#00FFFF"
                      borderRadius="full"
                      className="dark-glass-effect"
                      style={{ backdropFilter: 'blur(5px)'}}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </Tag>
                  </Box>
                  
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
                      <HStack justify="space-between" align="center" pt={2}>
                        {user?.uid === product.userId && (
                          <>
                            <Button colorScheme="blue" size="sm" onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</Button>
                            <Button colorScheme="red" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
                          </>
                        )}
                      </HStack>
                    </VStack>
                  </Box>
                ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyProducts;
