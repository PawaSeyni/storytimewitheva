/**
 * Performance Optimization Utilities
 * Implements lazy loading, caching, and performance monitoring
 */
import React from "react";

// ==========================================
// 1. CACHING LAYER
// ==========================================

/**
 * Simple in-memory cache with TTL
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }
  
  set(key, value, ttl = 300000) { // 5 min default
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
  }
  
  get(key) {
    if (!this.cache.has(key)) return null;
    
    const expiry = this.timestamps.get(key);
    if (Date.now() > expiry) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }
  
  has(key) {
    return this.get(key) !== null;
  }
  
  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }
  
  size() {
    return this.cache.size;
  }
}

export const cache = new CacheManager();

/**
 * Cached entity fetch wrapper
 */
export const cachedFetch = async (entity, method, ...args) => {
  const cacheKey = `${entity.name}_${method}_${JSON.stringify(args)}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[Cache Hit] ${cacheKey}`);
    return cached;
  }
  
  // Fetch and cache
  console.log(`[Cache Miss] ${cacheKey}`);
  const result = await entity[method](...args);
  cache.set(cacheKey, result, 300000); // 5 min TTL
  
  return result;
};

// ==========================================
// 2. PERFORMANCE MONITORING
// ==========================================

/**
 * Performance metrics tracker
 */
export class PerformanceTracker {
  constructor() {
    this.metrics = {};
    this.marks = {};
  }
  
  mark(name) {
    this.marks[name] = performance.now();
  }
  
  measure(name, startMark) {
    if (!this.marks[startMark]) {
      console.warn(`Start mark "${startMark}" not found`);
      return;
    }
    
    const duration = performance.now() - this.marks[startMark];
    this.metrics[name] = duration;
    
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  getMetrics() {
    return { ...this.metrics };
  }
}

export const perfTracker = new PerformanceTracker();

// ==========================================
// 3. DEBOUNCE & THROTTLE
// ==========================================

/**
 * Debounce function calls
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function calls
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ==========================================
// 4. BATCH ENTITY REQUESTS
// ==========================================

/**
 * Batch multiple entity requests
 */
export const batchEntityRequests = async (requests) => {
  perfTracker.mark('batch_start');
  
  const results = await Promise.all(
    requests.map(async ({ entity, method, args, cacheKey }) => {
      if (cacheKey && cache.has(cacheKey)) {
        return { cacheKey, data: cache.get(cacheKey), cached: true };
      }
      
      const data = await entity[method](...(args || []));
      
      if (cacheKey) {
        cache.set(cacheKey, data);
      }
      
      return { cacheKey, data, cached: false };
    })
  );
  
  perfTracker.measure('batch_requests', 'batch_start');
  
  return results;
};

// ==========================================
// 5. PREFETCH UTILITIES
// ==========================================

/**
 * Prefetch on hover hook
 */
export const usePrefetchOnHover = (prefetchFn) => {
  const [isPrefetched, setIsPrefetched] = React.useState(false);
  
  const handleHover = React.useCallback(() => {
    if (!isPrefetched) {
      prefetchFn();
      setIsPrefetched(true);
    }
  }, [isPrefetched, prefetchFn]);
  
  return {
    onMouseEnter: handleHover,
    onFocus: handleHover
  };
};

// ==========================================
// 6. COMPONENT SKELETON LOADER
// ==========================================

export const ComponentSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-32 bg-gray-200 rounded"></div>
  </div>
);

// ==========================================
// 7. OPTIMIZED IMAGE COMPONENT
// ==========================================

/**
 * Optimized image component with lazy loading
 */
export const OptimizedImage = ({ 
  src, 
  alt, 
  className = "",
  loading = "lazy",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};

export default {
  cache,
  cachedFetch,
  perfTracker,
  debounce,
  throttle,
  batchEntityRequests,
  usePrefetchOnHover,
  OptimizedImage,
  ComponentSkeleton
};