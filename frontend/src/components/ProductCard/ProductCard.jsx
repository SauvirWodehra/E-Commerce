/**
 * ProductCard Component
 * 
 * Displays a single product in a card format matching Amazon's design.
 * Shows product image, name, rating stars, price, stock status,
 * an "Add to Cart" button, and a wishlist heart icon.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

/**
 * Renders star icons based on the product rating.
 */
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.3;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="product-card__star" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <svg key={i} className="product-card__star product-card__star--half" viewBox="0 0 24 24">
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#e0e0e0" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-${i})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className="product-card__star product-card__star--empty" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
  }

  return stars;
};

const formatPrice = (price) => {
  const priceNum = parseFloat(price);
  const whole = Math.floor(priceNum).toLocaleString('en-IN');
  const fraction = (priceNum % 1).toFixed(2).slice(2);
  return { symbol: '₹', whole, fraction };
};

const ProductCard = ({ product }) => {
  const { symbol, whole, fraction } = formatPrice(product.price);
  const isInStock = product.stock_quantity > 0;
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const wishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/' } });
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      {/* Wishlist Heart */}
      <button
        className={`product-card__heart ${wishlisted ? 'product-card__heart--active' : ''}`}
        onClick={handleWishlistClick}
        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wishlisted ? '♥' : '♡'}
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="product-card__image-wrapper">
        <img
          src={product.primary_image_url}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x400/f5f5f5/999?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join(' '))}`;
          }}
        />
      </Link>

      {/* Product Information */}
      <div className="product-card__info">
        <span className="product-card__category">{product.category_name}</span>

        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.name}
        </Link>

        <div className="product-card__rating">
          <div className="product-card__stars">
            {renderStars(parseFloat(product.rating))}
          </div>
          <span className="product-card__review-count">
            {parseInt(product.review_count).toLocaleString()}
          </span>
        </div>

        <div className="product-card__price">
          <span className="product-card__price-symbol">{symbol}</span>
          <span className="product-card__price-whole">{whole}</span>
          <span className="product-card__price-fraction">{fraction}</span>
        </div>

        <span className={`product-card__stock ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
          {isInStock ? 'In stock' : 'Currently unavailable'}
        </span>
      </div>

      {/* Add to Cart */}
      <div className="product-card__actions">
        <button
          className="btn-add-to-cart"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
          disabled={!isInStock}
          aria-label={`Add ${product.name} to cart`}
          id={`add-to-cart-${product.id}`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
