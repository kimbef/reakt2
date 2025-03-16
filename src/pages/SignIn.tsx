import React, { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(signIn(formData)).unwrap();
      
      // Get the redirect path from location state, or default to '/'
      const from = (location.state as any)?.from?.pathname || '/';
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
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading>Sign In</Heading>
          <Text mt={2} color="gray.600">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/signup" color="blue.500">
              Sign Up
            </Link>
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign In
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default SignIn; 