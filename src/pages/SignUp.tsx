import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (
    values: { name: string; email: string; password: string },
    { setSubmitting }: any
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      
      await updateProfile(userCredential.user, {
        displayName: values.name,
      });

      toast({
        title: 'Success',
        description: 'Account created successfully',
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
      <Text fontSize="2xl" mb={6} textAlign="center">Sign Up</Text>
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name && touched.name}>
                <FormLabel>Name</FormLabel>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Enter your name"
                />
                <Text color="red.500" fontSize="sm">{errors.name}</Text>
              </FormControl>

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

              <FormControl isInvalid={!!errors.confirmPassword && touched.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Field
                  as={Input}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                />
                <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
              >
                Sign Up
              </Button>

              <Text>
                Already have an account?{' '}
                <RouterLink to="/signin">Sign In</RouterLink>
              </Text>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignUp; 