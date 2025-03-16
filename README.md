# E-Commerce React Application

A modern e-commerce application built with React, Redux, and Firebase.

## Features

- User authentication (Sign up/Sign in)
- Product catalog with search and filtering
- Product details page
- Shopping cart functionality
- User profile management
- Protected routes for authenticated users
- Responsive design using Chakra UI

## Tech Stack

- React 18 with TypeScript
- Redux Toolkit for state management
- Firebase for backend services
- React Router for navigation
- Chakra UI for styling
- Formik & Yup for form handling and validation

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── features/      # Feature-specific components and logic
├── store/         # Redux store configuration and slices
├── services/      # API and external service integrations
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── assets/        # Static assets
└── styles/        # Global styles and theme
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Firebase project and add your configuration to `src/config/firebase.ts`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Architecture

The application follows a feature-based architecture with the following principles:

- Component-based development
- State management with Redux
- Route protection with custom route guards
- Custom hooks for reusable logic
- Type safety with TypeScript
- Responsive design with Chakra UI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
