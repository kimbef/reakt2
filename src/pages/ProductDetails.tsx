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
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { AppDispatch, RootState } from '../store';
import { fetchProductById } from '../store/slices/productsSlice';
import { updateCart, selectCartItems } from '../store/slices/cartSlice';
import { deleteProduct, updateProduct } from '../store/slices/productsSlice';
import { addToFavorites } from '../store/slices/authSlice';

const ProductDetailsComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector(selectCartItems);
  const selectedProduct = useSelector((state: RootState) => state.products.selectedProduct);
  const isLoading = useSelector((state: RootState) => state.products.isLoading);
  const error = useSelector((state: RootState) => state.products.error);

  const isFavorite = selectedProduct && user ? user.favorites.includes(selectedProduct?.id) : false;

 const handleLike = () => {
    if (selectedProduct) {
      const newLikes = selectedProduct?.likes + 1;
      dispatch(updateProduct({ ...selectedProduct, likes: newLikes }));
    }
  };

  const handleDislike = () => {
    if (selectedProduct) {
      const newDislikes = selectedProduct?.dislikes + 1;
      dispatch(updateProduct({ ...selectedProduct, dislikes: newDislikes }));
    }
  };

  const handleAddToWishlist = () => {
    if (selectedProduct && user) {
      dispatch(addToFavorites(selectedProduct.id));
      const isNowFavorite = !user.favorites.includes(selectedProduct.id);
      toast({
        title: isNowFavorite ? 'Added to wishlist' : 'Removed from wishlist',
        description: `${selectedProduct.name} has been ${isNowFavorite ? 'added to' : 'removed from'} your wishlist`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to add items to your wishlist',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isLightMode = useColorModeValue(true, false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (selectedProduct && user) {
      const existingItem = cartItems.find(item => item.id === selectedProduct.id);
      const updatedItems = existingItem
        ? cartItems.map(item =>
            item.id === selectedProduct.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cartItems, { ...selectedProduct, quantity: 1 }];

      dispatch(updateCart({ userId: user.uid, items: updatedItems }));
      toast({
        title: 'Added to cart',
        description: `${selectedProduct.name} has been added to your cart`,
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
                <BreadcrumbLink>{selectedProduct?.name || 'Product Details'}</BreadcrumbLink>
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
            ) : selectedProduct ? (
              <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={8}>
                <Box
                  className={isLightMode ? "glass-card" : "dark-glass-card"}
                  borderRadius="lg"
                  overflow="hidden"
                  position="relative"
                >
                  <Image
                    src={selectedProduct?.imageUrl}
                    alt={selectedProduct.name}
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
                    colorScheme={selectedProduct.stock > 0 ? 'black' : 'red'}
                    fontSize="md"
                    px={3}
                    py={1}
                    borderRadius="full"
                    className={isLightMode ? "glass-effect" : "dark-glass-effect"}
                  >
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of Stock'}
                  </Badge>
                </Box>

                <VStack align="start" spacing={6} className={isLightMode ? "glass-card" : "dark-glass-card"} p={6} borderRadius="lg">
                  <Box width="100%">
                    <Text fontSize="3xl" fontWeight="bold" mb={2}>
                      {selectedProduct.name}
                    </Text>
                    <Text
                      fontSize="2xl" fontWeight="bold"
                      color={useColorModeValue('blue.600', 'blue.300')}
                    >
                      ${selectedProduct.price}
                    </Text>
                  </Box>

                  <Text fontSize="lg" color={isLightMode ? "gray.700" : "gray.300"}>
                    {selectedProduct.description}
                  </Text>

                  <Divider />

                  <VStack align="start" spacing={4} width="100%">
                    <Text fontSize="xl" fontWeight="semibold">
                      Product Details
                    </Text>
                    <Grid templateColumns="auto 1fr" gap={4}>
                      <Text fontWeight="medium">Category:</Text>
                      <Text>{selectedProduct.category}</Text>
                      <Text fontWeight="medium">SKU:</Text>
                      <Text>{selectedProduct.id}</Text>
                      <Text fontWeight="medium">Availability:</Text>
                      <Text>{selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}</Text>
                    </Grid>
                  </VStack>

                  <HStack spacing={4} pt={4} width="100%">
                    <Button
                      colorScheme="blue"
                      size="lg"
                      leftIcon={<FaShoppingCart />}
                      onClick={handleAddToCart}
                      isDisabled={selectedProduct.stock === 0}
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
                  
                  <HStack spacing={4} pt={4} width="100%" >
                    <Button
                      colorScheme="green"
                      size="md"
                      onClick={handleLike}
                    >
                      Like ({selectedProduct.likes})
                    </Button>
                    <Button
                      colorScheme="red"
                      size="md"
                      onClick={handleDislike}
                    >
                      Dislike ({selectedProduct.dislikes})
                    </Button>
                     <IconButton
                      aria-label="Add to wishlist"
                        icon={<FaHeart color={isFavorite ? 'gray' : 'red'} />}
                        colorScheme={isFavorite ? 'gray' : 'red'}
                        size="md"
                        onClick={handleAddToWishlist}
                      />
                  </HStack>
                  
                  {user?.uid === selectedProduct.userId && (
                    <HStack spacing={4} pt={4} width="100%" justify="center">
                      <Button colorScheme="blue" size="lg" onClick={() => navigate(`/edit-product/${selectedProduct.id}`)}>
                        Edit Product
                      </Button>
                      <Button colorScheme="red" size="lg" onClick={() => dispatch(deleteProduct(selectedProduct.id)).then(() => navigate('/my-products'))}>
                        Delete Product
                      </Button>
                    </HStack>
                  )}
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
}

export default ProductDetailsComponent;
