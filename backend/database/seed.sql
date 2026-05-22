-- ============================================================================
-- Amazon Clone — Seed Data
-- All product names match their corresponding DummyJSON CDN images.
-- ============================================================================

-- Default User
INSERT INTO users (id, name, email, is_default) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Default User', 'user@amazon-clone.com', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Categories
INSERT INTO categories (id, name) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Electronics'),
  ('c1000000-0000-0000-0000-000000000002', 'Food'),
  ('c1000000-0000-0000-0000-000000000003', 'Clothing'),
  ('c1000000-0000-0000-0000-000000000004', 'Home & Kitchen'),
  ('c1000000-0000-0000-0000-000000000005', 'Sports & Outdoors'),
  ('c1000000-0000-0000-0000-000000000006', 'Toys & Games')
ON CONFLICT (name) DO NOTHING;

-- Electronics
INSERT INTO products (id, category_id, name, description, price, stock_quantity, rating, review_count, primary_image_url) VALUES
('a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001',
 'Apple AirPods Max Silver', 'Premium over-ear headphones with Active Noise Cancellation, Transparency mode, spatial audio, and 20 hours of battery life.',
 2999.00, 45, 4.3, 1284, 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001',
 'Apple Watch Series 4 Gold', 'Advanced smartwatch with heart rate monitoring, ECG app, fall detection, GPS, and cellular connectivity. Gold aluminium case.',
 4999.00, 32, 4.5, 2156, 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001',
 'Amazon Echo Plus', 'Smart speaker with premium sound, built-in Alexa, smart home hub, and temperature sensor.',
 1799.00, 67, 4.2, 945, 'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001',
 'Apple iPhone Charger', 'Original Apple USB-C to Lightning charging cable. Fast charging support for iPhone and iPad.',
 599.00, 150, 4.4, 3421, 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/thumbnail.webp');

-- Food
INSERT INTO products (id, category_id, name, description, price, stock_quantity, rating, review_count, primary_image_url) VALUES
('a1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002',
 'Nescafe Classic Coffee', 'Premium instant coffee made from 100% pure coffee beans. Rich, smooth taste. 200g jar.',
 349.00, 89, 4.6, 5678, 'https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002',
 'Whey Protein Powder', 'High-quality whey protein supplement for muscle building and recovery. 24g protein per serving, vanilla flavor. 1kg.',
 499.00, 56, 4.7, 8932, 'https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000002',
 'Organic Honey Jar', 'Pure raw organic honey from natural beehives. Unfiltered, unprocessed. 500g glass jar.',
 2850.00, 23, 4.4, 3241, 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000002',
 'Fresh Fruit Juice Pack', 'Assorted fresh fruit juice variety pack. No added sugar, no preservatives. 6 x 200ml.',
 399.00, 41, 4.5, 2187, 'https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp');

-- Clothing
INSERT INTO products (id, category_id, name, description, price, stock_quantity, rating, review_count, primary_image_url) VALUES
('a1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000003',
 'Gigabyte Aorus Men T-Shirt', 'Official Gigabyte Aorus gaming t-shirt for men. Premium cotton blend with printed logo.',
 699.00, 120, 4.1, 1567, 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000003',
 'Nike Air Jordan 1 Red & Black', 'Iconic Nike Air Jordan 1 sneakers in red and black colorway. Premium leather upper, Air-Sole cushioning.',
 2499.00, 38, 4.3, 892, 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000003',
 'Man Plaid Casual Shirt', 'Classic plaid pattern casual shirt for men. Soft cotton fabric with button-down collar.',
 1899.00, 25, 4.2, 634, 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000003',
 'Man Short Sleeve Shirt', 'Lightweight short sleeve shirt for men. Breathable fabric with regular fit.',
 1299.00, 55, 4.0, 445, 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp');

-- Home & Kitchen
INSERT INTO products (id, category_id, name, description, price, stock_quantity, rating, review_count, primary_image_url) VALUES
('a1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000004',
 'Black Aluminium Cup', 'Sleek black aluminium drinking cup with matte finish. Lightweight and durable. 350ml.',
 899.00, 78, 4.5, 2341, 'https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000004',
 'Carbon Steel Wok Pan', 'Professional-grade carbon steel wok. Flat bottom design compatible with all cooktops. 14 inch.',
 3499.00, 18, 4.3, 876, 'https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000004',
 'Modern Table Lamp', 'Elegant modern table lamp with adjustable brightness. Minimalist design, warm LED light, touch control.',
 1599.00, 42, 4.4, 1123, 'https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000004',
 'Wooden Chopping Board', 'Premium wooden chopping board from natural hardwood. Juice grooves and non-slip edges.',
 1199.00, 33, 4.2, 567, 'https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/thumbnail.webp');

-- Sports & Outdoors
INSERT INTO products (id, category_id, name, description, price, stock_quantity, rating, review_count, primary_image_url) VALUES
('a1000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000005',
 'Professional Cricket Bat', 'Full-size professional cricket bat made from premium English willow. Lightweight with excellent balance.',
 1299.00, 64, 4.4, 1876, 'https://cdn.dummyjson.com/product-images/sports-accessories/cricket-bat/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000005',
 'Metal Baseball Bat', 'Durable aluminium alloy baseball bat with non-slip rubber grip. 34 inch length.',
 4599.00, 15, 4.6, 743, 'https://cdn.dummyjson.com/product-images/sports-accessories/metal-baseball-bat/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000005',
 'Tennis Ball Pack', 'High-quality pressurized tennis balls for practice and match play. ITF approved. Pack of 3.',
 5999.00, 12, 4.3, 456, 'https://cdn.dummyjson.com/product-images/sports-accessories/tennis-ball/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000005',
 'Classic Football', 'Official size 5 football with hand-stitched panels. Durable PU leather cover.',
 799.00, 92, 4.5, 2134, 'https://cdn.dummyjson.com/product-images/sports-accessories/football/thumbnail.webp');

-- Toys & Games
INSERT INTO products (id, category_id, name, description, price, stock_quantity, rating, review_count, primary_image_url) VALUES
('a1000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000006',
 'Wooden Decoration Swing', 'Beautiful handcrafted wooden swing decoration for home or garden. Vintage style.',
 1499.00, 48, 4.6, 3245, 'https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000022', 'c1000000-0000-0000-0000-000000000006',
 'Classic 300 Touring Car Model', 'Detailed die-cast model of the classic 300 Touring automobile. 1:18 scale.',
 2199.00, 27, 4.2, 876, 'https://cdn.dummyjson.com/product-images/vehicle/300-touring/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000023', 'c1000000-0000-0000-0000-000000000006',
 'Family Tree Photo Frame', 'Tree-shaped photo frame for multiple family photos. Metal with antique bronze finish.',
 999.00, 35, 4.4, 1234, 'https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp'),
('a1000000-0000-0000-0000-000000000024', 'c1000000-0000-0000-0000-000000000006',
 'House Showpiece Plant', 'Decorative artificial plant showpiece for home and office. Realistic green leaves in ceramic pot.',
 1799.00, 22, 4.5, 567, 'https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp');

-- Product Images for carousel
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000001', 'https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/thumbnail.webp', 2),
  ('a1000000-0000-0000-0000-000000000001', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp', 3),
  ('a1000000-0000-0000-0000-000000000002', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000002', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp', 2),
  ('a1000000-0000-0000-0000-000000000005', 'https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000005', 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp', 2),
  ('a1000000-0000-0000-0000-000000000010', 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000010', 'https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp', 2);
