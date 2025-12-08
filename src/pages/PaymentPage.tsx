import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Container,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { purchaseProduct } from '../store/slices/productsSlice';
import { AppDispatch } from '../store';
import Footer from '../components/Footer';

const PaymentPage: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simulate purchase
    const productId = 'sampleProductId'; // Replace with actual product ID
    const quantity = 1; // Replace with actual quantity
    await dispatch(purchaseProduct({ productId, quantity }));

    toast({
      title: 'Success',
      description: 'Thank you for your purchase!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    navigate('/');
  };

  return (
    <Box className="animated-gradient-bg" minH="100vh" py={8}>
      <Container maxW="container.md">
        <Box
          className="glass-effect"
          as="form"
          onSubmit={handleSubmit}
          borderRadius="lg"
          p={6}
        >
          <Heading as="h2" mb={6} textAlign="center">Payment Information</Heading>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="cardNumber">Card Number</FormLabel>
              <Input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Enter card number"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="expiryDate">Expiry Date</FormLabel>
              <Input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="cvv">CVV</FormLabel>
              <Input
                type="text"
                id="cvv"
                name="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="Enter CVV"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="cardholderName">Cardholder Name</FormLabel>
              <Input
                type="text"
                id="cardholderName"
                name="cardholderName"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Enter cardholder name"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue">
              Pay Now
            </Button>
          </VStack>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default PaymentPage;
