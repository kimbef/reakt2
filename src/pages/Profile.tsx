import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Avatar,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { FaSignOutAlt, FaKey, FaShieldAlt, FaPlus } from 'react-icons/fa';
import { updateProfile, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/slices/authSlice';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;

    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });

      dispatch(setUser(auth.currentUser));

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
      window.location.reload();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Box maxW="container.xl" mx="auto">
      <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8}>
        {/* Profile Sidebar */}
        <Box
          bg={cardBg}
          borderRadius="lg"
          overflow="hidden"
          shadow="md"
          borderWidth="1px"
          borderColor={borderColor}
          p={6}
          height="fit-content"
          transition="all 0.3s"
          _hover={{ transform: 'translateY(-2px)', shadow: 'lg', bg: cardHoverBg }}
        >
          <VStack spacing={6} align="center">
            <Avatar
              size="2xl"
              name={user?.displayName || undefined}
            />
            <VStack spacing={2} align="center">
              <Text fontSize="2xl" fontWeight="bold">
                {user?.displayName || 'User'}
              </Text>
              <Text color="gray.500">{user?.email}</Text>
            </VStack>
            {/* New Button to Create Product */}
            <VStack mt={4}>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => navigate('/create-product')}
                leftIcon={<FaPlus />}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                }}
              >
                Create Product
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => navigate('/my-products')}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                }}
              >
                See My Products
              </Button>
            </VStack>
            <Button
              w="full"
              colorScheme="red"
              variant="outline"
              onClick={handleSignOut}
              leftIcon={<FaSignOutAlt />}
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'md',
              }}
            >
              Sign Out
            </Button>
          </VStack>
        </Box>

        {/* Main Content */}
        <VStack spacing={6} align="stretch">
          {/* Profile Information */}
          <Box
            bg={cardBg}
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            p={6}
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg', bg: cardHoverBg }}
          >
            <VStack spacing={6} align="stretch">
              <Text fontSize="2xl" fontWeight="bold">Profile Information</Text>
              <FormControl>
                <FormLabel>Display Name</FormLabel>
                <HStack>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    bg={useColorModeValue('white', 'gray.700')}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={handleUpdateProfile}
                    isLoading={isLoading}
                    _hover={{
                      transform: 'translateY(-2px)',
                      shadow: 'md',
                    }}
                  >
                    Save
                  </Button>
                </HStack>
              </FormControl>
            </VStack>
          </Box>

          {/* Account Security */}
          <Box
            bg={cardBg}
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            p={6}
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg', bg: cardHoverBg }}
          >
            <VStack spacing={6} align="stretch">
              <Text fontSize="2xl" fontWeight="bold">Account Security</Text>
              <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap={4}>
                <Button
                  leftIcon={<FaKey />}
                  onClick={() => {
                    toast({
                      title: 'Coming Soon',
                      description: 'Password change functionality will be available soon!',
                      status: 'info',
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                  variant="outline"
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'md',
                  }}
                >
                  Change Password
                </Button>
                <Button
                  leftIcon={<FaShieldAlt />}
                  onClick={() => {
                    toast({
                      title: 'Coming Soon',
                      description: 'Two-factor authentication will be available soon!',
                      status: 'info',
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                  variant="outline"
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'md',
                  }}
                >
                  Enable Two-Factor Authentication
                </Button>
              </Grid>
            </VStack>
          </Box>
        </VStack>
      </Grid>
    </Box>
  );
};

export default Profile;
