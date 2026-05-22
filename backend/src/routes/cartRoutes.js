/**
 * Cart Routes (all protected by authMiddleware)
 */

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, cartController.getCart);
router.post('/', authMiddleware, cartController.addItem);
router.put('/:productId', authMiddleware, cartController.updateItem);
router.delete('/clear', authMiddleware, cartController.clearCart);
router.delete('/:productId', authMiddleware, cartController.removeItem);

module.exports = router;
