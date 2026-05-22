/**
 * API Service Layer
 * 
 * Centralized API communication module.
 * All HTTP requests to the backend are routed through this service.
 * Includes auth token management for protected endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ---------------------------------------------------------------------------
// Token Management
// ---------------------------------------------------------------------------

/** Gets the JWT token from localStorage. */
export const getToken = () => localStorage.getItem('amazon_clone_token');

/** Sets the JWT token in localStorage. */
export const setToken = (token) => localStorage.setItem('amazon_clone_token', token);

/** Removes the JWT token from localStorage. */
export const removeToken = () => localStorage.removeItem('amazon_clone_token');

// ---------------------------------------------------------------------------
// Generic Fetch Wrapper
// ---------------------------------------------------------------------------

/**
 * Generic fetch wrapper with error handling and auth headers.
 */
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// Product APIs (Public)
// ---------------------------------------------------------------------------

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  const queryString = params.toString();
  return fetchAPI(`/products${queryString ? `?${queryString}` : ''}`);
};

export const getCategories = async () => fetchAPI('/categories');

export const getProductById = async (productId) => fetchAPI(`/products/${productId}`);

// ---------------------------------------------------------------------------
// Auth APIs
// ---------------------------------------------------------------------------

export const registerUser = async (userData) => {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (email, password) => {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const verifyOTP = async (email, code, purpose) => {
  return fetchAPI('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, code, purpose }),
  });
};

export const resendOTP = async (email, purpose) => {
  return fetchAPI('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email, purpose }),
  });
};

export const getProfile = async () => fetchAPI('/auth/me');

// ---------------------------------------------------------------------------
// Cart APIs (Protected)
// ---------------------------------------------------------------------------

export const getCart = async () => fetchAPI('/cart');

export const addToCartAPI = async (productId, quantity = 1) => {
  return fetchAPI('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
};

export const updateCartItemAPI = async (productId, quantity) => {
  return fetchAPI(`/cart/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
};

export const removeCartItemAPI = async (productId) => {
  return fetchAPI(`/cart/${productId}`, { method: 'DELETE' });
};

export const clearCartAPI = async () => {
  return fetchAPI('/cart/clear', { method: 'DELETE' });
};

// ---------------------------------------------------------------------------
// Order APIs (Protected)
// ---------------------------------------------------------------------------

export const placeOrder = async (orderData) => {
  return fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const getOrders = async () => fetchAPI('/orders');

export const getOrderById = async (orderId) => fetchAPI(`/orders/${orderId}`);

export const cancelOrderAPI = async (orderId) => {
  return fetchAPI(`/orders/${orderId}/cancel`, { method: 'PATCH' });
};

// ---------------------------------------------------------------------------
// Payment APIs (Protected)
// ---------------------------------------------------------------------------

export const createPaymentIntent = async (amount) => {
  return fetchAPI('/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
};

// ---------------------------------------------------------------------------
// Wishlist APIs (Protected)
// ---------------------------------------------------------------------------

export const getWishlist = async () => fetchAPI('/wishlist');

export const getWishlistIds = async () => fetchAPI('/wishlist/ids');

export const addToWishlistAPI = async (productId) => {
  return fetchAPI('/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
};

export const removeFromWishlistAPI = async (productId) => {
  return fetchAPI(`/wishlist/${productId}`, { method: 'DELETE' });
};
