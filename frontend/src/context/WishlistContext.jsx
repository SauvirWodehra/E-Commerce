/**
 * Wishlist Context
 * 
 * Global wishlist state management.
 * Synced with DB when user is logged in.
 * Provides add/remove/toggle/check operations.
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getWishlistIds, addToWishlistAPI, removeFromWishlistAPI, getWishlist as getWishlistAPI } from '../services/api';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistItems, setWishlistItems] = useState([]);
  const { isAuthenticated, user } = useAuth();

  // Load wishlist IDs when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      getWishlistIds()
        .then((res) => setWishlistIds(new Set(res.data)))
        .catch((err) => console.error('Failed to load wishlist ids:', err));
    } else {
      setWishlistIds(new Set());
      setWishlistItems([]);
    }
  }, [isAuthenticated, user]);

  /** Check if a product is in the wishlist */
  const isInWishlist = useCallback((productId) => {
    return wishlistIds.has(productId);
  }, [wishlistIds]);

  /** Toggle a product in/out of the wishlist */
  const toggleWishlist = useCallback(async (productId) => {
    if (!isAuthenticated) return false;

    if (wishlistIds.has(productId)) {
      // Remove
      try {
        await removeFromWishlistAPI(productId);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
      } catch (err) {
        console.error('Remove from wishlist failed:', err);
      }
    } else {
      // Add
      try {
        await addToWishlistAPI(productId);
        setWishlistIds((prev) => new Set([...prev, productId]));
      } catch (err) {
        console.error('Add to wishlist failed:', err);
      }
    }
    return true;
  }, [isAuthenticated, wishlistIds]);

  /** Load full wishlist items (for wishlist page) */
  const loadWishlistItems = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getWishlistAPI();
      setWishlistItems(res.data);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  }, [isAuthenticated]);

  const wishlistCount = wishlistIds.size;

  const contextValue = useMemo(() => ({
    wishlistIds,
    wishlistItems,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    loadWishlistItems,
  }), [wishlistIds, wishlistItems, wishlistCount, isInWishlist, toggleWishlist, loadWishlistItems]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
