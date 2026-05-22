/**
 * ProductDetail Page Component
 * 
 * Amazon-style product detail page with:
 * - Image Carousel (auto-sliding every 5s, thumbnails, arrows)
 * - Product Info (title, rating, description, specifications table)
 * - Buy Box (price, stock status, quantity selector, Add to Cart, Buy Now)
 * 
 * Fetches product data including images from the backend API.
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../services/api';
import './ProductDetail.css';

/**
 * Renders star rating as SVG stars (full, half, empty).
 */
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="product-detail__star" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <svg key={i} className="product-detail__star" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#f0c14b" />
              <stop offset="50%" stopColor="#ccc" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGrad)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className="product-detail__star product-detail__star--empty" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
  }

  return <div className="product-detail__stars">{stars}</div>;
};

/**
 * Formats a number as Indian Rupee currency.
 */
const formatPrice = (price) => {
  const num = parseFloat(price);
  const whole = Math.floor(num).toLocaleString('en-IN');
  const fraction = (num % 1).toFixed(2).substring(2);
  return { whole, fraction };
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product on mount
  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProductById(id);
        if (!cancelled) {
          setProduct(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load product.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  /**
   * Add to Cart — adds the product with selected quantity.
   */
  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  /**
   * Buy Now — adds to cart and navigates directly to checkout.
   */
  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  // Loading state
  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail__loading">
          <div className="product-detail__spinner" />
          Loading product details...
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail__error">
          <h2>{error || 'Product not found'}</h2>
          <Link to="/">← Back to Products</Link>
        </div>
      </div>
    );
  }

  const { whole, fraction } = formatPrice(product.price);
  const isInStock = product.stock_quantity > 0;
  const specs = product.specifications || {};

  return (
    <div className="product-detail-page">
      <Navbar />

      {/* Breadcrumb */}
      <nav className="product-detail__breadcrumb">
        <Link to="/">Home</Link>
        {' › '}
        <Link to="/">{product.category_name}</Link>
        {' › '}
        <span>{product.name}</span>
      </nav>

      <div className="product-detail__container">
        {/* LEFT: Image Carousel */}
        <ImageCarousel images={product.images} productName={product.name} />

        {/* CENTER: Product Info */}
        <div className="product-detail__info">
          <h1 className="product-detail__title" id="product-title">{product.name}</h1>

          {/* Rating */}
          <div className="product-detail__rating">
            <span className="product-detail__rating-text">{product.rating}</span>
            <StarRating rating={parseFloat(product.rating)} />
            <span className="product-detail__review-count">
              ({parseInt(product.review_count).toLocaleString('en-IN')} ratings)
            </span>
          </div>

          {/* Price */}
          <div className="product-detail__price-section">
            <span className="product-detail__price-label">M.R.P.</span>
            <span className="product-detail__price">
              <span className="product-detail__price-symbol">₹</span>
              <span className="product-detail__price-whole">{whole}</span>
              <span className="product-detail__price-fraction">.{fraction}</span>
            </span>
            <p className="product-detail__delivery">
              FREE delivery by <strong>Tomorrow</strong>
            </p>
          </div>

          {/* Description */}
          <div className="product-detail__description">
            <h3>About this item</h3>
            <p>{product.description}</p>
          </div>

          {/* Specifications */}
          {Object.keys(specs).length > 0 && (
            <div className="product-detail__specs">
              <h3>Technical Details</h3>
              <table className="product-detail__specs-table">
                <tbody>
                  {Object.entries(specs).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT: Buy Box */}
        <div className="product-detail__buy-box" id="buy-box">
          {/* Price */}
          <span className="product-detail__buy-price">
            <span className="product-detail__buy-price-symbol">₹</span>
            {whole}
            <span className="product-detail__price-fraction">.{fraction}</span>
          </span>

          <p className="product-detail__buy-delivery">
            FREE delivery <strong>Tomorrow</strong>
          </p>

          {/* Stock Status */}
          <span className={`product-detail__stock ${isInStock ? 'product-detail__stock--in' : 'product-detail__stock--out'}`}>
            {isInStock ? 'In Stock' : 'Currently Unavailable'}
          </span>

          {/* Quantity */}
          {isInStock && (
            <div className="product-detail__quantity">
              <label htmlFor="quantity-select">Quantity:</label>
              <select
                id="quantity-select"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {Array.from({ length: Math.min(product.stock_quantity, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          {/* Add to Cart */}
          <button
            className="product-detail__btn-cart"
            onClick={handleAddToCart}
            disabled={!isInStock}
            id="detail-add-to-cart"
          >
            Add to Cart
          </button>

          {/* Buy Now */}
          <button
            className="product-detail__btn-buy"
            onClick={handleBuyNow}
            disabled={!isInStock}
            id="detail-buy-now"
          >
            Buy Now
          </button>

          {/* Added confirmation */}
          {addedToCart && (
            <div className="product-detail__added">
              ✓ Added to Cart
            </div>
          )}

          {/* Seller info */}
          <div className="product-detail__seller">
            <div className="product-detail__seller-row">
              <span>Shipper / Seller</span>
              <span>Amazon Clone</span>
            </div>
            <div className="product-detail__seller-row">
              <span>Returns</span>
              <span>30-day refund</span>
            </div>
            <div className="product-detail__seller-row">
              <span>Payment</span>
              <span>Secure transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
