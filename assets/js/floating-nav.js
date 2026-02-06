/**
 * Floating Navigation Component
 * Handles expand/collapse, smooth scrolling, and analytics tracking
 */

(function () {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function () {
    initFloatingNav();
  });

  function initFloatingNav() {
    const nav = document.querySelector('.floating-nav');
    const toggle = document.querySelector('.floating-nav__toggle');
    const backdrop = document.querySelector('.floating-nav__backdrop');
    const menuItems = document.querySelectorAll('.floating-nav__item');

    if (!nav || !toggle) {
      console.warn('Floating nav elements not found');
      return;
    }

    // Toggle menu open/closed
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      toggleMenu();
    });

    // Close menu when backdrop is clicked (mobile)
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeMenu();
      });
    }

    // Handle menu item clicks
    menuItems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        // Don't prevent default - let browser handle anchor navigation
        // But close the menu after a small delay
        setTimeout(function () {
          closeMenu();
        }, 100);

        // Track analytics
        const target = this.getAttribute('data-target');
        const title = this.querySelector('.floating-nav__item-title')?.textContent;
        trackFloatingNavClick(target, title);
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('floating-nav--expanded')) {
        closeMenu();
        toggle.focus(); // Return focus to toggle button
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('floating-nav--expanded')) {
        if (!nav.contains(e.target)) {
          closeMenu();
        }
      }
    });

    // Handle keyboard navigation within menu
    menuItems.forEach(function (item, index) {
      item.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextItem = menuItems[index + 1] || menuItems[0];
          nextItem.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
          prevItem.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          menuItems[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          menuItems[menuItems.length - 1].focus();
        }
      });
    });

    console.log('Floating navigation initialized');
  }

  function toggleMenu() {
    const nav = document.querySelector('.floating-nav');
    const isExpanded = nav.classList.contains('floating-nav--expanded');

    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    const nav = document.querySelector('.floating-nav');
    const toggle = document.querySelector('.floating-nav__toggle');
    const menu = document.querySelector('.floating-nav__menu');
    const firstMenuItem = document.querySelector('.floating-nav__item');

    nav.classList.add('floating-nav--expanded');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрыть меню навигации');
    menu.setAttribute('aria-hidden', 'false');

    // Prevent body scroll on mobile when menu is open
    if (window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    }

    // Focus first menu item after animation
    setTimeout(function () {
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }, 100);

    // Track analytics
    trackFloatingNavToggle('open');
  }

  function closeMenu() {
    const nav = document.querySelector('.floating-nav');
    const toggle = document.querySelector('.floating-nav__toggle');
    const menu = document.querySelector('.floating-nav__menu');

    nav.classList.remove('floating-nav--expanded');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню навигации');
    menu.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Track floating nav toggle analytics
   * @param {string} action - 'open' or 'close'
   */
  function trackFloatingNavToggle(action) {
    const colorPalette = window.paletteSwitcher?.getCurrent() || 'unknown';

    // Get UTM parameters if available
    const utmParams = getStoredUTM();

    const eventData = {
      action: action,
      color_palette: colorPalette,
      ...utmParams
    };

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'floating_nav_toggle', eventData);
      console.log('GA4: floating_nav_toggle', action);
    }

    // Yandex.Metrika
    if (typeof ym !== 'undefined') {
      const ymID = window.YM_ID || '98819060'; // Fallback to known ID
      ym(ymID, 'reachGoal', 'floating_nav_' + action, eventData);
      console.log('YM: floating_nav_' + action);
    }
  }

  /**
   * Track floating nav link clicks
   * @param {string} target - Section ID (e.g., 'about', 'format')
   * @param {string} title - Link title
   */
  function trackFloatingNavClick(target, title) {
    const colorPalette = window.paletteSwitcher?.getCurrent() || 'unknown';
    const utmParams = getStoredUTM();

    const eventData = {
      target_section: target,
      link_title: title,
      color_palette: colorPalette,
      ...utmParams
    };

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'floating_nav_click', eventData);
      console.log('GA4: floating_nav_click', target);
    }

    // Yandex.Metrika
    if (typeof ym !== 'undefined') {
      const ymID = window.YM_ID || '98819060'; // Fallback to known ID
      ym(ymID, 'reachGoal', 'floating_nav_click_' + target, eventData);
      console.log('YM: floating_nav_click_' + target);
    }
  }

  /**
   * Get stored UTM parameters from sessionStorage
   */
  function getStoredUTM() {
    try {
      return JSON.parse(sessionStorage.getItem('utm_params') || '{}');
    } catch (e) {
      return {};
    }
  }
})();
