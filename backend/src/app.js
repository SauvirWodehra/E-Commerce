/**
 * Express Application Setup
 * 
 * Configures middleware (CORS, JSON parsing), mounts API routes,
 * and attaches the centralized error handler.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const paymentController = require('./controllers/paymentController');
const { authMiddleware } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Enable CORS for frontend requests (React dev server on port 5173)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public (product images, etc.)
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Amazon Clone API is running',
    timestamp: new Date().toISOString(),
  });
});

// Product and category routes (public)
app.use('/api', productRoutes);

// Auth routes (public: register, login | protected: me)
app.use('/api/auth', authRoutes);

// Cart routes (all protected)
app.use('/api/cart', cartRoutes);

// Order routes (all protected)
app.use('/api/orders', orderRoutes);

// Wishlist routes (all protected)
app.use('/api/wishlist', wishlistRoutes);

// Payment route (protected)
app.post('/api/create-payment-intent', authMiddleware, paymentController.createPaymentIntent);

// ---------------------------------------------------------------------------
// 404 Handler — for unmatched routes
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ---------------------------------------------------------------------------
// Centralized Error Handler — must be last
// ---------------------------------------------------------------------------
app.use(errorHandler);

module.exports = app;
