/**
 * Cart Model
 * 
 * DB-backed cart persistence. All operations are per-user.
 * Uses UPSERT pattern to handle duplicate product additions.
 */

const pool = require('../config/db');

/**
 * Gets all cart items for a user, joined with product details.
 */
const getCartByUser = async (userId) => {
  const query = `
    SELECT 
      ci.id AS cart_item_id,
      ci.quantity,
      ci.added_at,
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      p.rating,
      p.review_count,
      p.primary_image_url,
      c.name AS category_name
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.id
    INNER JOIN categories c ON p.category_id = c.id
    WHERE ci.user_id = $1
    ORDER BY ci.added_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows.map((row) => ({
    product: {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      stock_quantity: row.stock_quantity,
      rating: row.rating,
      review_count: row.review_count,
      primary_image_url: row.primary_image_url,
      category_name: row.category_name,
    },
    quantity: row.quantity,
  }));
};

/**
 * Adds or increments a product in the user's cart.
 */
const addToCart = async (userId, productId, quantity = 1) => {
  const query = `
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + $3
    RETURNING *
  `;
  const result = await pool.query(query, [userId, productId, quantity]);
  return result.rows[0];
};

/**
 * Updates the quantity of a product in the cart.
 * Removes the item if quantity is 0 or less.
 */
const updateQuantity = async (userId, productId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  const query = `
    UPDATE cart_items SET quantity = $3
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [userId, productId, quantity]);
  return result.rows[0];
};

/**
 * Removes a specific product from the cart.
 */
const removeFromCart = async (userId, productId) => {
  const query = `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`;
  await pool.query(query, [userId, productId]);
  return true;
};

/**
 * Clears all items from the user's cart.
 */
const clearCart = async (userId) => {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
  return true;
};

module.exports = {
  getCartByUser,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};
