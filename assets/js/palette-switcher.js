/**
 * Palette Switcher
 * Allows users to switch color palettes without editing files
 */

(function() {
  'use strict';

  const PALETTES = {
    blue: {
      name: '🔵 Синий (Профессиональный)',
      colors: {
        '--color-primary': '#4a90e2',
        '--color-primary-dark': '#357abd',
        '--color-secondary': '#7fb3d5',
        '--color-secondary-dark': '#5a9bc4',
        '--color-accent': '#a8d5e2',
        '--color-text': '#2c3e50',
        '--color-text-light': '#7f8c8d',
        '--color-bg': '#f8fcff',
        '--color-bg-light': '#ecf6fd',
        '--color-border': '#d6e9f5',
        '--color-error': '#e74c3c',
        '--color-success': '#27ae60'
      }
    },
    warm: {
      name: '🟤 Тёплый (Уютный)',
      colors: {
        '--color-primary': '#d4a574',
        '--color-primary-dark': '#b8885a',
        '--color-secondary': '#8b9d83',
        '--color-secondary-dark': '#6d7d67',
        '--color-accent': '#e8b4a0',
        '--color-text': '#3d3229',
        '--color-text-light': '#7a6e65',
        '--color-bg': '#faf8f6',
        '--color-bg-light': '#f5f1ed',
        '--color-border': '#e8dfd6',
        '--color-error': '#d08770',
        '--color-success': '#8b9d83'
      }
    },
    green: {
      name: '🟢 Зелёный (Природный)',
      colors: {
        '--color-primary': '#6ba368',
        '--color-primary-dark': '#4d8b4a',
        '--color-secondary': '#8fbc8f',
        '--color-secondary-dark': '#6fa56f',
        '--color-accent': '#b8d4b8',
        '--color-text': '#2d3c2d',
        '--color-text-light': '#6b7c6b',
        '--color-bg': '#f7fbf7',
        '--color-bg-light': '#eff5ef',
        '--color-border': '#d9e8d9',
        '--color-error': '#d08770',
        '--color-success': '#6ba368'
      }
    },
    purple: {
      name: '🟣 Фиолетовый (Медитация)',
      colors: {
        '--color-primary': '#9b7eb5',
        '--color-primary-dark': '#7d6394',
        '--color-secondary': '#b8a4c9',
        '--color-secondary-dark': '#9b88ad',
        '--color-accent': '#d4c5de',
        '--color-text': '#3d3142',
        '--color-text-light': '#756a7f',
        '--color-bg': '#fbf9fc',
        '--color-bg-light': '#f3eff6',
        '--color-border': '#e5dcea',
        '--color-error': '#d08770',
        '--color-success': '#8b9d83'
      }
    },
    neutral: {
      name: '⚫ Нейтральный (Минимализм)',
      colors: {
        '--color-primary': '#5d6d7e',
        '--color-primary-dark': '#4a5866',
        '--color-secondary': '#85929e',
        '--color-secondary-dark': '#6b7a87',
        '--color-accent': '#aeb6bf',
        '--color-text': '#2c3e50',
        '--color-text-light': '#7f8c8d',
        '--color-bg': '#ffffff',
        '--color-bg-light': '#f4f6f7',
        '--color-border': '#d5d8dc',
        '--color-error': '#e74c3c',
        '--color-success': '#27ae60'
      }
    }
  };

  const STORAGE_KEY = 'preferred-palette';
  const DEFAULT_PALETTE = 'blue';

  /**
   * Apply a palette to the page
   */
  function applyPalette(paletteName) {
    const palette = PALETTES[paletteName];
    if (!palette) {
      console.error('Unknown palette:', paletteName);
      return;
    }

    const root = document.documentElement;
    Object.keys(palette.colors).forEach(cssVar => {
      root.style.setProperty(cssVar, palette.colors[cssVar]);
    });

    // Save preference
    localStorage.setItem(STORAGE_KEY, paletteName);

    // Update dropdown if it exists
    const selector = document.getElementById('palette-selector');
    if (selector) {
      selector.value = paletteName;
    }

    // Dispatch custom event for analytics
    if (window.trackEvent) {
      window.trackEvent('palette_change', { palette: paletteName });
    }
  }

  /**
   * Get saved palette preference
   */
  function getSavedPalette() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_PALETTE;
  }

  /**
   * Initialize palette selector dropdown
   */
  function initSelector() {
    const selector = document.getElementById('palette-selector');
    if (!selector) return;

    // Populate dropdown
    Object.keys(PALETTES).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = PALETTES[key].name;
      selector.appendChild(option);
    });

    // Set current palette
    const currentPalette = getSavedPalette();
    selector.value = currentPalette;

    // Listen for changes
    selector.addEventListener('change', function() {
      applyPalette(this.value);
    });
  }

  /**
   * Initialize on page load
   */
  function init() {
    // Apply saved palette immediately
    const savedPalette = getSavedPalette();
    applyPalette(savedPalette);

    // Initialize selector when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSelector);
    } else {
      initSelector();
    }
  }

  // Run initialization
  init();

  // Expose for debugging
  window.paletteSwitcher = {
    apply: applyPalette,
    getCurrent: getSavedPalette,
    available: Object.keys(PALETTES)
  };
})();
