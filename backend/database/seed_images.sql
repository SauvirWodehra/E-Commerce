-- ============================================================================
-- Amazon Clone — Complete Product Images (Carousel) for All 24 Products
-- Run this after seed.sql to populate carousel images for every product
-- ============================================================================

-- Clear existing images to avoid duplicates
DELETE FROM product_images;

-- Electronics (1-4)
-- 1. Apple AirPods Max Silver
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000001', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000001', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp', 3),
  ('a1000000-0000-0000-0000-000000000001', 'https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp', 4);

-- 2. Apple Watch Series 4 Gold
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000002', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000002', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000002', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000002', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/3.webp', 4);

-- 3. Amazon Echo Plus
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000003', 'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000003', 'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000003', 'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000003', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/1.webp', 4);

-- 4. Apple iPhone Charger
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000004', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000004', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000004', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000004', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/1.webp', 4);

-- Food (5-8)
-- 5. Nescafe Classic Coffee
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000005', 'https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000005', 'https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000005', 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp', 3),
  ('a1000000-0000-0000-0000-000000000005', 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/1.webp', 4);

-- 6. Whey Protein Powder
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000006', 'https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000006', 'https://cdn.dummyjson.com/product-images/groceries/protein-powder/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000006', 'https://cdn.dummyjson.com/product-images/groceries/protein-powder/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000006', 'https://cdn.dummyjson.com/product-images/groceries/protein-powder/3.webp', 4);

-- 7. Organic Honey Jar
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000007', 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000007', 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000007', 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000007', 'https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/1.webp', 4);

-- 8. Fresh Fruit Juice Pack
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000008', 'https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000008', 'https://cdn.dummyjson.com/product-images/groceries/juice/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000008', 'https://cdn.dummyjson.com/product-images/groceries/juice/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000008', 'https://cdn.dummyjson.com/product-images/groceries/juice/3.webp', 4);

-- Clothing (9-12)
-- 9. Gigabyte Aorus Men T-Shirt
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000009', 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000009', 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000009', 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000009', 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/3.webp', 4);

-- 10. Nike Air Jordan 1
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000010', 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000010', 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000010', 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000010', 'https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp', 4);

-- 11. Man Plaid Casual Shirt
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000011', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000011', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000011', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000011', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/3.webp', 4);

-- 12. Man Short Sleeve Shirt
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000012', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000012', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000012', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000012', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/3.webp', 4);

-- Home & Kitchen (13-16)
-- 13. Black Aluminium Cup
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000013', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000013', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000013', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000013', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/glass/1.webp', 4);

-- 14. Carbon Steel Wok Pan
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000014', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000014', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000014', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/pan/1.webp', 3),
  ('a1000000-0000-0000-0000-000000000014', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/1.webp', 4);

-- 15. Modern Table Lamp
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000015', 'https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000015', 'https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000015', 'https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000015', 'https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/3.webp', 4);

-- 16. Wooden Chopping Board
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000016', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000016', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000016', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000016', 'https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/3.webp', 4);

-- Sports & Outdoors (17-20)
-- 17. Professional Cricket Bat
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000017', 'https://cdn.dummyjson.com/product-images/sports-accessories/cricket-bat/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000017', 'https://cdn.dummyjson.com/product-images/sports-accessories/cricket-bat/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000017', 'https://cdn.dummyjson.com/product-images/sports-accessories/cricket-bat/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000017', 'https://cdn.dummyjson.com/product-images/sports-accessories/football/1.webp', 4);

-- 18. Metal Baseball Bat
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000018', 'https://cdn.dummyjson.com/product-images/sports-accessories/metal-baseball-bat/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000018', 'https://cdn.dummyjson.com/product-images/sports-accessories/metal-baseball-bat/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000018', 'https://cdn.dummyjson.com/product-images/sports-accessories/metal-baseball-bat/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000018', 'https://cdn.dummyjson.com/product-images/sports-accessories/cricket-bat/1.webp', 4);

-- 19. Tennis Ball Pack
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000019', 'https://cdn.dummyjson.com/product-images/sports-accessories/tennis-ball/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000019', 'https://cdn.dummyjson.com/product-images/sports-accessories/tennis-ball/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000019', 'https://cdn.dummyjson.com/product-images/sports-accessories/tennis-ball/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000019', 'https://cdn.dummyjson.com/product-images/sports-accessories/football/thumbnail.webp', 4);

-- 20. Classic Football
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000020', 'https://cdn.dummyjson.com/product-images/sports-accessories/football/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000020', 'https://cdn.dummyjson.com/product-images/sports-accessories/football/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000020', 'https://cdn.dummyjson.com/product-images/sports-accessories/football/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000020', 'https://cdn.dummyjson.com/product-images/sports-accessories/tennis-ball/1.webp', 4);

-- Toys & Games (21-24)
-- 21. Wooden Decoration Swing
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000021', 'https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000021', 'https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000021', 'https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000021', 'https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/3.webp', 4);

-- 22. Classic 300 Touring Car Model
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000022', 'https://cdn.dummyjson.com/product-images/vehicle/300-touring/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000022', 'https://cdn.dummyjson.com/product-images/vehicle/300-touring/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000022', 'https://cdn.dummyjson.com/product-images/vehicle/300-touring/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000022', 'https://cdn.dummyjson.com/product-images/vehicle/300-touring/3.webp', 4);

-- 23. Family Tree Photo Frame
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000023', 'https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000023', 'https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000023', 'https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000023', 'https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/3.webp', 4);

-- 24. House Showpiece Plant
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000024', 'https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp', 1),
  ('a1000000-0000-0000-0000-000000000024', 'https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/1.webp', 2),
  ('a1000000-0000-0000-0000-000000000024', 'https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/2.webp', 3),
  ('a1000000-0000-0000-0000-000000000024', 'https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/3.webp', 4);
