import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  HStack,
  Heading,
  useToast,
  Container,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseProduct } from '../store/slices/productsSlice';
import { AppDispatch, RootState } from '../store';
import { selectCartTotal, selectCartItems } from '../store/slices/cartSlice';
import { paymentSchema } from '../utils/validationSchemas';
import Footer from '../components/Footer';

/**
 * PaymentPage Component
 * 
 * SECURITY NOTES:
 * - This is a UI component only. Real card data should NEVER be processed here.
 * - In production, integrate with Stripe, PayPal, or similar PCI-compliant gateway.
 * - Use tokenization to avoid storing card data in your database.
 * - This demo implementation masks the CVV and validates format only.
 */

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const cartTotal = useSelector(selectCartTotal);
  const cartItems = useSelector(selectCartItems);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to cart if no items
  if (!cartItems.length) {
    navigate('/cart');
    return null;
  }

  const formik = useFormik({
    initialValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
    validationSchema: paymentSchema,
    onSubmit: async () => {
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to complete your purchase',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/signin');
        return;
      }

      setIsProcessing(true);

      try {
        // In production, call your backend to process payment with Stripe/PayPal
        // DO NOT send card data directly to your server
        // Example: const token = await stripe.createToken(values);
        
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Process each cart item
        for (const item of cartItems) {
          await dispatch(purchaseProduct({ productId: item.id, quantity: item.quantity })).unwrap();
        }

        toast({
          title: 'Success',
          description: 'Your payment has been processed successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        navigate('/profile', { state: { purchaseComplete: true } });
      } catch (error) {
        toast({
          title: 'Payment Failed',
          description: error instanceof Error ? error.message : 'An error occurred during payment processing',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsProcessing(false);
      }
    },
  });

  // Format card number input (spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 19);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    formik.setFieldValue('cardNumber', formatted);
  };

  // Format expiry date input (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    formik.setFieldValue('expiryDate', value);
  };

  // Allow only digits for CVV
  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    formik.setFieldValue('cvv', value);
  };

  const maskCVV = (value: string) => '*'.repeat(value.length);

  return (
    <Box className="animated-gradient-bg" minH="100vh" py={8}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          {/* Security Warning - Development Only */}
          {process.env.NODE_ENV === 'development' && (
            <Alert status="warning" borderRadius="lg">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Development Mode</Text>
                <Text fontSize="sm">
                  This payment form is for demonstration only. In production, integrate with a PCI-compliant payment gateway like Stripe.
                </Text>
              </Box>
            </Alert>
          )}

          {/* Order Summary */}
          <Card bg="white">
            <CardBody>
              <Heading size="md" mb={4}>Order Summary</Heading>
              <VStack align="stretch" spacing={2}>
                {cartItems.map((item) => (
                  <HStack key={item.id} justify="space-between" pb={2} borderBottom="1px solid" borderColor="gray.200">
                    <Text>{item.name}</Text>
                    <Text fontWeight="bold">${(item.price * item.quantity).toFixed(2)}</Text>
                  </HStack>
                ))}
                <HStack justify="space-between" pt={2}>
                  <Text fontWeight="bold">Total:</Text>
                  <Text fontWeight="bold" fontSize="lg" color="blue.600">${cartTotal.toFixed(2)}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Payment Form */}
          <Card bg="white">
            <CardBody>
              <Heading size="md" mb={6}>Payment Information</Heading>
              <Box as="form" onSubmit={formik.handleSubmit}>
                <VStack spacing={4} align="stretch">
                  {/* Cardholder Name */}
                  <FormControl
                    isInvalid={!!(formik.touched.cardholderName && formik.errors.cardholderName)}
                  >
                    <FormLabel htmlFor="cardholderName">Cardholder Name</FormLabel>
                    <Input
                      id="cardholderName"
                      type="text"
                      placeholder="John Doe"
                      {...formik.getFieldProps('cardholderName')}
                      isDisabled={isProcessing}
                      autoComplete="cc-name"
                    />
                    {formik.touched.cardholderName && formik.errors.cardholderName && (
                      <FormErrorMessage>{formik.errors.cardholderName}</FormErrorMessage>
                    )}
                  </FormControl>

                  {/* Card Number */}
                  <FormControl
                    isInvalid={!!(formik.touched.cardNumber && formik.errors.cardNumber)}
                  >
                    <FormLabel htmlFor="cardNumber">Card Number</FormLabel>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formik.values.cardNumber}
                      onChange={handleCardNumberChange}
                      onBlur={formik.handleBlur}
                      isDisabled={isProcessing}
                      autoComplete="cc-number"
                    />
                    {formik.touched.cardNumber && formik.errors.cardNumber && (
                      <FormErrorMessage>{formik.errors.cardNumber}</FormErrorMessage>
                    )}
                  </FormControl>

                  {/* Expiry Date and CVV */}
                  <HStack spacing={4}>
                    <FormControl
                      flex={1}
                      isInvalid={!!(formik.touched.expiryDate && formik.errors.expiryDate)}
                    >
                      <FormLabel htmlFor="expiryDate">Expiry Date</FormLabel>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={formik.values.expiryDate}
                        onChange={handleExpiryChange}
                        onBlur={formik.handleBlur}
                        isDisabled={isProcessing}
                        autoComplete="cc-exp"
                      />
                      {formik.touched.expiryDate && formik.errors.expiryDate && (
                        <FormErrorMessage>{formik.errors.expiryDate}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl
                      flex={1}
                      isInvalid={!!(formik.touched.cvv && formik.errors.cvv)}
                    >
                      <FormLabel htmlFor="cvv">CVV</FormLabel>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={maskCVV(formik.values.cvv)}
                        onChange={handleCVVChange}
                        onBlur={formik.handleBlur}
                        isDisabled={isProcessing}
                        autoComplete="cc-csc"
                      />
                      {formik.touched.cvv && formik.errors.cvv && (
                        <FormErrorMessage>{formik.errors.cvv}</FormErrorMessage>
                      )}
                    </FormControl>
                  </HStack>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    isDisabled={!formik.isValid || isProcessing}
                    mt={6}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner size="sm" mr={2} />
                        Processing Payment...
                      </>
                    ) : (
                      `Pay ${cartTotal.toFixed(2)}`
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    width="full"
                    onClick={() => navigate('/cart')}
                    isDisabled={isProcessing}
                  >
                    Back to Cart
                  </Button>
                </VStack>
              </Box>
            </CardBody>
          </Card>

          {/* Security Notice */}
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <Box fontSize="sm">
              <Text fontWeight="bold">Your payment is secure</Text>
              <Text>This page uses HTTPS encryption and validates all inputs before processing.</Text>
            </Box>
          </Alert>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
};

export default PaymentPage;
