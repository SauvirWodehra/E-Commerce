/**
 * Cart Controller
 */

const cartModel = require('../models/cartModel');

const getCart = async (req, res, next) => {
  try {
    const items = await cartModel.getCartByUser(req.user.id);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, error: 'productId is required.' });
    }
    await cartModel.addToCart(req.user.id, productId, quantity || 1);
    const items = await cartModel.getCartByUser(req.user.id);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) {
      return res.status(400).json({ success: false, error: 'quantity is required.' });
    }
    await cartModel.updateQuantity(req.user.id, productId, quantity);
    const items = await cartModel.getCartByUser(req.user.id);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await cartModel.removeFromCart(req.user.id, productId);
    const items = await cartModel.getCartByUser(req.user.id);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await cartModel.clearCart(req.user.id);
    return res.status(200).json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
