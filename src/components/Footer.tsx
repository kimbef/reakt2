import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Image,
  HStack,
  Icon,
  Link,
  Divider,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt={16}
      borderTop="1px"
      borderColor={borderColor}
      w="full"
    >
      <Box maxW="container.xl" mx="auto" py={10} px={4}>
        <VStack spacing={12}>
          {/* Footer Links */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} width="100%">
            <Stack align="flex-start">
              <Text fontWeight="bold" fontSize="lg" mb={2}>Company</Text>
              <Link>About Us</Link>
              <Link>Blog</Link>
              <Link>Careers</Link>
              <Link>Contact Us</Link>
            </Stack>

            <Stack align="flex-start">
              <Text fontWeight="bold" fontSize="lg" mb={2}>Support</Text>
              <Link>Help Center</Link>
              <Link>Safety Center</Link>
              <Link>Community Guidelines</Link>
            </Stack>

            <Stack align="flex-start">
              <Text fontWeight="bold" fontSize="lg" mb={2}>Legal</Text>
              <Link>Cookies Policy</Link>
              <Link>Privacy Policy</Link>
              <Link>Terms of Service</Link>
              <Link>Law Enforcement</Link>
            </Stack>

            <Stack align="flex-start">
              <Text fontWeight="bold" fontSize="lg" mb={2}>Install App</Text>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                height="40px"
                cursor="pointer"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                height="40px"
                cursor="pointer"
              />
            </Stack>
          </SimpleGrid>

          <Divider />

          {/* Bottom Footer */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Text>© 2024 ReaktShop. All rights reserved</Text>
            <HStack spacing={4}>
              <Icon
                as={FaFacebook}
                boxSize={6}
                cursor="pointer"
                _hover={{ color: 'blue.500' }}
              />
              <Icon
                as={FaTwitter}
                boxSize={6}
                cursor="pointer"
                _hover={{ color: 'blue.400' }}
              />
              <Icon
                as={FaInstagram}
                boxSize={6}
                cursor="pointer"
                _hover={{ color: 'pink.500' }}
              />
              <Icon
                as={FaLinkedin}
                boxSize={6}
                cursor="pointer"
                _hover={{ color: 'blue.600' }}
              />
            </HStack>
          </Stack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Footer; 