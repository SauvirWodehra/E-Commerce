/**
 * Order Confirmation Page
 * 
 * Displays after a successful order placement.
 * Shows Order ID, shipping address, items, and total.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { getOrderById } from '../../services/api';
import './OrderConfirmation.css';

const formatCurrency = (amount) =>
  `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="order-confirm-page">
        <Navbar />
        <div className="order-confirm__container">
          <p>Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirm-page">
        <Navbar />
        <div className="order-confirm__container">
          <p>Order not found.</p>
          <Link to="/">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirm-page">
      <Navbar />

      <div className="order-confirm__container">
      <div className="order-confirm__card">
          {/* Status-dependent Icon */}
          {order.status === 'CANCELLED' ? (
            <div className="order-confirm__icon order-confirm__icon--cancelled">
              <svg viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <div className="order-confirm__icon">
              <svg viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          )}

          <h1 className={`order-confirm__title ${order.status === 'CANCELLED' ? 'order-confirm__title--cancelled' : ''}`}>
            {order.status === 'CANCELLED' ? 'Order was Cancelled' : 'Order placed successfully!'}
          </h1>
          <p className="order-confirm__subtitle">
            {order.status === 'CANCELLED'
              ? 'This order has been cancelled. If you paid online, your refund will be processed within 5-7 business days.'
              : 'Thank you for your purchase. Your order is being processed.'
            }
          </p>

          {/* Order ID */}
          <div className={`order-confirm__id ${order.status === 'CANCELLED' ? 'order-confirm__id--cancelled' : ''}`}>
            <div className="order-confirm__id-label">Order ID</div>
            <div className="order-confirm__id-value">{order.id}</div>
          </div>

          {/* Order Details */}
          <div className="order-confirm__details">
            <h3>Order Details</h3>
            <div className="order-confirm__detail-row">
              <span>Status</span>
              <span className={`order-confirm__status-badge ${
                order.status === 'CANCELLED' ? 'order-confirm__status-badge--cancelled' :
                order.status === 'DELIVERED' ? 'order-confirm__status-badge--delivered' :
                'order-confirm__status-badge--active'
              }`}>
                {order.status === 'CANCELLED' && '❌ '}
                {order.status === 'DELIVERED' && '✅ '}
                {order.status === 'PLACED' && '📦 '}
                {order.status}
              </span>
            </div>
            <div className="order-confirm__detail-row">
              <span>Payment</span>
              <span>{order.payment_method === 'COD' ? 'Cash on Delivery' : 'Card (Stripe)'}</span>
            </div>
            <div className="order-confirm__detail-row">
              <span>Shipping</span>
              <span>{order.shipping_address}</span>
            </div>
            <div className="order-confirm__detail-row">
              <span>Order Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div className="order-confirm__items">
              <h3>Items Ordered</h3>
              {order.items.map((item) => (
                <div key={item.id} className="order-confirm__item">
                  <img
                    src={item.primary_image_url}
                    alt={item.product_name}
                    className="order-confirm__item-img"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50/f5f5f5/999?text=...'; }}
                  />
                  <span className="order-confirm__item-name">{item.product_name} × {item.quantity}</span>
                  <span className="order-confirm__item-price">{formatCurrency(item.price_at_purchase * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="order-confirm__actions">
            <Link to="/orders" className="order-confirm__btn order-confirm__btn--primary">
              View Orders
            </Link>
            <Link to="/" className="order-confirm__btn order-confirm__btn--secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
