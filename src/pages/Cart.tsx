import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Heading,
  IconButton,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import { RootState, AppDispatch } from '../store';
import { selectCartItems, selectCartTotal, updateCart, CartItem } from '../store/slices/cartSlice';
import { Link as RouterLink } from 'react-router-dom';
import { User } from 'firebase/auth';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const toast = useToast();

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
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="center">
          <Heading>Your Cart is Empty</Heading>
          <Text>Add some products to your cart to get started!</Text>
          <Button as={RouterLink} to="/products" colorScheme="blue">
            Browse Products
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Shopping Cart</Heading>
        
        <Box>
          {cartItems.map((item) => (
            <Box key={item.id} mb={4}>
              <HStack spacing={4} align="center">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                
                <VStack flex={1} align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="semibold">
                    {item.name}
                  </Text>
                  <Text color="gray.600">
                    ${item.price.toFixed(2)}
                  </Text>
                </VStack>

                <HStack>
                  <IconButton
                    aria-label="Decrease quantity"
                    icon={<MinusIcon />}
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  />
                  <Text px={4}>{item.quantity}</Text>
                  <IconButton
                    aria-label="Increase quantity"
                    icon={<AddIcon />}
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  />
                  <IconButton
                    aria-label="Remove item"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleUpdateQuantity(item.id, 0)}
                  />
                </HStack>

                <Text fontWeight="semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </HStack>
              <Divider mt={4} />
            </Box>
          ))}
        </Box>

        <Box borderWidth={1} p={4} borderRadius="lg" bg="gray.50">
          <HStack justify="space-between">
            <Text fontSize="lg">Total:</Text>
            <Text fontSize="xl" fontWeight="bold">
              ${cartTotal.toFixed(2)}
            </Text>
          </HStack>
          <Button
            colorScheme="blue"
            size="lg"
            width="full"
            mt={4}
            onClick={() => {
              toast({
                title: 'Coming Soon',
                description: 'Checkout functionality will be available soon!',
                status: 'info',
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Cart; 