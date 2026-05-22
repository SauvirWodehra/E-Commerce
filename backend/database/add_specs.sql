-- Add specifications for all 24 products

-- Electronics
UPDATE products SET specifications = '{"Brand":"Apple","Model":"AirPods Max","Color":"Silver","Connectivity":"Bluetooth 5.0","Battery Life":"20 hours","Noise Cancellation":"Active","Weight":"384.8g","Driver Size":"40mm"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000001';

UPDATE products SET specifications = '{"Brand":"Apple","Model":"Watch Series 4","Color":"Gold","Display":"OLED Retina","Case Size":"44mm","Water Resistance":"50m","GPS":"Yes","Sensors":"Heart Rate, ECG, Accelerometer"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000002';

UPDATE products SET specifications = '{"Brand":"Amazon","Model":"Echo Plus 2nd Gen","Color":"Charcoal","Speaker":"3-inch Neodymium","Connectivity":"WiFi, Bluetooth","Voice Assistant":"Alexa","Smart Hub":"Zigbee Built-in","Weight":"780g"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000003';

UPDATE products SET specifications = '{"Brand":"Apple","Connector":"USB-C to Lightning","Length":"1 meter","Fast Charging":"Yes (up to 20W)","Compatibility":"iPhone, iPad","Material":"Braided Nylon","Color":"White","MFi Certified":"Yes"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000004';

-- Food
UPDATE products SET specifications = '{"Brand":"Nescafe","Type":"Instant Coffee","Weight":"200g","Roast Level":"Medium","Origin":"100% Pure Coffee Beans","Shelf Life":"18 months","Packaging":"Glass Jar","Caffeine":"Yes"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000005';

UPDATE products SET specifications = '{"Brand":"Generic","Type":"Whey Protein Isolate","Weight":"1 kg","Protein per Serving":"24g","Flavor":"Vanilla","Sugar":"Low (2g)","Servings":"33","BCAAs":"5.5g per serving"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000006';

UPDATE products SET specifications = '{"Type":"Raw Organic Honey","Weight":"500g","Origin":"Natural Beehives","Processing":"Unfiltered, Unprocessed","Packaging":"Glass Jar","Shelf Life":"24 months","Certifications":"Organic","Additives":"None"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000007';

UPDATE products SET specifications = '{"Type":"Fruit Juice Variety Pack","Quantity":"6 x 200ml","Flavors":"Orange, Apple, Mixed Fruit","Sugar":"No Added Sugar","Preservatives":"None","Shelf Life":"6 months","Packaging":"Tetra Pak","Suitable For":"All Ages"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000008';

-- Clothing
UPDATE products SET specifications = '{"Brand":"Gigabyte Aorus","Material":"Cotton Blend","Fit":"Regular","Sleeve":"Short Sleeve","Neck":"Crew Neck","Care":"Machine Washable","Print":"Aorus Logo","Available Sizes":"S, M, L, XL, XXL"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000009';

UPDATE products SET specifications = '{"Brand":"Nike","Model":"Air Jordan 1 Retro High OG","Color":"Red and Black","Upper Material":"Premium Leather","Sole":"Rubber","Cushioning":"Air-Sole Unit","Closure":"Lace-up","Available Sizes":"UK 6-12"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000010';

UPDATE products SET specifications = '{"Material":"100% Cotton","Pattern":"Plaid Check","Fit":"Regular","Sleeve":"Long Sleeve","Collar":"Button-Down","Care":"Machine Washable","Closure":"Button Front","Available Sizes":"S, M, L, XL"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000011';

UPDATE products SET specifications = '{"Material":"Cotton-Polyester Blend","Fit":"Regular","Sleeve":"Short Sleeve","Collar":"Spread","Care":"Machine Washable","Closure":"Button Front","Pattern":"Solid","Available Sizes":"S, M, L, XL, XXL"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000012';

-- Home & Kitchen
UPDATE products SET specifications = '{"Material":"Aluminium","Color":"Matte Black","Capacity":"350ml","Weight":"120g","Dishwasher Safe":"Yes","BPA Free":"Yes","Insulation":"Single Wall","Use":"Hot and Cold Beverages"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000013';

UPDATE products SET specifications = '{"Material":"Carbon Steel","Diameter":"14 inches","Compatibility":"Gas, Induction, Electric","Handle":"Wooden Stay-Cool","Weight":"1.2 kg","Seasoning":"Pre-seasoned","Bottom":"Flat","Care":"Hand Wash Recommended"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000014';

UPDATE products SET specifications = '{"Type":"LED Table Lamp","Light Color":"Warm White","Brightness":"Adjustable (3 levels)","Control":"Touch Sensor","Power":"USB Powered","Material":"Metal and Fabric","Height":"40 cm","Bulb":"Built-in LED"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000015';

UPDATE products SET specifications = '{"Material":"Natural Hardwood","Dimensions":"38 x 28 cm","Thickness":"1.8 cm","Features":"Juice Grooves, Non-slip","Care":"Hand Wash, Oil Regularly","Food Safe":"Yes","Weight":"850g","Includes":"1 Board"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000016';

-- Sports & Outdoors
UPDATE products SET specifications = '{"Material":"English Willow","Weight":"1.1 - 1.3 kg","Size":"Full Size (SH)","Handle":"Round Cane","Edge":"Thick, Rounded","Grip":"Rubber","Sweet Spot":"Mid-Low","Ideal For":"Club and Tournament"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000017';

UPDATE products SET specifications = '{"Material":"Aluminium Alloy","Length":"34 inches","Weight":"850g","Grip":"Non-slip Rubber","Barrel Diameter":"2.625 inches","Drop Weight":"-3","Certification":"BBCOR","Ideal For":"Practice and Games"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000018';

UPDATE products SET specifications = '{"Type":"Pressurized Tennis Balls","Quantity":"Pack of 3","Certification":"ITF Approved","Cover":"Durable Felt","Core":"Pressurized Rubber","Bounce":"Consistent","Surface":"All Courts","Ideal For":"Practice and Match"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000019';

UPDATE products SET specifications = '{"Size":"5 (Official)","Material":"PU Leather","Panels":"Hand-stitched","Bladder":"Latex","Weight":"410-450g","Circumference":"68-70 cm","Surface":"All Surfaces","Ideal For":"Training and Match"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000020';

-- Toys & Games
UPDATE products SET specifications = '{"Material":"Natural Wood","Style":"Vintage Handcrafted","Dimensions":"30 x 20 x 15 cm","Weight":"400g","Finish":"Natural Wood Polish","Indoor/Outdoor":"Both","Age Group":"All Ages","Assembly":"No Assembly Required"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000021';

UPDATE products SET specifications = '{"Scale":"1:18","Material":"Die-cast Metal","Doors":"Opening","Hood":"Opening","Tires":"Rubber","Paint":"Premium Metallic","Display Stand":"Included","Age Group":"14+"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000022';

UPDATE products SET specifications = '{"Material":"Metal","Finish":"Antique Bronze","Photos":"Holds 6 Photos","Photo Size":"4 x 6 inches","Dimensions":"45 x 40 cm","Weight":"650g","Mounting":"Table Stand","Gift Box":"Yes"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000023';

UPDATE products SET specifications = '{"Type":"Artificial Plant","Pot Material":"Ceramic","Plant Height":"25 cm","Total Height":"35 cm","Maintenance":"None Required","Indoor/Outdoor":"Indoor","Realistic":"Lifelike Green Leaves","Weight":"450g"}'::jsonb WHERE id='a1000000-0000-0000-0000-000000000024';
