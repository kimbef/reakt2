import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  useToast,
  Heading,
  FormErrorMessage,
} from '@chakra-ui/react';
import { AppDispatch } from '../store';
import { createProduct } from '../store/slices/productsSlice';

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name) {
      newErrors.name = 'Product Name is required';
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
      isValid = false;
    }

    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Image URL is required';
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock is required';
      isValid = false;
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a valid positive integer';
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
      await dispatch(createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        category: formData.category,
        stock: parseInt(formData.stock),
      })).unwrap();

      toast({
        title: 'Success',
        description: 'Product created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        stock: '',
      });
      setErrors({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        stock: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Add New Product</Heading>
        <Box as="form" onSubmit={handleSubmit} className="glass-effect" p={6} borderRadius="lg">
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Product Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.price}>
              <FormLabel>Price</FormLabel>
              <NumberInput min={0} isInvalid={!!errors.price}>
                <NumberInputField
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                />
              </NumberInput>
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.imageUrl}>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
              <FormErrorMessage>{errors.imageUrl}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.category}>
              <FormLabel>Category</FormLabel>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
              <FormErrorMessage>{errors.category}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.stock}>
              <FormLabel>Stock</FormLabel>
              <NumberInput min={0} isInvalid={!!errors.stock}>
                <NumberInputField
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                />
              </NumberInput>
              <FormErrorMessage>{errors.stock}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Creating..."
            >
              Create Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreateProduct;
