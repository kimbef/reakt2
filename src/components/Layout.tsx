import React from 'react';
import { Box } from '@chakra-ui/react';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50" _dark={{ bg: 'gray.900' }} w="100vw">
      <Navigation />
      <Box flex="1" w="full">
        <Box maxW="container.xl" mx="auto" px={4} py={8}>
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 