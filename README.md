# React E-commerce Application

A modern e-commerce application built with React, TypeScript, Redux Toolkit, and Firebase.

## Features

- User Authentication (Sign up, Sign in, Profile management)
- Product catalog with search and filtering
- Shopping cart functionality
- Responsive design with Chakra UI
- Real-time data synchronization with Firebase
- State management with Redux Toolkit

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase project with Realtime Database and Authentication enabled

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Realtime Database
   - Set up Realtime Database rules:
   ```json
   {
     "rules": {
       "products": {
         ".read": true,
         ".write": "auth != null && auth.token.admin === true"
       },
       "carts": {
         "$uid": {
           ".read": "$uid === auth.uid",
           ".write": "$uid === auth.uid"
         }
       }
     }
   }
   ```

4. Create a `.env` file in the root directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_DATABASE_URL=your-database-url
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── config/        # Configuration files
  ├── hooks/         # Custom hooks
  ├── pages/         # Page components
  ├── store/         # Redux store and slices
  ├── types/         # TypeScript type definitions
  └── utils/         # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
