-- ============================================================================
-- Amazon Clone — Database Schema
-- Database: SDE (PostgreSQL 18)
-- ============================================================================

-- Enable UUID generation (built-in in PG 13+)
-- gen_random_uuid() is available by default in PG 13+

-- ============================================================================
-- 1. Categories Table
-- Stores product categories for filtering (e.g., Electronics, Books)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 2. Products Table
-- Stores product information with a foreign key to categories
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  primary_image_url VARCHAR(500),
  specifications JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 3. Product Images Table
-- Stores multiple images per product for the detail page carousel
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- ============================================================================
-- 4. Users Table
-- Stores user data; a default user is seeded for the "assume logged in" flow
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 5. Cart Items Table
-- Stores items added to a user's shopping cart
-- ============================================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================================================
-- 6. Orders Table
-- Stores placed orders with shipping details
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_address TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'PLACED',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 7. Order Items Table
-- Stores individual items within an order (snapshot of price at purchase time)
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0)
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Speed up product filtering by category
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- Speed up product name search (full-text search using GIN index)
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('english', name));

-- Speed up cart lookups by user
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);

-- Speed up order lookups by user
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- Speed up order items lookups by order
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
