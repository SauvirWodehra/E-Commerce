/**
 * Wishlist Page
 * 
 * Displays all wishlisted products in a grid.
 * Click on any product to go to its Product Detail page.
 * Heart button to remove from wishlist.
 * Add to Cart button on each card.
 */

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './Wishlist.css';

const formatCurrency = (amount) =>
  `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Wishlist = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { wishlistItems, loadWishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: '/wishlist' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlistItems();
    }
  }, [isAuthenticated, loadWishlistItems]);

  if (authLoading || !isAuthenticated) {
    return <div className="wishlist-page"><Navbar /><div className="wishlist__container"><p>Loading...</p></div></div>;
  }

  return (
    <div className="wishlist-page">
      <Navbar />
      <div className="wishlist__container">
        <h1 className="wishlist__title">
          Your Wishlist ({wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''})
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="wishlist__empty">
            <svg className="wishlist__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist and revisit them anytime.</p>
            <Link to="/">Start Shopping</Link>
          </div>
        ) : (
          <div className="wishlist__grid">
            {wishlistItems.map((product) => (
              <div key={product.id} className="wishlist__card">
                {/* Remove from wishlist */}
                <button
                  className="wishlist__remove-btn"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                  title="Remove from wishlist"
                >
                  ♥
                </button>

                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src={product.primary_image_url}
                    alt={product.name}
                    className="wishlist__card-img"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/240x200/f5f5f5/999?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join(' '))}`; }}
                  />
                  <div className="wishlist__card-name">{product.name}</div>
                  <div className="wishlist__card-price">{formatCurrency(product.price)}</div>
                  <div className={`wishlist__card-stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock_quantity > 0 ? 'In Stock' : 'Currently Unavailable'}
                  </div>
                </Link>

                <div className="wishlist__card-actions">
                  <button
                    className="wishlist__card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    disabled={product.stock_quantity <= 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
