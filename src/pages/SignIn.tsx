import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Link,
  useToast,
  Heading,
  Card,
  CardBody,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { signIn } from '../store/slices/authSlice';
import { AppDispatch } from '../store';

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    setFormData({ email: '', password: '' });
    setErrors({ email: '', password: '' });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate a 2-second delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      await dispatch(signIn(formData)).unwrap();
      
      // Get the redirect path from location state, or default to '/'
      const from = location.state?.from || '/';
      navigate(from, { replace: true });

      toast({
        title: 'Success',
        description: 'You have successfully signed in',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="center">
          <Card
            variant="outline"
            bg={bgColor}
            borderColor={borderColor}
            borderRadius="xl"
            shadow="md"
            w={{ base: "full", md: "500px" }}
          >
            <CardBody p={8}>
              <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                  <Heading size="xl">Sign In</Heading>
                  <Text mt={4} color="gray.600" fontSize="lg">
                    Don't have an account?{' '}
                    <Link as={RouterLink} to="/signup" color="blue.500">
                      Sign Up
                    </Link>
                  </Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <FormControl isRequired isInvalid={!!errors.email}>
                      <FormLabel fontSize="lg">Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        size="lg"
                        autoComplete="off"
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.password}>
                      <FormLabel fontSize="lg">Password</FormLabel>
                      <Input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        size="lg"
                        autoComplete="off"
                      />
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="full"
                      size="lg"
                      fontSize="md"
                      py={6}
                    >
                      {isLoading ? (
                        <div className="spinner"></div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default SignIn;
