/**
 * Home Page Component
 * 
 * Main product listing page that composes:
 * - Navbar (with search)
 * - CategoryFilter (with category selection)
 * - ProductGrid (displaying filtered/searched products)
 * 
 * Manages application state for products, categories, search, and filters.
 * Implements debounced search to minimize unnecessary API calls.
 */

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { getProducts, getCategories } from '../../services/api';
import './Home.css';

/**
 * Custom debounce hook.
 * Delays value updates until after a specified wait time
 * has elapsed since the last change.
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const Home = () => {
  // ---------- State ----------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search input by 300ms to avoid excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // ---------- Fetch Categories (once on mount) ----------
  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (!cancelled) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err.message);
      }
    };

    fetchCategories();

    return () => { cancelled = true; };
  }, []);

  // ---------- Fetch Products (on search or category change) ----------
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const filters = {};
        if (debouncedSearch) filters.search = debouncedSearch;
        if (selectedCategory) filters.category = selectedCategory;

        const response = await getProducts(filters);

        if (!cancelled) {
          setProducts(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch products. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => { cancelled = true; };
  }, [debouncedSearch, selectedCategory]);

  // ---------- Handlers ----------

  /** Handles search input changes from the Navbar. */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  /** Handles category selection from the CategoryFilter. */
  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  // ---------- Render ----------
  return (
    <div className="home">
      <Navbar onSearch={handleSearch} />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <main>
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          searchQuery={debouncedSearch}
        />
      </main>
    </div>
  );
};

export default Home;
