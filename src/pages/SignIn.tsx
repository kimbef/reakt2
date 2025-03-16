import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values: { email: string; password: string }, { setSubmitting }: any) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: 'Success',
        description: 'You have successfully signed in',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <Text fontSize="2xl" mb={6} textAlign="center">Sign In</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.email && touched.email}>
                <FormLabel>Email</FormLabel>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />
                <Text color="red.500" fontSize="sm">{errors.email}</Text>
              </FormControl>

              <FormControl isInvalid={!!errors.password && touched.password}>
                <FormLabel>Password</FormLabel>
                <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                />
                <Text color="red.500" fontSize="sm">{errors.password}</Text>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
              >
                Sign In
              </Button>

              <Text>
                Don't have an account?{' '}
                <RouterLink to="/signup">Sign Up</RouterLink>
              </Text>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignIn; 