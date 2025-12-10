import React from 'react';
import { Skeleton, Grid, Box, SkeletonText, SkeletonCircle } from '@chakra-ui/react';

interface ProductSkeletonProps {
  count?: number;
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 6 }) => {
  return (
    <Grid
      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
      gap={6}
      w="full"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} borderRadius="lg" overflow="hidden" shadow="md">
          <Skeleton height="250px" />
          <Box p={4}>
            <SkeletonText mt="4" noOfLines={2} spacing="4" />
            <SkeletonText mt="4" noOfLines={1} spacing="4" />
            <Skeleton height="40px" mt="4" />
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

export const CartItemSkeleton: React.FC = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '80px 1fr', md: '120px 1fr' }}
      gap={4}
      p={4}
      borderRadius="lg"
      bg="white"
      shadow="md"
    >
      <Skeleton height="100px" borderRadius="md" />
      <Box>
        <SkeletonText noOfLines={2} spacing="2" mb={4} />
        <Skeleton height="30px" width="100px" />
      </Box>
    </Box>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <Box>
      <Box display="flex" gap={4} mb={8}>
        <SkeletonCircle size="100px" />
        <Box flex={1}>
          <SkeletonText noOfLines={3} spacing="2" />
        </Box>
      </Box>
      <SkeletonText noOfLines={6} spacing="4" />
    </Box>
  );
};
