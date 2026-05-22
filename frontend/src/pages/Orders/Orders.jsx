/**
 * Orders Page — Order History with Cancel functionality
 * 
 * Displays all past orders for the logged-in user.
 * Shows order ID, date, total, payment method, status badge.
 * Cancel button for orders with PLACED/PENDING status.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import { getOrders, cancelOrderAPI } from '../../services/api';
import './Orders.css';

const formatCurrency = (amount) =>
  `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

const statusClass = (status) => {
  const s = status.toLowerCase();
  if (s === 'delivered') return 'orders__status--delivered';
  if (s === 'cancelled') return 'orders__status--cancelled';
  return 'orders__status--pending';
};

const Orders = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: '/orders' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      getOrders()
        .then((res) => setOrders(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setCancellingId(orderId);
    try {
      await cancelOrderAPI(orderId);
      // Update order status locally
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: 'CANCELLED' } : o)
      );
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <div className="orders-page"><Navbar /><div className="orders__container"><p>Loading...</p></div></div>;
  }

  return (
    <div className="orders-page">
      <Navbar />
      <div className="orders__container">
        <h1 className="orders__title">Your Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="orders__empty">
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet.</p>
            <Link to="/">Start Shopping</Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="orders__card">
              <div className="orders__card-header">
                <div className="orders__card-header-item">
                  <span className="orders__card-header-label">Order Placed</span>
                  <span className="orders__card-header-value">{formatDate(order.created_at)}</span>
                </div>
                <div className="orders__card-header-item">
                  <span className="orders__card-header-label">Total</span>
                  <span className="orders__card-header-value">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="orders__card-header-item">
                  <span className="orders__card-header-label">Payment</span>
                  <span className="orders__card-header-value">{order.payment_method === 'COD' ? 'Cash on Delivery' : 'Card'}</span>
                </div>
                <div className="orders__card-header-item">
                  <span className="orders__card-header-label">Items</span>
                  <span className="orders__card-header-value">{order.item_count}</span>
                </div>
              </div>
              <div className="orders__card-body">
                <div className="orders__card-row">
                  <span>
                    <span className={`orders__status ${statusClass(order.status)}`}>{order.status}</span>
                  </span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Cancel Button — only for PLACED or PENDING */}
                    {['PLACED', 'PENDING'].includes(order.status) && (
                      <button
                        className="orders__cancel-btn"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                      >
                        {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                    <Link to={`/order-confirmation/${order.id}`} style={{ color: 'var(--color-text-link)', fontSize: '13px' }}>
                      View Order Details →
                    </Link>
                  </div>
                </div>
                <div className="orders__card-row" style={{ marginTop: '8px' }}>
                  <span>Ship to: {order.shipping_address}</span>
                </div>
                <div className="orders__order-id">Order # {order.id}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
