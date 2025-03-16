import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, get, set } from 'firebase/database';
import { db } from '../../config/firebase';
import { Product } from './productsSlice';
import { RootState } from '..';
import { updateProductStock } from './productsSlice';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

// Fetch cart from Firebase
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string) => {
    try {
      const cartRef = ref(db, `carts/${userId}`);
      const snapshot = await get(cartRef);
      return snapshot.exists() ? snapshot.val().items : [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }
);

// Update cart in Firebase
export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async ({ userId, items }: { userId: string; items: CartItem[] }, { dispatch, getState }) => {
    try {
      // First, update the cart
      const cartRef = ref(db, `carts/${userId}`);
      await set(cartRef, { items });

      // Then, update the stock for each product
      const state = getState() as RootState;
      const currentProducts = state.products.items;

      for (const item of items) {
        const product = currentProducts.find(p => p.id === item.id);
        if (product) {
          const currentCartItem = state.cart.items.find(i => i.id === item.id);
          const quantityDiff = item.quantity - (currentCartItem?.quantity || 0);
          const newStock = product.stock - quantityDiff;
          
          // Update product stock in Firebase
          await dispatch(updateProductStock({ 
            productId: item.id, 
            newStock: Math.max(0, newStock)
          })).unwrap();
        }
      }

      return items;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }
);

// Clear cart in Firebase
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId: string) => {
    try {
      const cartRef = ref(db, `carts/${userId}`);
      await set(cartRef, { items: [] });
      return [];
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      // Update Cart
      .addCase(updateCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update cart';
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to clear cart';
      });
  },
});

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer; 