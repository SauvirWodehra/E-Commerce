/**
 * Checkout Page
 * 
 * Multi-section checkout: shipping address, order review, payment method, place order.
 * Redirects to /auth if not logged in.
 * Supports COD and Stripe payment.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { placeOrder, createPaymentIntent } from '../../services/api';
import './Checkout.css';

const formatCurrency = (amount) =>
  `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Shipping form — pre-filled from user profile
  const [shipping, setShipping] = useState({
    addressLine: '', city: '', state: '', pincode: '',
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: '/checkout' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Pre-fill shipping from user profile
  useEffect(() => {
    if (user) {
      setShipping({
        addressLine: user.address_line || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && isAuthenticated && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [authLoading, isAuthenticated, cartItems, navigate]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setError('');

    // Validate shipping
    if (!shipping.addressLine || !shipping.city || !shipping.state || !shipping.pincode) {
      setError('Please fill in all shipping address fields.');
      return;
    }

    // Validate card fields if Stripe selected
    if (paymentMethod === 'STRIPE') {
      const cardNum = document.getElementById('card-number')?.value?.replace(/\s/g, '');
      const expiry = document.getElementById('card-expiry')?.value;
      const cvv = document.getElementById('card-cvv')?.value;

      if (!cardNum || cardNum.length < 13) {
        setError('Please enter a valid card number.');
        return;
      }
      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        setError('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (!cvv || cvv.length < 3) {
        setError('Please enter a valid CVV.');
        return;
      }
    }

    setPlacing(true);

    try {
      let stripePaymentId = null;

      // For Stripe: create & confirm payment intent
      if (paymentMethod === 'STRIPE') {
        try {
          const paymentRes = await createPaymentIntent(cartSubtotal);
          stripePaymentId = paymentRes.paymentIntentId;
          console.log('[Checkout] Payment confirmed:', stripePaymentId, '| Status:', paymentRes.status);
        } catch (err) {
          setError('Card payment failed. Please check your card details or try COD.');
          setPlacing(false);
          return;
        }
      }

      // Build order items
      const items = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      // Place order
      const res = await placeOrder({
        items,
        shipping,
        paymentMethod,
        stripePaymentId,
      });

      // Clear cart and navigate to confirmation
      await clearCart();
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout__container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout__container">
        <h1 className="checkout__title">Checkout ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</h1>

        {error && <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>}

        {/* 1. Shipping Address */}
        <div className="checkout__section">
          <h2>1. Shipping Address</h2>
          <div className="checkout__form-grid">
            <div className="checkout__field checkout__field--full">
              <label htmlFor="ship-address">Address</label>
              <input id="ship-address" name="addressLine" value={shipping.addressLine} onChange={handleShippingChange} placeholder="Street address, House No., Landmark" />
            </div>
            <div className="checkout__field">
              <label htmlFor="ship-city">City</label>
              <input id="ship-city" name="city" value={shipping.city} onChange={handleShippingChange} />
            </div>
            <div className="checkout__field">
              <label htmlFor="ship-state">State</label>
              <input id="ship-state" name="state" value={shipping.state} onChange={handleShippingChange} />
            </div>
            <div className="checkout__field">
              <label htmlFor="ship-pincode">Pincode</label>
              <input id="ship-pincode" name="pincode" value={shipping.pincode} onChange={handleShippingChange} />
            </div>
          </div>
        </div>

        {/* 2. Order Review */}
        <div className="checkout__section">
          <h2>2. Review Items</h2>
          <div className="checkout__items">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="checkout__item">
                <img
                  src={product.primary_image_url}
                  alt={product.name}
                  className="checkout__item-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/f5f5f5/999?text=...'; }}
                />
                <div className="checkout__item-info">
                  <div className="checkout__item-name">{product.name}</div>
                  <div className="checkout__item-qty">Qty: {quantity}</div>
                </div>
                <div className="checkout__item-price">
                  {formatCurrency(parseFloat(product.price) * quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="checkout__totals">
            <div className="checkout__total-row">
              <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="checkout__total-row">
              <span>Shipping</span>
              <span style={{ color: '#007600' }}>FREE</span>
            </div>
            <div className="checkout__total-row checkout__total-row--grand">
              <span>Order Total</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
          </div>
        </div>

        {/* 3. Payment Method */}
        <div className="checkout__section">
          <h2>3. Payment Method</h2>
          <div className="checkout__payment-options">
            <label className={`checkout__payment-option ${paymentMethod === 'COD' ? 'checkout__payment-option--selected' : ''}`}>
              <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
              <div>
                <div className="checkout__payment-label">💵 Cash on Delivery (COD)</div>
                <div className="checkout__payment-desc">Pay when your order is delivered to your doorstep.</div>
              </div>
            </label>

            <label className={`checkout__payment-option ${paymentMethod === 'STRIPE' ? 'checkout__payment-option--selected' : ''}`}>
              <input type="radio" name="payment" value="STRIPE" checked={paymentMethod === 'STRIPE'} onChange={() => setPaymentMethod('STRIPE')} />
              <div>
                <div className="checkout__payment-label">💳 Pay with Card (Stripe)</div>
                <div className="checkout__payment-desc">Secure payment via Stripe test gateway.</div>
              </div>
            </label>
          </div>

          {/* Card Details — shown when Stripe is selected */}
          {paymentMethod === 'STRIPE' && (
            <div className="checkout__card-fields">
              <div className="checkout__card-header">
                <span className="checkout__card-icons">
                  <svg width="38" height="24" viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="4" fill="#1A1F71"/><text x="19" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">VISA</text></svg>
                  <svg width="38" height="24" viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="4" fill="#252525"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B" opacity="0.8"/></svg>
                </span>
                <span style={{ fontSize: '12px', color: '#007600' }}>🔒 Secure & Encrypted</span>
              </div>
              <div className="checkout__field checkout__field--full">
                <label htmlFor="card-number">Card Number</label>
                <input
                  id="card-number"
                  type="text"
                  defaultValue="4242 4242 4242 4242"
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  style={{ fontFamily: 'monospace', fontSize: '16px', letterSpacing: '2px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="checkout__field">
                  <label htmlFor="card-expiry">Expiry (MM/YY)</label>
                  <input
                    id="card-expiry"
                    type="text"
                    defaultValue="01/27"
                    maxLength={5}
                    placeholder="MM/YY"
                    style={{ fontFamily: 'monospace', fontSize: '16px' }}
                  />
                </div>
                <div className="checkout__field">
                  <label htmlFor="card-cvv">CVV</label>
                  <input
                    id="card-cvv"
                    type="password"
                    defaultValue="123"
                    maxLength={4}
                    placeholder="•••"
                    style={{ fontFamily: 'monospace', fontSize: '16px' }}
                  />
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                Test mode — no real charges. Using Stripe test card.
              </p>
            </div>
          )}
        </div>

        {/* Place Order */}
        <button
          className="checkout__place-btn"
          onClick={handlePlaceOrder}
          disabled={placing || cartItems.length === 0}
          id="place-order-btn"
        >
          {placing ? 'Placing Order...' : `Place your order — ${formatCurrency(cartSubtotal)}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
