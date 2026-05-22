/**
 * ImageCarousel Component
 * 
 * Amazon-style product image carousel with:
 * - Thumbnail strip on the left (click to select)
 * - Main image area with smooth slide transitions
 * - Auto-advance every 5 seconds
 * - Navigation arrows (left/right)
 * - Progress dots at the bottom
 * 
 * Implements auto-slideshow: each image slides to the next
 * automatically every 5 seconds. Timer resets on manual interaction.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import './ImageCarousel.css';

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

const ImageCarousel = ({ images = [], productName = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitIndex, setExitIndex] = useState(null);
  const timerRef = useRef(null);

  // Ensure we have at least one image
  const imageList = images.length > 0
    ? images.map((img) => img.image_url)
    : ['https://placehold.co/400x400/f5f5f5/999?text=No+Image'];

  /**
   * Starts the auto-slide timer.
   * Clears any existing timer before starting.
   */
  const startAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIdx = (prev + 1) % imageList.length;
        setExitIndex(prev);
        setTimeout(() => setExitIndex(null), 600);
        return nextIdx;
      });
    }, AUTO_SLIDE_INTERVAL);
  }, [imageList.length]);

  /**
   * Initialize auto-slide on mount and when image count changes.
   */
  useEffect(() => {
    if (imageList.length > 1) {
      startAutoSlide();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [imageList.length, startAutoSlide]);

  /**
   * Handles manual slide selection (thumbnail click, arrow, dot).
   * Resets the auto-slide timer on any manual interaction.
   */
  const goToSlide = useCallback((index) => {
    setExitIndex(activeIndex);
    setActiveIndex(index);
    setTimeout(() => setExitIndex(null), 600);
    // Reset auto-slide timer
    if (imageList.length > 1) {
      startAutoSlide();
    }
  }, [activeIndex, imageList.length, startAutoSlide]);

  const goToPrev = useCallback(() => {
    const prevIndex = (activeIndex - 1 + imageList.length) % imageList.length;
    goToSlide(prevIndex);
  }, [activeIndex, imageList.length, goToSlide]);

  const goToNext = useCallback(() => {
    const nextIndex = (activeIndex + 1) % imageList.length;
    goToSlide(nextIndex);
  }, [activeIndex, imageList.length, goToSlide]);

  return (
    <div className="carousel" id="product-carousel">
      {/* Thumbnail Strip */}
      <div className="carousel__thumbnails">
        {imageList.map((url, index) => (
          <button
            key={index}
            className={`carousel__thumb ${index === activeIndex ? 'carousel__thumb--active' : ''}`}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => goToSlide(index)}
            aria-label={`View image ${index + 1}`}
          >
            <img
              src={url}
              alt={`${productName} view ${index + 1}`}
              className="carousel__thumb-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/56x56/f5f5f5/999?text=...';
              }}
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="carousel__main">
        {/* Left Arrow */}
        {imageList.length > 1 && (
          <button className="carousel__arrow carousel__arrow--left" onClick={goToPrev} aria-label="Previous image">
            <svg className="carousel__arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Slide Container */}
        <div className="carousel__slide-container">
          {imageList.map((url, index) => (
            <div
              key={index}
              className={`carousel__slide ${
                index === activeIndex
                  ? 'carousel__slide--active'
                  : index === exitIndex
                  ? 'carousel__slide--exit'
                  : ''
              }`}
            >
              <img
                src={url}
                alt={`${productName} - Image ${index + 1}`}
                className="carousel__main-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/400x400/f5f5f5/999?text=${encodeURIComponent(productName)}`;
                }}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {imageList.length > 1 && (
          <button className="carousel__arrow carousel__arrow--right" onClick={goToNext} aria-label="Next image">
            <svg className="carousel__arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {/* Progress Dots */}
        {imageList.length > 1 && (
          <div className="carousel__dots">
            {imageList.map((_, index) => (
              <button
                key={index}
                className={`carousel__dot ${index === activeIndex ? 'carousel__dot--active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
