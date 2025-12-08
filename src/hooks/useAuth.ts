import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from '../store/slices/authSlice';
import { fetchCart } from '../store/slices/cartSlice';
import { AppDispatch } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
      if (user) {
        dispatch(fetchCart(user.uid));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuth; 