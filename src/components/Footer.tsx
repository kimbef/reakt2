import React from 'react';
import {
  Box,
  SimpleGrid,
  Stack,
  Text,
  Image,
  HStack,
  Icon,
  Link,
  Divider,
  VStack,
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <Box
      className="glass-footer"
      mt={20}
      w="full"
      position="relative"
    >
      {/* Decorative top border gradient */}
      <Box
        position="absolute"
        top={0}
        left="50%"
        transform="translateX(-50%)"
        width="60%"
        height="2px"
        bg="var(--accent-gradient)"
        borderRadius="full"
      />
      
      <Box maxW="container.xl" mx="auto" py={16} px={4}>
        <VStack spacing={14}>
          {/* Footer Links */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} width="100%">
            <Stack align="flex-start" spacing={4}>
              <Text 
                fontWeight="600" 
                fontSize="sm" 
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
              >
                Company
              </Text>
              <Link _hover={{ color: "var(--accent-primary)" }}>About Us</Link>
              <Link _hover={{ color: "var(--accent-primary)" }}>Blog</Link>
              <Link _hover={{ color: "var(--accent-primary)" }}>Careers</Link>
              <Link _hover={{ color: "var(--accent-primary)" }}>Contact Us</Link>
            </Stack>

            <Stack align="flex-start" spacing={4}>
              <Text 
                fontWeight="600" 
                fontSize="sm" 
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
              >
                Support
              </Text>
              <Link _hover={{ color: "var(--accent-primary)" }}>Help Center</Link>
              <Link _hover={{ color: "var(--accent-primary)" }}>Safety Center</Link>
              <Link _hover={{ color: "var(--accent-primary)" }}>Community Guidelines</Link>
            </Stack>

            <Stack align="flex-start" spacing={4}>
              <Text 
                fontWeight="600" 
                fontSize="sm" 
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
              >
                Legal
              </Text>
              <Link _hover={{ color: "var(--accent-primary)" }}>Cookies Policy</Link>
              <Link _hover={{ color: "var(--accent-primary)" }}>Privacy Policy</Link>
              <Link _hover={{ color: "var(--accent-primary)" }}>Terms of Service</Link>
              <Link _hover={{ color: "var(--accent-primary)" }}>Law Enforcement</Link>
            </Stack>

            <Stack align="flex-start" spacing={4}>
              <Text 
                fontWeight="600" 
                fontSize="sm" 
                mb={2}
                textTransform="uppercase"
                letterSpacing="0.1em"
              >
                Install App
              </Text>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                height="40px"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                height="40px"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Stack>
          </SimpleGrid>

          {/* Decorative Divider */}
          <Box width="100%" position="relative">
            <Divider borderColor="var(--glass-border)" />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="var(--glass-bg)"
              px={4}
              className="text-gradient"
              fontSize="xs"
            >
              ◆
            </Box>
          </Box>

          {/* Bottom Footer */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            spacing={6}
          >
            <Text 
              fontSize="sm"
            >
              © 2024 ReaktShop. All rights reserved
            </Text>
            <HStack spacing={6}>
              <Icon
                as={FaFacebook}
                boxSize={5}
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ color: 'var(--accent-primary)', transform: 'translateY(-2px)' }}
              />
              <Icon
                as={FaTwitter}
                boxSize={5}
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ color: 'var(--accent-primary)', transform: 'translateY(-2px)' }}
              />
              <Icon
                as={FaInstagram}
                boxSize={5}
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ color: 'var(--accent-secondary)', transform: 'translateY(-2px)' }}
              />
              <Icon
                as={FaLinkedin}
                boxSize={5}
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ color: 'var(--accent-primary)', transform: 'translateY(-2px)' }}
              />
            </HStack>
          </Stack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Footer; 