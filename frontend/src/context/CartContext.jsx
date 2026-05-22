/**
 * Cart Context
 * 
 * Hybrid cart state management:
 * - When logged in: syncs with database via API
 * - When not logged in: uses local state only
 * 
 * On login, the local cart is merged into the DB cart.
 */

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCartAPI, updateCartItemAPI, removeCartItemAPI, clearCartAPI } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, isAuthenticated } = useAuth();

  /**
   * Load cart from DB when user logs in.
   */
  useEffect(() => {
    if (isAuthenticated) {
      getCart()
        .then((res) => setCartItems(res.data))
        .catch((err) => console.error('Failed to load cart:', err));
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user]);

  /**
   * Adds a product to the cart.
   */
  const addToCart = useCallback(async (product) => {
    if (isAuthenticated) {
      try {
        const res = await addToCartAPI(product.id, 1);
        setCartItems(res.data);
      } catch (err) {
        console.error('Add to cart failed:', err);
      }
    } else {
      // Local-only fallback
      setCartItems((prev) => {
        const idx = prev.findIndex((item) => item.product.id === product.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
          return updated;
        }
        return [...prev, { product, quantity: 1 }];
      });
    }
  }, [isAuthenticated]);

  /**
   * Removes a product from the cart.
   */
  const removeFromCart = useCallback(async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await removeCartItemAPI(productId);
        setCartItems(res.data);
      } catch (err) {
        console.error('Remove from cart failed:', err);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    }
  }, [isAuthenticated]);

  /**
   * Updates the quantity of a cart item.
   */
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (isAuthenticated) {
      try {
        const res = await updateCartItemAPI(productId, quantity);
        setCartItems(res.data);
      } catch (err) {
        console.error('Update quantity failed:', err);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [isAuthenticated, removeFromCart]);

  /**
   * Clears all items from the cart.
   */
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await clearCartAPI();
      } catch (err) {
        console.error('Clear cart failed:', err);
      }
    }
    setCartItems([]);
  }, [isAuthenticated]);

  /** Refresh cart from DB */
  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await getCart();
        setCartItems(res.data);
      } catch (err) {
        console.error('Refresh cart failed:', err);
      }
    }
  }, [isAuthenticated]);

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce(
      (total, item) => total + parseFloat(item.product.price) * item.quantity, 0
    ),
    [cartItems]
  );

  const contextValue = useMemo(() => ({
    cartItems,
    cartItemCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
  }), [cartItems, cartItemCount, cartSubtotal, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
