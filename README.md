# Reakt2

A modern, full-featured e-commerce single-page application built with React, TypeScript, and Firebase. Reakt2 provides a seamless shopping experience with real-time data synchronization, secure authentication, and a responsive user interface.

## Overview

Reakt2 is a production-ready e-commerce platform that demonstrates best practices in frontend architecture, state management, and cloud integration. The application supports user authentication, product discovery, shopping cart management, order processing, and user profile management.

## Key Features

- **User Authentication** – Secure sign-up and sign-in via Firebase Authentication
- **Product Catalog** – Browse, search, and view detailed product information
- **Shopping Cart** – Add, remove, and manage items with real-time synchronization
- **Wishlist** – Save favorite products for later purchase
- **Order Management** – Create and edit products; track user purchases
- **Payment Integration** – Integrated payment processing system
- **Real-time Data Sync** – Automatic synchronization with Firebase Realtime Database
- **Responsive Design** – Full mobile, tablet, and desktop support
- **Global State Management** – Redux Toolkit for predictable state updates
- **Custom Styling** – Modern UI with custom CSS and component styling

## Technology Stack

| Technology | Purpose |
|---|---|
| **React 19** | Core UI framework |
| **TypeScript** | Static type checking and enhanced IDE support |
| **Firebase** | Authentication and real-time database |
| **Redux Toolkit** | Predictable state container |
| **Chakra UI** | Component library and styling system |
| **Vite** | Fast build tool and development server |
| **ESLint** | Code quality and consistency |

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CustomCursor.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── pages/              # Page-level components
│   ├── Cart.tsx
│   ├── CreateProduct.tsx
│   ├── EditProduct.tsx
│   ├── Home.tsx
│   ├── MyProducts.tsx
│   ├── PaymentPage.tsx
│   ├── ProductDetails.tsx
│   ├── Products.tsx
│   ├── Profile.tsx
│   ├── SignIn.tsx
│   ├── SignUp.tsx
│   └── Wishlist.tsx
├── store/              # Redux store configuration
│   ├── index.ts
│   ├── store.ts
│   └── slices/         # Redux slices for feature-based state
│       ├── authSlice.ts
│       ├── cartSlice.ts
│       └── productsSlice.ts
├── hooks/              # Custom React hooks
│   └── useAuth.ts
├── config/             # Configuration files
│   └── firebase.ts
├── data/               # Static data and fixtures
│   └── products.ts
├── assets/             # Static assets and styles
│   └── customStyles.css
├── App.tsx             # Root component
├── main.jsx            # Application entry point
└── env.d.ts            # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Firebase project with Authentication and Realtime Database enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kimbef/reakt2.git
cd reakt2
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Add your Firebase configuration to `src/config/firebase.ts`
   - Enable Email/Password authentication in Firebase Console
   - Create a Realtime Database

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Architecture

### State Management

The application uses Redux Toolkit with feature-based slices:

- **authSlice** – User authentication state and credentials
- **cartSlice** – Shopping cart items and calculations
- **productsSlice** – Product catalog and details

### Routing

Protected routes are implemented using custom route guards:
- `ProtectedRoute` – Restricts access to authenticated users
- `PublicRoute` – Accessible to all visitors

### Authentication Flow

1. User submits credentials via SignIn/SignUp pages
2. Firebase authenticates and returns user token
3. Auth state updates in Redux store
4. Protected routes become accessible
5. User data persists across sessions

## Development Guidelines

### Component Organization

- **Components** – Reusable, presentational components with no business logic
- **Pages** – Route-level containers that manage state and composition
- **Hooks** – Custom hooks for shared logic (e.g., `useAuth`)

### Styling

The application uses Chakra UI components alongside custom CSS defined in `assets/customStyles.css`. Maintain consistency by using the existing design system.

### Firebase Integration

All Firebase operations are configured in `src/config/firebase.ts`. The realtime database syncs automatically when data is updated through Redux actions.

## Deployment

Build the application for production:

```bash
npm run build
```

The `dist/` directory contains the optimized build ready for deployment to any static hosting platform (Vercel, Netlify, Firebase Hosting, etc.).

## Contributing

When contributing to this project:

1. Maintain TypeScript strict mode compliance
2. Follow existing code style and component patterns
3. Keep components focused and reusable
4. Document complex business logic
5. Test changes in development before committing

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue in the repository.