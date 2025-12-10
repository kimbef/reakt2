import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ref, get, set, push } from 'firebase/database';
import { db } from '../../config/firebase';
import { CartItem } from './cartSlice';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: number;
  updatedAt: number;
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

// Fetch user orders from Firebase
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId: string) => {
    try {
      const ordersRef = ref(db, `orders/${userId}`);
      const snapshot = await get(ordersRef);
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        return Object.entries(ordersData).map(([id, data]: [string, any]) => ({
          id,
          ...data,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
);

// Create new order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({
    userId,
    items,
    total,
  }: {
    userId: string;
    items: CartItem[];
    total: number;
  }) => {
    try {
      const ordersRef = ref(db, `orders/${userId}`);
      const newOrderRef = push(ordersRef);

      const order: Order = {
        id: newOrderRef.key || '',
        userId,
        items,
        total,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await set(newOrderRef, order);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({
    userId,
    orderId,
    status,
  }: {
    userId: string;
    orderId: string;
    status: Order['status'];
  }) => {
    try {
      const orderRef = ref(db, `orders/${userId}/${orderId}`);
      const snapshot = await get(orderRef);

      if (!snapshot.exists()) {
        throw new Error('Order not found');
      }

      const order = snapshot.val();
      const updatedOrder = {
        ...order,
        status,
        updatedAt: Date.now(),
      };

      await set(orderRef, updatedOrder);
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.isLoading = false;
        state.orders = action.payload.sort((a, b) => b.createdAt - a.createdAt);
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      });

    // Update order status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update order';
      });
  },
});

export const { clearOrderError } = ordersSlice.actions;

// Selectors
export const selectOrders = (state: any) => state.orders.orders;
export const selectOrdersLoading = (state: any) => state.orders.isLoading;
export const selectOrdersError = (state: any) => state.orders.error;
export const selectOrderById = (state: any, orderId: string) =>
  state.orders.orders.find((order: Order) => order.id === orderId);

export default ordersSlice.reducer;
