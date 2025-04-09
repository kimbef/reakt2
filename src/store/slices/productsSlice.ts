import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, get, set, push } from 'firebase/database';
import { db } from '../../config/firebase';
import { sampleProducts } from '../../data/products';

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  likes: number;
  dislikes: number;
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

// Initialize products in Firebase if they don't exist
export const initializeProducts = createAsyncThunk(
  'products/initialize',
  async () => {
    try {
      console.log('Initializing products...');
      const productsRef = ref(db, 'products');
      console.log('Database reference:', productsRef.toString());

      // Clear existing products before initializing
      await set(productsRef, null);

      console.log('No products found, initializing with sample data...');
      const productsObject = sampleProducts.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as Record<string, Product>);

      await set(productsRef, productsObject);
      console.log('Sample products initialized successfully');
      return sampleProducts;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    try {
      const productsRef = ref(db, 'products');
      const snapshot = await get(productsRef);

      if (!snapshot.exists()) {
        return [];
      }

      const productsData = snapshot.val();
      return Object.keys(productsData).map(key => {
        const productData = productsData[key];
        return {
          id: key,
          userId: productData.userId || 'defaultUserId',
          likes: productData.likes || 0,
          dislikes: productData.dislikes || 0,
          ...productData
        };
      });
    } catch (error) {
      console.error('Firebase fetch error:', error);
      throw error;
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: string) => {
    const productRef = ref(db, `products/${productId}`);
    const snapshot = await get(productRef);
    
    if (!snapshot.exists()) {
      throw new Error('Product not found');
    }
    
    const productData = snapshot.val();
    return {
      ...productData,
      likes: productData.likes || 0,
      dislikes: productData.dislikes || 0,
    };
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (product: NewProduct, { getState }) => {
    try {
      const state = getState() as { auth: { user: { uid: string } } };
      const userId = state.auth.user.uid;

      const productsRef = ref(db, 'products');
      const newProductRef = push(productsRef);
      const productId = newProductRef.key!;
      
      const newProduct = {
        id: productId,
        userId: userId,
        likes: 0,
        dislikes: 0,
        ...product
      };
      
      await set(newProductRef, newProduct);
      return newProduct;
    } catch (error) {
      console.error('Firebase create error:', error);
      throw error;
    }
  }
);

export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async ({ productId, newStock }: { productId: string; newStock: number }) => {
    try {
      const productRef = ref(db, `products/${productId}`);
      const snapshot = await get(productRef);
      
      if (!snapshot.exists()) {
        throw new Error('Product not found');
      }
      
      const product = snapshot.val();
      const updatedProduct = { ...product, stock: newStock };
      await set(productRef, updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (updatedProduct: Product) => {
    try {
      const productRef = ref(db, `products/${updatedProduct.id}`);
      const snapshot = await get(productRef);
      if (!snapshot.exists()) {
      throw new Error('Product not found');
    }

    const product = snapshot.val();
    const updatedProductData = { ...product };

    const increment = 1;

    if (updatedProduct.likes > product.likes) {
      updatedProductData.likes = product.likes + increment;
    }

    if (updatedProduct.dislikes > product.dislikes) {
      updatedProductData.dislikes = product.dislikes + increment;
    }

    await set(productRef, updatedProductData);
    return {
      ...updatedProduct,
      likes: updatedProductData.likes,
      dislikes: updatedProductData.dislikes,
    };
  } catch (error) {
    console.error('Firebase update error:', error);
    throw error;
  }
}
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update product';
      })
      .addCase(initializeProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(initializeProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to initialize products';
      })
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create product';
      })
      .addCase(updateProductStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update product stock';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    try {
      const productRef = ref(db, `products/${id}`);
      await set(productRef, null);
      return id;
    } catch (error) {
      console.error('Firebase delete error:', error);
      throw error;
    }
  }
);

export default productsSlice.reducer;
