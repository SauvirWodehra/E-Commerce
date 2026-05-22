/**
 * Order Routes (all protected by authMiddleware)
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, orderController.placeOrder);
router.get('/', authMiddleware, orderController.getOrders);
router.get('/:id', authMiddleware, orderController.getOrder);
router.patch('/:id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;
