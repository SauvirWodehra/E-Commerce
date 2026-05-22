/**
 * Auth Context
 * 
 * Global authentication state management.
 * Now supports 2-step OTP flow:
 * 1. login/register → returns { otpSent, email }
 * 2. verifyOTP → returns { user, token }
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  getProfile, loginUser, registerUser, verifyOTP as verifyOTPApi,
  resendOTP as resendOTPApi, setToken, removeToken, getToken
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-load user on mount if token exists
  useEffect(() => {
    const token = getToken();
    if (token) {
      getProfile()
        .then((res) => setUser(res.data))
        .catch(() => {
          removeToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Step 1: Login — sends OTP email.
   * Returns { otpSent, email, previewUrl }.
   */
  const login = useCallback(async (email, password) => {
    const res = await loginUser(email, password);
    return res; // { otpSent: true, email }
  }, []);

  /**
   * Step 1: Register — validates data, sends OTP email.
   * Returns { otpSent, email, previewUrl }.
   */
  const register = useCallback(async (userData) => {
    const res = await registerUser(userData);
    return res; // { otpSent: true, email }
  }, []);

  /**
   * Step 2: Verify OTP — completes auth, stores token.
   * Returns user object.
   */
  const verifyOTP = useCallback(async (email, code, purpose) => {
    const res = await verifyOTPApi(email, code, purpose);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  /**
   * Resend OTP for the given email+purpose.
   */
  const resendOTP = useCallback(async (email, purpose) => {
    const res = await resendOTPApi(email, purpose);
    return res;
  }, []);

  /**
   * Logout — clears token and user state.
   */
  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  const contextValue = useMemo(() => ({
    user,
    loading,
    isAuthenticated,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
  }), [user, loading, isAuthenticated, login, register, verifyOTP, resendOTP, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
