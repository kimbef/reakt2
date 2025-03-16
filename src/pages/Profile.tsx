import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Avatar,
  Divider,
  HStack,
} from '@chakra-ui/react';
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

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);

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
      setIsEditing(false);
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
    return <Text>Loading...</Text>;
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Avatar
            size="2xl"
            name={user.displayName || undefined}
            mb={4}
          />
          <Text fontSize="2xl" fontWeight="bold">
            {user.displayName || 'No name set'}
          </Text>
          <Text color="gray.600">{user.email}</Text>
        </Box>

        <Divider />

        <Box>
          <Text fontSize="xl" fontWeight="semibold" mb={4}>
            Profile Information
          </Text>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Display Name</FormLabel>
              {isEditing ? (
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                />
              ) : (
                <Text>{user.displayName || 'No name set'}</Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Text>{user.email}</Text>
            </FormControl>

            {isEditing ? (
              <HStack>
                <Button
                  colorScheme="blue"
                  onClick={handleUpdateProfile}
                  isLoading={isLoading}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(user.displayName || '');
                  }}
                >
                  Cancel
                </Button>
              </HStack>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Button colorScheme="red" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Profile; 