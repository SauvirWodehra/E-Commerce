/**
 * ProductGrid Component
 * 
 * Renders a responsive grid of ProductCard components.
 * Handles loading (skeleton), empty, and error states gracefully.
 */

import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

/**
 * Renders loading skeleton cards while data is being fetched.
 * 
 * @param {number} count - Number of skeleton cards to render.
 */
const LoadingSkeleton = ({ count = 8 }) => (
  <div className="product-grid__loading">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="product-grid__skeleton">
        <div className="product-grid__skeleton-image skeleton" />
        <div className="product-grid__skeleton-text skeleton" />
        <div className="product-grid__skeleton-text skeleton product-grid__skeleton-text--short" />
        <div className="product-grid__skeleton-text skeleton product-grid__skeleton-text--price" />
        <div className="product-grid__skeleton-btn skeleton" />
      </div>
    ))}
  </div>
);

/**
 * Renders when no products match the current search/filter criteria.
 */
const EmptyState = ({ searchQuery }) => (
  <div className="product-grid__empty">
    <svg className="product-grid__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M8 11h6" />
    </svg>
    <h3 className="product-grid__empty-title">No products found</h3>
    <p className="product-grid__empty-text">
      {searchQuery
        ? `No results for "${searchQuery}". Try a different search term.`
        : 'No products available in this category.'}
    </p>
  </div>
);

/**
 * Renders when there is an error fetching products.
 */
const ErrorState = ({ error }) => (
  <div className="product-grid__error">
    <h3 className="product-grid__error-title">Something went wrong</h3>
    <p className="product-grid__error-text">{error}</p>
  </div>
);

const ProductGrid = ({ products, loading, error, searchQuery }) => {
  // Loading state — show skeleton cards
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Empty state — no products match criteria
  if (!products || products.length === 0) {
    return <EmptyState searchQuery={searchQuery} />;
  }

  return (
    <>
      {/* Results header */}
      <div className="product-grid__header">
        <p className="product-grid__results-text">
          Showing <span className="product-grid__results-count">{products.length}</span> results
          {searchQuery && (
            <> for "<span className="product-grid__results-query">{searchQuery}</span>"</>
          )}
        </p>
      </div>

      {/* Product grid */}
      <div className="product-grid__container" role="list" aria-label="Products">
        {products.map((product) => (
          <div key={product.id} role="listitem">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductGrid;
