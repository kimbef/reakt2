import React from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
  ButtonGroup,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  AddIcon,
} from '@chakra-ui/icons';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { RootState } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { setUser } from '../store/slices/authSlice';
import { selectCartItems } from '../store/slices/cartSlice';

const publicLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector(selectCartItems);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(setUser(null));
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const MobileNav = () => (
    <VStack spacing={4} align="stretch">
      {publicLinks.map((link) => (
        <Link
          key={link.path}
          as={RouterLink}
          to={link.path}
          px={2}
          py={1}
          rounded="md"
          _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.100', 'gray.700'),
          }}
          bg={isActive(link.path) ? useColorModeValue('gray.100', 'gray.700') : 'transparent'}
          fontWeight={isActive(link.path) ? 'semibold' : 'normal'}
          onClick={onClose}
        >
          {link.name}
        </Link>
      ))}
    </VStack>
  );

  return (
    <Box
      bg={bgColor}
      position="sticky"
      top={0}
      zIndex={1000}
      borderBottom="1px"
      borderStyle="solid"
      borderColor={borderColor}
      shadow="sm"
      width="full"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto" px={4}>
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={onToggle}
        />

        <HStack spacing={8} alignItems="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, teal.400)"
            bgClip="text"
            cursor="pointer"
            onClick={() => navigate('/')}
          >
            ReaktShop
          </Text>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                as={RouterLink}
                to={link.path}
                px={2}
                py={1}
                rounded="md"
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('gray.100', 'gray.700'),
                }}
                bg={isActive(link.path) ? useColorModeValue('gray.100', 'gray.700') : 'transparent'}
                fontWeight={isActive(link.path) ? 'semibold' : 'normal'}
              >
                {link.name}
              </Link>
            ))}
          </HStack>
        </HStack>

        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />

          {user ? (
            <>
              <IconButton
                as={RouterLink}
                to="/cart"
                aria-label="Shopping cart"
                icon={
                  <Box position="relative">
                    <FaShoppingCart />
                    {cartItemCount > 0 && (
                      <Badge
                        position="absolute"
                        top="-2"
                        right="-2"
                        colorScheme="blue"
                        borderRadius="full"
                        minW="1.1rem"
                        fontSize="xs"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Box>
                }
                variant="ghost"
              />

              <Menu>
                <MenuButton>
                  <Avatar size="sm" name={user.displayName || undefined} />
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">
                    <FaUser />
                    <Text ml={2}>Profile</Text>
                  </MenuItem>
                  {user.email === 'admin@reakt.com' && (
                    <MenuItem as={RouterLink} to="/admin/products" icon={<AddIcon />}>
                      Manage Products
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleSignOut} color="red.500">
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <ButtonGroup spacing={2}>
              <Button as={RouterLink} to="/signin" variant="ghost">
                Sign In
              </Button>
              <Button as={RouterLink} to="/signup" colorScheme="blue">
                Sign Up
              </Button>
            </ButtonGroup>
          )}
        </HStack>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <MobileNav />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navigation; 