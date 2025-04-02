import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useToast,
  IconButton,
  Skeleton,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Grid,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { FaShoppingCart } from 'react-icons/fa';
import { AppDispatch, RootState } from '../store';
import { fetchProductById } from '../store/slices/productsSlice';
import { updateCart, selectCartItems } from '../store/slices/cartSlice';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector(selectCartItems);

  const { selectedProduct: product, isLoading, error } = useSelector(
    (state: RootState) => state.products
  );

  const isLightMode = useColorModeValue(true, false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product && user) {
      const existingItem = cartItems.find(item => item.id === product.id);
      const updatedItems = existingItem
        ? cartItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cartItems, { ...product, quantity: 1 }];
      
      dispatch(updateCart({ userId: user.uid, items: updatedItems }));
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500" fontSize="xl">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box className="animated-gradient-bg" minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Box 
          className={isLightMode ? "glass-effect" : "dark-glass-effect"}
          p={6} 
          borderRadius="lg"
        >
          <VStack align="stretch" spacing={8}>
            <Breadcrumb spacing={2}>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('/products')}>Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{product?.name || 'Product Details'}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {isLoading ? (
              <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={8}>
                <Skeleton height="400px" />
                <VStack align="start" spacing={4}>
                  <Skeleton height="40px" width="80%" />
                  <Skeleton height="30px" width="40%" />
                  <Skeleton height="24px" width="30%" />
                  <Skeleton height="100px" width="100%" />
                  <Skeleton height="40px" width="200px" />
                </VStack>
              </Grid>
            ) : product ? (
              <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={8}>
                <Box
                  className={isLightMode ? "glass-card" : "dark-glass-card"}
                  borderRadius="lg"
                  overflow="hidden"
                  position="relative"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width="100%"
                    height="400px"
                    objectFit="cover"
                    transition="all 0.5s"
                    _hover={{ transform: 'scale(1.03)' }}
                  />
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    colorScheme={product.stock > 0 ? 'green' : 'red'}
                    fontSize="md"
                    px={3}
                    py={1}
                    borderRadius="full"
                    className={isLightMode ? "glass-effect" : "dark-glass-effect"}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                  </Badge>
                </Box>

                <VStack align="start" spacing={6} className={isLightMode ? "glass-card" : "dark-glass-card"} p={6} borderRadius="lg">
                  <Box width="100%">
                    <Text fontSize="3xl" fontWeight="bold" mb={2}>
                      {product.name}
                    </Text>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color={useColorModeValue('blue.600', 'blue.300')}
                    >
                      ${product.price}
                    </Text>
                  </Box>

                  <Text fontSize="lg" color={isLightMode ? "gray.700" : "gray.300"}>
                    {product.description}
                  </Text>

                  <Divider />

                  <VStack align="start" spacing={4} width="100%">
                    <Text fontSize="xl" fontWeight="semibold">
                      Product Details
                    </Text>
                    <Grid templateColumns="auto 1fr" gap={4}>
                      <Text fontWeight="medium">Category:</Text>
                      <Text>{product.category}</Text>
                      <Text fontWeight="medium">SKU:</Text>
                      <Text>{product.id}</Text>
                      <Text fontWeight="medium">Availability:</Text>
                      <Text>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Text>
                    </Grid>
                  </VStack>

                  <HStack spacing={4} pt={4} width="100%">
                    <Button
                      colorScheme="blue"
                      size="lg"
                      leftIcon={<FaShoppingCart />}
                      onClick={handleAddToCart}
                      isDisabled={product.stock === 0}
                      flex={1}
                      className="neon-button-blue"
                      _hover={{
                        transform: 'scale(1.05)',
                        bg: 'blue.500',
                        color: 'white'
                      }}
                    >
                      Add to Cart
                    </Button>
                    <IconButton
                      aria-label="Back to products"
                      icon={<ChevronLeftIcon />}
                      onClick={() => navigate('/products')}
                      size="lg"
                      variant="outline"
                      className="neon-button-purple"
                      _hover={{
                        transform: 'scale(1.05)',
                      }}
                    />
                  </HStack>
                </VStack>
              </Grid>
            ) : (
              <Text>Product not found</Text>
            )}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails; 