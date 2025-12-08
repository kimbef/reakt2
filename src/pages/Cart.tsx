import React from 'react';
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
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import { RootState, AppDispatch } from '../store';
import { selectCartItems, selectCartTotal, updateCart } from '../store/slices/cartSlice';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const user = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const navigate = useNavigate();

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (!user) return;

    try {
      const updatedItems = cartItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: Math.max(0, newQuantity) };
        }
        return item;
      }).filter(item => item.quantity > 0);

      await dispatch(updateCart({ userId: user.uid, items: updatedItems })).unwrap();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!cartItems.length) {
    return (
      <VStack spacing={8} align="center" w="full">
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
    <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} w="full">
      <VStack align="stretch" spacing={6}>
        <Text fontSize="2xl" fontWeight="bold">Shopping Cart ({cartItems.length} items)</Text>
        
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
          >
            <Grid templateColumns={{ base: '1fr', sm: '150px 1fr auto auto' }} gap={6} p={4}>
              <Image
                src={item.imageUrl}
                alt={item.name}
                height="150px"
                width="150px"
                objectFit="cover"
                borderRadius="md"
              />
              
              <VStack align="start" spacing={2}>
                <Text fontSize="xl" fontWeight="bold">
                  {item.name}
                </Text>
                <Badge colorScheme="green" px={2} py={1} borderRadius="full">
                  In Stock
                </Badge>
                <Text color="gray.500">
                  ${item.price.toFixed(2)}
                </Text>
              </VStack>

              <HStack spacing={2}>
                <IconButton
                  aria-label="Decrease quantity"
                  icon={<MinusIcon />}
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                />
                <Text px={3}>{item.quantity}</Text>
                <IconButton
                  aria-label="Increase quantity"
                  icon={<AddIcon />}
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                />
              </HStack>

              <VStack align="end" spacing={2}>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={useColorModeValue('blue.600', 'blue.300')}
                >
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
                <IconButton
                  aria-label="Remove item"
                  icon={<DeleteIcon />}
                  onClick={() => handleUpdateQuantity(item.id, 0)}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                />
              </VStack>
            </Grid>
          </Box>
        ))}
      </VStack>

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
          <Grid templateColumns="1fr auto" gap={4}>
            <Text color="gray.500">Subtotal</Text>
            <Text fontWeight="semibold">${cartTotal.toFixed(2)}</Text>
            <Text color="gray.500">Shipping</Text>
            <Text fontWeight="semibold">Free</Text>
          </Grid>
          <Box pt={6} borderTopWidth={1} borderColor={borderColor}>
            <Grid templateColumns="1fr auto" gap={4}>
              <Text fontSize="xl" fontWeight="bold">Total</Text>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={useColorModeValue('blue.600', 'blue.300')}
              >
                ${cartTotal.toFixed(2)}
              </Text>
            </Grid>
          </Box>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => {
              navigate('/payment');
            }}
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
          >
            Proceed to Checkout
          </Button>
        </VStack>
      </Box>
    </Grid>
  );
};

export default Cart;
