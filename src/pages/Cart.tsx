import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import { RootState, AppDispatch } from '../store';
import { updateCart, clearCart, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const items = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotal);

  const handleUpdateQuantity = (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 0) {
      const updatedItems = items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0);
      dispatch(updateCart({ userId: user!.uid, items: updatedItems }));
    }
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    dispatch(updateCart({ userId: user!.uid, items: updatedItems }));
    toast({
      title: 'Item removed',
      description: 'Item has been removed from your cart',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleClearCart = () => {
    dispatch(clearCart(user!.uid));
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  if (items.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="center">
          <Text fontSize="xl">Your cart is empty</Text>
          <Button colorScheme="blue" as="a" href="/products">
            Continue Shopping
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={8}>
        Shopping Cart ({items.length} items)
      </Text>

      <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
        <VStack flex="3" align="stretch" spacing={4}>
          {items.map((item) => (
            <Box key={item.id} p={4} borderWidth="1px" borderRadius="lg">
              <Flex gap={4}>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box flex="1">
                  <Text fontSize="lg" fontWeight="semibold">
                    {item.name}
                  </Text>
                  <Text color="gray.600" mb={2}>
                    ${item.price}
                  </Text>
                  <HStack>
                    <IconButton
                      aria-label="Decrease quantity"
                      icon={<MinusIcon />}
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                    />
                    <Text>{item.quantity}</Text>
                    <IconButton
                      aria-label="Increase quantity"
                      icon={<AddIcon />}
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                    />
                    <IconButton
                      aria-label="Remove item"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      ml={2}
                      onClick={() => handleRemoveItem(item.id)}
                    />
                  </HStack>
                </Box>
                <Text fontWeight="bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </Flex>
            </Box>
          ))}
        </VStack>

        <Box flex="1">
          <Box p={6} borderWidth="1px" borderRadius="lg" position="sticky" top="4">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Order Summary
            </Text>
            <VStack align="stretch" spacing={4}>
              <Flex justify="space-between">
                <Text>Subtotal</Text>
                <Text>${totalAmount.toFixed(2)}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Shipping</Text>
                <Text>Free</Text>
              </Flex>
              <Divider />
              <Flex justify="space-between" fontWeight="bold">
                <Text>Total</Text>
                <Text>${totalAmount.toFixed(2)}</Text>
              </Flex>
              <Button colorScheme="blue" size="lg">
                Proceed to Checkout
              </Button>
              <Button variant="outline" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default Cart; 