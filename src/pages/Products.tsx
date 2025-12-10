import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  Input,
  Select,
  useToast,
  InputGroup,
  InputLeftElement,
  Tag,
  useColorModeValue,
  Container,
  Heading,
  Alert,
  AlertIcon,
  Center,
} from '@chakra-ui/react';
import { SearchIcon, WarningIcon } from '@chakra-ui/icons';
import { FaShoppingCart } from 'react-icons/fa';
import { AppDispatch, RootState } from '../store';
import { fetchProducts, Product } from '../store/slices/productsSlice';
import { updateCart, selectCartItems } from '../store/slices/cartSlice';
import { ProductSkeleton } from '../components/SkeletonLoaders';

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector(selectCartItems);
  const { items: products, isLoading, error } = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const isLightMode = useColorModeValue(true, false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    // Set the category from navigation state if available
    const categoryFromNav = (location.state as any)?.selectedCategory;
    if (categoryFromNav) {
      setSelectedCategory(categoryFromNav);
      // Clear the navigation state to avoid persisting the filter
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to add items to your cart',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    if (product.stock === 0) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently out of stock',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    const updatedItems = existingItem
      ? cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      : [...cartItems, { ...product, quantity: 1 }];
    
    dispatch(updateCart({ userId: user.uid, items: updatedItems }))
      .unwrap()
      .then(() => {
        toast({
          title: 'Added to cart',
          description: `${product.name} has been added to your cart`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to add item to cart',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const categories = [...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         product.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box className="animated-gradient-bg" minH="100vh" pb={10}>
      <Container maxW="container.xl" pt={6}>
        {/* Filters Section */}
        <Box 
          className={isLightMode ? "glass-effect" : "dark-glass-effect"}
          p={6} 
          borderRadius="lg" 
          mb={8}
        >
          <Heading size="xl" mb={6} textAlign="center">All Products</Heading>
          <VStack spacing={6}>
            <HStack w="full" spacing={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
              <InputGroup flex={1}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="full"
                  bg={isLightMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"}
                  _hover={{ bg: isLightMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)" }}
                  _focus={{ bg: isLightMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)" }}
                />
              </InputGroup>
              <Select
                placeholder="All Categories"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                borderRadius="full"
                minW={{ base: "full", md: "200px" }}
                bg={isLightMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"}
                _hover={{ bg: isLightMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)" }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </Text>
          </VStack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert status="error" mb={8} borderRadius="lg">
            <AlertIcon />
            <VStack align="start">
              <Text fontWeight="bold">Failed to load products</Text>
              <Text fontSize="sm">{error}</Text>
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch(fetchProducts())}
                mt={2}
              >
                Try Again
              </Button>
            </VStack>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box>
            <ProductSkeleton count={8} />
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <Center py={20}>
            <VStack spacing={4} textAlign="center">
              <WarningIcon boxSize="64px" color="gray.400" />
              <Heading size="lg">No Products Found</Heading>
              <Text color="gray.600">
                {debouncedSearch || selectedCategory
                  ? 'Try adjusting your search filters'
                  : 'No products available at the moment'}
              </Text>
              {(debouncedSearch || selectedCategory) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </VStack>
          </Center>
        )}

        {/* Products Grid */}
        {!isLoading && !error && filteredProducts.length > 0 && (
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
            {filteredProducts.map(product => (
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
                    loading="lazy"
                  />
                  <Tag
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme={product.stock > 0 ? 'green' : 'red'}
                    borderRadius="full"
                    className={isLightMode ? "glass-effect" : "dark-glass-effect"}
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
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color={useColorModeValue('blue.600', 'blue.300')}
                    >
                      ${product.price.toFixed(2)}
                    </Text>
                      
                    <Button
                      colorScheme="blue"
                      size="sm"
                      leftIcon={<FaShoppingCart />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      isDisabled={product.stock === 0}
                      variant="outline"
                      className="neon-button-blue"
                      _hover={{
                        bg: 'blue.500',
                        color: 'white'
                      }}
                    >
                      Add
                    </Button>
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

export default Products;
