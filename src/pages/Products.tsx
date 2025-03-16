import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Skeleton,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaShoppingCart } from 'react-icons/fa';
import { AppDispatch, RootState } from '../store';
import { fetchProducts, Product } from '../store/slices/productsSlice';
import { updateCart, selectCartItems } from '../store/slices/cartSlice';

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector(selectCartItems);
  const { items: products, isLoading, error } = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product: Product) => {
    if (user) {
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
    } else {
      navigate('/signin');
    }
  };

  const categories = [...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500" fontSize="xl">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} mb={8}>
        <HStack w="full" spacing={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
          <InputGroup flex={1}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="full"
            />
          </InputGroup>
          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            borderRadius="full"
            minW={{ base: "full", md: "200px" }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </HStack>
      </VStack>

      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        }}
        gap={6}
      >
        {isLoading
          ? Array(8).fill(0).map((_, i) => (
              <Box
                key={i}
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                shadow="md"
              >
                <Skeleton height="200px" />
                <VStack p={4} spacing={3}>
                  <Skeleton height="20px" width="80%" />
                  <Skeleton height="20px" width="60%" />
                  <Skeleton height="20px" width="40%" />
                </VStack>
              </Box>
            ))
          : filteredProducts.map(product => (
              <Box
                key={product.id}
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                shadow="md"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  bg: cardHoverBg,
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
                  />
                  <Tag
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme={product.stock > 0 ? 'green' : 'red'}
                    borderRadius="full"
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
                    color="gray.500"
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
                      ${product.price}
                    </Text>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      leftIcon={<FaShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      isDisabled={product.stock === 0}
                      variant="outline"
                      _hover={{
                        bg: 'blue.500',
                        color: 'white'
                      }}
                    >
                      Add to Cart
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
      </Grid>
    </Box>
  );
};

export default Products; 