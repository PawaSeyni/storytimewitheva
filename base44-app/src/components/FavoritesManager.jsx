import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Favorites Manager Hook
 * Manages favorites in localStorage with sync across tabs
 */
export function useFavorites(type = 'activity') {
  const storageKey = `eva_favorites_${type}`;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setFavorites([]);
      }
    }

    // Listen for storage changes (sync across tabs)
    const handleStorageChange = (e) => {
      if (e.key === storageKey) {
        try {
          setFavorites(e.newValue ? JSON.parse(e.newValue) : []);
        } catch (error) {
          console.error('Failed to sync favorites:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      
      // Show toast notification
      if (window.showToast) {
        const message = newFavorites.includes(itemId)
          ? "Added to favorites ❤️"
          : "Removed from favorites";
        window.showToast(message, 'success');
      }
      
      return newFavorites;
    });
  };

  const isFavorite = (itemId) => favorites.includes(itemId);

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem(storageKey);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length
  };
}

/**
 * Favorite Button Component
 */
export function FavoriteButton({ 
  itemId, 
  isFavorite, 
  onToggle, 
  size = "md",
  className = "" 
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    onToggle(itemId);
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full hover:bg-red-50 transition-all group ${className} ${
        isAnimating ? 'animate-bounce' : ''
      }`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${iconSizes[size]} transition-all ${
          isFavorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 group-hover:text-red-400 group-hover:scale-110'
        }`}
      />
    </Button>
  );
}