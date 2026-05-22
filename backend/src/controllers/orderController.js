/**
 * Order Controller
 */

const orderModel = require('../models/orderModel');
const emailService = require('../services/emailService');

/**
 * POST /api/orders — Place a new order.
 */
const placeOrder = async (req, res, next) => {
  try {
    const { items, shipping, paymentMethod, stripePaymentId } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must have at least one item.' });
    }

    if (!shipping || !shipping.addressLine || !shipping.city || !shipping.state || !shipping.pincode) {
      return res.status(400).json({ success: false, error: 'Complete shipping address is required.' });
    }

    if (!paymentMethod || !['COD', 'STRIPE'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, error: 'Payment method must be COD or STRIPE.' });
    }

    if (paymentMethod === 'STRIPE' && !stripePaymentId) {
      return res.status(400).json({ success: false, error: 'Stripe payment ID is required for card payments.' });
    }

    const order = await orderModel.createOrder(
      req.user.id, items, shipping, paymentMethod, stripePaymentId
    );

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders — Get order history for the current user.
 */
const getOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getOrdersByUser(req.user.id);
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id — Get a single order by ID.
 */
const getOrder = async (req, res, next) => {
  try {
    const order = await orderModel.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/orders/:id/cancel — Cancel an order.
 */
const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderModel.cancelOrder(req.params.id, req.user.id);

    // Send cancellation email (async, don't block response)
    emailService.sendOrderCancellationEmail(
      req.user.email, req.user.name, order.id
    ).catch(console.error);

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    if (error.message.includes('Cannot cancel') || error.message.includes('not found')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
};

module.exports = { placeOrder, getOrders, getOrder, cancelOrder };
