/**
 * Cart Page Component
 * 
 * Displays all items added to the shopping cart.
 * Shows item count, individual product details with quantity controls,
 * and a checkout summary with subtotal.
 */

import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useCart } from '../../context/CartContext';
import './Cart.css';

/**
 * Formats a number as Indian Rupee currency.
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted price string (e.g., "₹2,999.00").
 */
const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartItemCount,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="cart__empty">
          <svg className="cart__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <h2 className="cart__empty-title">Your Amazon Clone Cart is empty</h2>
          <p className="cart__empty-text">
            Your shopping cart is waiting. Give it purpose — fill it with books, electronics, clothing, and more.
          </p>
          <Link to="/" className="cart__empty-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart__container">
        {/* Left: Cart Items */}
        <div>
          <div className="cart__header">
            <h1 className="cart__title">Shopping Cart</h1>
            <p className="cart__subtitle">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in your cart</p>
          </div>

          <div className="cart__items">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="cart__item" id={`cart-item-${product.id}`}>
                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="cart__item-image-wrapper">
                  <img
                    src={product.primary_image_url}
                    alt={product.name}
                    className="cart__item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/160x160/f5f5f5/999?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join(' '))}`;
                    }}
                  />
                </Link>

                {/* Product Details */}
                <div className="cart__item-details">
                  <Link to={`/product/${product.id}`} className="cart__item-name">
                    {product.name}
                  </Link>

                  <span className={`cart__item-stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock_quantity > 0 ? 'In stock' : 'Currently unavailable'}
                  </span>

                  <span className="cart__item-price">{formatCurrency(product.price)}</span>

                  {/* Quantity Controls & Remove */}
                  <div className="cart__item-actions">
                    <div className="cart__quantity">
                      <button
                        className="cart__quantity-btn"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart__quantity-value">{quantity}</span>
                      <button
                        className="cart__quantity-btn"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="cart__remove-btn"
                      onClick={() => removeFromCart(product.id)}
                      id={`remove-${product.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Checkout Summary */}
        <div className="cart__checkout">
          <p className="cart__checkout-total">
            Subtotal ({cartItemCount} item{cartItemCount !== 1 ? 's' : ''}): <strong>{formatCurrency(cartSubtotal)}</strong>
          </p>
          <button className="cart__checkout-btn" id="checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
