/**
 * CategoryFilter Component
 * 
 * Displays a horizontal list of category filter buttons.
 * Allows filtering products by selecting a specific category.
 * Includes an "All" option to reset the filter.
 */

import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="category-filter" role="navigation" aria-label="Product categories">
      <div className="category-filter__container">
        <div className="category-filter__title">Shop by Category</div>
        <div className="category-filter__list" role="tablist">
          {/* "All" button to show all products */}
          <button
            className={`category-filter__btn ${!selectedCategory ? 'category-filter__btn--active' : ''}`}
            onClick={() => onCategorySelect(null)}
            role="tab"
            aria-selected={!selectedCategory}
            id="category-all"
          >
            All
          </button>

          {/* Render a button for each category */}
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-filter__btn ${selectedCategory === category.id ? 'category-filter__btn--active' : ''}`}
              onClick={() => onCategorySelect(category.id)}
              role="tab"
              aria-selected={selectedCategory === category.id}
              id={`category-${category.id}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
