/**
 * Order Model
 * 
 * Handles order creation (transactional), history, and detail lookups.
 * Uses PostgreSQL transactions to ensure atomicity:
 * INSERT order → INSERT order_items → decrement stock → clear cart.
 */

const pool = require('../config/db');

/**
 * Creates a new order within a database transaction.
 * Snapshots current prices, decrements stock, and clears the user's cart.
 * 
 * @param {string} userId
 * @param {Array} items - [{ productId, quantity, price }]
 * @param {object} shipping - { addressLine, city, state, pincode }
 * @param {string} paymentMethod - 'COD' or 'STRIPE'
 * @param {string|null} stripePaymentId
 * @returns {object} The created order with items.
 */
const createOrder = async (userId, items, shipping, paymentMethod = 'COD', stripePaymentId = null) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

    // Build full shipping address string
    const shippingAddress = `${shipping.addressLine}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}`;

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, shipping_city, shipping_state, shipping_pincode, payment_method, stripe_payment_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PLACED')
       RETURNING *`,
      [userId, totalAmount, shippingAddress, shipping.city, shipping.state, shipping.pincode, paymentMethod, stripePaymentId]
    );
    const order = orderResult.rows[0];

    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.productId, item.quantity, item.price]
      );

      // Decrement stock
      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1`,
        [item.quantity, item.productId]
      );
    }

    // Clear user's cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    // Fetch order items for response
    const orderItems = await getOrderItems(order.id);

    return { ...order, items: orderItems };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Fetches all orders for a user with item summaries.
 */
const getOrdersByUser = async (userId) => {
  const query = `
    SELECT 
      o.id, o.total_amount, o.shipping_address, o.status, o.payment_method,
      o.shipping_city, o.shipping_state, o.shipping_pincode,
      o.created_at,
      COUNT(oi.id) AS item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

/**
 * Fetches a single order by ID with full item details.
 */
const getOrderById = async (orderId) => {
  const orderQuery = `
    SELECT o.*, u.name AS user_name, u.email AS user_email
    FROM orders o
    INNER JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
  `;
  const orderResult = await pool.query(orderQuery, [orderId]);

  if (orderResult.rows.length === 0) return null;

  const order = orderResult.rows[0];
  order.items = await getOrderItems(orderId);

  return order;
};

/**
 * Helper: fetches items for a specific order, joined with product details.
 */
const getOrderItems = async (orderId) => {
  const query = `
    SELECT 
      oi.id, oi.quantity, oi.price_at_purchase,
      p.id AS product_id, p.name AS product_name, p.primary_image_url
    FROM order_items oi
    INNER JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
    ORDER BY oi.id ASC
  `;
  const result = await pool.query(query, [orderId]);
  return result.rows;
};

/**
 * Cancels an order. Only allowed if status is PLACED or PENDING.
 * Restores stock quantities in a transaction.
 */
const cancelOrder = async (orderId, userId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verify order belongs to user and is cancellable
    const orderResult = await client.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      throw new Error('Order not found.');
    }

    const order = orderResult.rows[0];
    if (!['PLACED', 'PENDING'].includes(order.status)) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    // Get order items to restore stock
    const itemsResult = await client.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    // Restore stock for each item
    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    await client.query(
      `UPDATE orders SET status = 'CANCELLED' WHERE id = $1`,
      [orderId]
    );

    await client.query('COMMIT');

    return { ...order, status: 'CANCELLED' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  cancelOrder,
};
