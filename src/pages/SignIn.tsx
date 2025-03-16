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
  Card,
  CardBody,
  useColorModeValue,
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

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
                    <FormControl isRequired>
                      <FormLabel fontSize="lg">Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize="lg">Password</FormLabel>
                      <Input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        size="lg"
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="full"
                      isLoading={isLoading}
                      loadingText="Signing in..."
                      size="lg"
                      fontSize="md"
                      py={6}
                    >
                      Sign In
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