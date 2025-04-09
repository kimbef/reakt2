import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';
import { fetchProducts } from './store/slices/productsSlice';
import { AppDispatch } from './store';
import CustomCursor from './components/CustomCursor';
import './assets/customStyles.css';

// Pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart.tsx';
import Profile from './pages/Profile';
import CreateProduct from './pages/CreateProduct.tsx';
import MyProducts from './pages/MyProducts.tsx';
import EditProduct from './pages/EditProduct.tsx';
import Wishlist from './pages/Wishlist.tsx';
import PaymentPage from './pages/PaymentPage';

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        
        {/* Auth Routes */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/create-product"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
            path="/my-products"
            element={
              <ProtectedRoute>
                <MyProducts />
                </ProtectedRoute>
            }  />
            <Route 
                path='/wishlist'
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
            />
         <Route
          path="/edit-product/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
         <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Router>
          <CustomCursor />
          <AppContent />
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
