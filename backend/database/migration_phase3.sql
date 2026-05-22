-- ============================================================================
-- Phase 3: Auth, Orders & Payment Schema Migrations
-- ============================================================================

-- 1. Add auth & profile fields to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS secondary_email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);

-- 2. Add payment & structured shipping to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'COD';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_state VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_pincode VARCHAR(10);
