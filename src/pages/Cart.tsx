import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  IconButton,
  useToast,
  useColorModeValue,
  Badge,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon, WarningIcon } from '@chakra-ui/icons';
import { RootState, AppDispatch } from '../store';
import { selectCartItems, selectCartTotal, updateCart } from '../store/slices/cartSlice';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import { formatCurrency } from '../utils/helpers';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const user = useSelector((state: RootState) => state.auth.user);
  const { isLoading: cartLoading, error: cartError } = useSelector((state: RootState) => state.cart);
  const toast = useToast();
  const navigate = useNavigate();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to update your cart',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      navigate('/signin');
      return;
    }

    if (newQuantity < 0) return;

    setUpdatingItemId(productId);

    try {
      const updatedItems = cartItems
        .map(item => {
          if (item.id === productId) {
            // Ensure quantity doesn't exceed stock
            return { ...item, quantity: Math.min(newQuantity, item.stock) };
          }
          return item;
        })
        .filter(item => item.quantity > 0);

      await dispatch(updateCart({ userId: user.uid, items: updatedItems })).unwrap();

      if (newQuantity === 0) {
        toast({
          title: 'Item Removed',
          description: 'Product removed from cart',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Empty cart state
  if (!cartItems.length) {
    return (
      <VStack spacing={8} align="center" w="full" py={10}>
        <Box
          bg={cardBg}
          borderRadius="lg"
          overflow="hidden"
          shadow="md"
          borderWidth="1px"
          borderColor={borderColor}
          p={8}
          textAlign="center"
          w={{ base: "full", md: "600px" }}
          transition="all 0.3s"
          _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
        >
          <FaShoppingBag size="80px" style={{ margin: '0 auto', opacity: 0.3 }} />
          <Text fontSize="2xl" fontWeight="bold" mt={6}>Your Cart is Empty</Text>
          <Text color="gray.500" mt={4}>Add some products to your cart to get started!</Text>
          <Button
            as={RouterLink}
            to="/products"
            colorScheme="blue"
            size="lg"
            mt={8}
            leftIcon={<FaShoppingBag />}
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
          >
            Browse Products
          </Button>
        </Box>
      </VStack>
    );
  }

  return (
    <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} w="full" py={6}>
      <VStack align="stretch" spacing={6}>
        <Text fontSize="2xl" fontWeight="bold">Shopping Cart ({cartItems.length} items)</Text>
        
        {/* Cart Error Alert */}
        {cartError && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" w="full">
              <Text fontWeight="bold">Failed to update cart</Text>
              <Text fontSize="sm">{cartError}</Text>
            </VStack>
          </Alert>
        )}
        
        {/* Cart Items */}
        {cartItems.map((item) => (
          <Box
            key={item.id}
            bg={cardBg}
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg', bg: cardHoverBg }}
            opacity={updatingItemId === item.id ? 0.6 : 1}
          >
            <Grid templateColumns={{ base: '1fr', sm: '150px 1fr auto auto' }} gap={6} p={4}>
              {/* Product Image */}
              <Image
                src={item.imageUrl}
                alt={item.name}
                height="150px"
                width="150px"
                objectFit="cover"
                borderRadius="md"
                loading="lazy"
              />
              
              {/* Product Details */}
              <VStack align="start" spacing={2}>
                <Text fontSize="xl" fontWeight="bold" noOfLines={2}>
                  {item.name}
                </Text>
                <Badge
                  colorScheme={item.stock > 0 ? 'green' : 'red'}
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
                <Text color="gray.500" fontSize="sm">
                  Unit Price: {formatCurrency(item.price)}
                </Text>
              </VStack>

              {/* Quantity Controls */}
              <HStack spacing={2}>
                <IconButton
                  aria-label="Decrease quantity"
                  icon={updatingItemId === item.id ? <Spinner size="sm" /> : <MinusIcon />}
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  isDisabled={updatingItemId === item.id || item.quantity === 1}
                />
                <Text px={3} fontWeight="bold" minW="30px" textAlign="center">
                  {item.quantity}
                </Text>
                <IconButton
                  aria-label="Increase quantity"
                  icon={<AddIcon />}
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  isDisabled={updatingItemId === item.id || item.quantity >= item.stock}
                  title={item.quantity >= item.stock ? 'Stock limit reached' : ''}
                />
              </HStack>

              {/* Item Total */}
              <VStack align="end" spacing={2}>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={useColorModeValue('blue.600', 'blue.300')}
                >
                  {formatCurrency(item.price * item.quantity)}
                </Text>
                <IconButton
                  aria-label="Remove item"
                  icon={<DeleteIcon />}
                  onClick={() => handleUpdateQuantity(item.id, 0)}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  isDisabled={updatingItemId === item.id}
                />
              </VStack>
            </Grid>
          </Box>
        ))}
      </VStack>

      {/* Order Summary Sidebar */}
      <Box
        bg={cardBg}
        borderRadius="lg"
        overflow="hidden"
        shadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        p={6}
        height="fit-content"
        position="sticky"
        top="100px"
        transition="all 0.3s"
        _hover={{ shadow: 'lg' }}
      >
        <VStack spacing={6} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">Order Summary</Text>
          
          {/* Price Breakdown */}
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text color="gray.500">Subtotal</Text>
              <Text fontWeight="semibold">{formatCurrency(cartTotal)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.500">Shipping</Text>
              <Text fontWeight="semibold" color="green.500">Free</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.500">Tax</Text>
              <Text fontWeight="semibold">{formatCurrency(0)}</Text>
            </HStack>
          </VStack>

          {/* Total */}
          <Box pt={6} borderTopWidth={1} borderColor={borderColor}>
            <HStack justify="space-between">
              <Text fontSize="xl" fontWeight="bold">Total</Text>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={useColorModeValue('blue.600', 'blue.300')}
              >
                {formatCurrency(cartTotal)}
              </Text>
            </HStack>
          </Box>

          {/* Checkout Button */}
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/payment')}
            isLoading={cartLoading}
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
          >
            Proceed to Checkout
          </Button>

          {/* Continue Shopping Link */}
          <Button
            as={RouterLink}
            to="/products"
            variant="outline"
            size="lg"
          >
            Continue Shopping
          </Button>
        </VStack>
      </Box>
    </Grid>
  );
};

export default Cart;
