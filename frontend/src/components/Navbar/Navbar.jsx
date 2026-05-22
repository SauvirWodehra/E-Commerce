/**
 * Navbar Component
 * 
 * Amazon-style top navigation bar with:
 * - Logo (links to home)
 * - Search bar
 * - Auth state (Hello, User / Sign In)
 * - Orders link
 * - Wishlist heart icon with count
 * - Cart icon with live count
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const { cartItemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchInput.trim());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (onSearch) onSearch(value.trim());
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__main">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="Amazon Clone Home">
          <span className="navbar__logo-text">amazon</span>
          <span className="navbar__logo-suffix">.clone</span>
        </Link>

        {/* Search Bar */}
        <form className="navbar__search" onSubmit={handleSearchSubmit} role="search">
          <input
            type="text"
            className="navbar__search-input"
            placeholder="Search Amazon Clone..."
            value={searchInput}
            onChange={handleInputChange}
            aria-label="Search products"
            id="search-input"
          />
          <button type="submit" className="navbar__search-btn" aria-label="Search">
            <svg className="navbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Auth */}
          {isAuthenticated ? (
            <div className="navbar__action-item" style={{ position: 'relative' }}>
              <div className="navbar__action-text">
                <span className="navbar__action-label">Hello, {user?.name?.split(' ')[0]}</span>
                <span className="navbar__action-value" onClick={logout} style={{ cursor: 'pointer' }}>
                  Sign Out
                </span>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="navbar__action-item">
              <div className="navbar__action-text">
                <span className="navbar__action-label">Hello, Sign in</span>
                <span className="navbar__action-value">Account</span>
              </div>
            </Link>
          )}

          {/* Orders */}
          <Link to="/orders" className="navbar__action-item">
            <div className="navbar__action-text">
              <span className="navbar__action-label">Returns</span>
              <span className="navbar__action-value">& Orders</span>
            </div>
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="navbar__action-item" aria-label="Wishlist">
            <div className="navbar__wishlist">
              <svg className="navbar__wishlist-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="navbar__wishlist-count">{wishlistCount}</span>
              )}
            </div>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="navbar__action-item" aria-label="Shopping Cart">
            <div className="navbar__cart">
              <svg className="navbar__cart-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartItemCount > 0 && (
                <span className="navbar__cart-count">{cartItemCount}</span>
              )}
            </div>
            <span className="navbar__cart-label">Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
