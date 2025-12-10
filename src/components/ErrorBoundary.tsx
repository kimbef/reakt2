import React, { ReactNode, ErrorInfo } from 'react';
import { Box, Heading, Text, Button, VStack, Container } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
          <Container maxW="container.md">
            <VStack spacing={6} align="center" textAlign="center">
              <WarningIcon boxSize="64px" color="red.500" />
              <Heading as="h1" size="2xl" color="gray.800">
                Oops! Something Went Wrong
              </Heading>
              <Text color="gray.600" fontSize="lg">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </Text>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box
                  bg="gray.100"
                  p={4}
                  borderRadius="md"
                  maxW="full"
                  textAlign="left"
                  overflowX="auto"
                >
                  <Text as="pre" fontSize="xs" color="red.700" whiteSpace="pre-wrap">
                    {this.state.error.toString()}
                    {'\n'}
                    {this.state.errorInfo?.componentStack}
                  </Text>
                </Box>
              )}
              <VStack spacing={3}>
                <Button colorScheme="blue" size="lg" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button
                  colorScheme="gray"
                  size="lg"
                  onClick={() => {
                    window.location.href = '/';
                  }}
                >
                  Go to Home
                </Button>
              </VStack>
            </VStack>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
