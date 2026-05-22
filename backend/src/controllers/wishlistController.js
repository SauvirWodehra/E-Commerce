/**
 * Wishlist Controller
 */

const wishlistModel = require('../models/wishlistModel');

const getWishlist = async (req, res, next) => {
  try {
    const items = await wishlistModel.getWishlistByUser(req.user.id);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, error: 'productId required.' });
    await wishlistModel.addToWishlist(req.user.id, productId);
    const items = await wishlistModel.getWishlistByUser(req.user.id);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    await wishlistModel.removeFromWishlist(req.user.id, req.params.productId);
    const items = await wishlistModel.getWishlistByUser(req.user.id);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const getIds = async (req, res, next) => {
  try {
    const ids = await wishlistModel.getWishlistIds(req.user.id);
    return res.status(200).json({ success: true, data: ids });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addItem, removeItem, getIds };
