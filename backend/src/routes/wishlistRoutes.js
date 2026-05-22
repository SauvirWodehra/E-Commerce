/**
 * Wishlist Routes (all protected)
 */

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, wishlistController.getWishlist);
router.get('/ids', authMiddleware, wishlistController.getIds);
router.post('/', authMiddleware, wishlistController.addItem);
router.delete('/:productId', authMiddleware, wishlistController.removeItem);

module.exports = router;
