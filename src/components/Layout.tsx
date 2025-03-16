import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Container,
  Text,
  Avatar,
  Badge,
  useColorMode,
  ButtonGroup,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon, AddIcon } from '@chakra-ui/icons';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { RootState } from '../store';
import { selectCartItemCount } from '../store/slices/cartSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { setUser } from '../store/slices/authSlice';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItemCount = useSelector(selectCartItemCount);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(setUser(null));
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box
        bg={bgColor}
        px={4}
        position="fixed"
        w="100%"
        top={0}
        zIndex={1000}
        borderBottom={1}
        borderStyle="solid"
        borderColor={borderColor}
        shadow="sm"
      >
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
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
        </Container>
      </Box>

      <Container maxW="container.xl" pt={20} pb={8}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 