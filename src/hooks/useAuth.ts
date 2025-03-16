import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, setLoading } from '../store/slices/authSlice';
import { fetchCart } from '../store/slices/cartSlice';
import { AppDispatch } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
      if (user) {
        // Fetch cart data when user logs in
        dispatch(fetchCart(user.uid));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuth; 