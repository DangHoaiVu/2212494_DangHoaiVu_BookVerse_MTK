/**
 * Theme Toggle Module - Dark Mode Implementation
 * Vanilla JS module for theme switching with glassmorphism effects
 */

class ThemeToggle {
    constructor() {
        this.themeButton = null;
        this.currentTheme = 'light';
        this.storageKey = 'theme';
        this.init();
    }

    /**
     * Initialize theme toggle functionality
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupThemeToggle());
        } else {
            this.setupThemeToggle();
        }
    }

    /**
     * Setup theme toggle button and functionality
     */
    setupThemeToggle() {
        // Create theme toggle button
        this.createThemeButton();
        
        // Apply initial theme
        this.applyInitialTheme();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Theme toggle initialized successfully');
    }

    /**
     * Create theme toggle button HTML
     */
    createThemeButton() {
        // Find the existing theme toggle button
        const existingButton = document.getElementById('btn-theme-toggle');
        if (existingButton) {
            this.themeButton = existingButton;
            console.log('Using existing theme toggle button');
            return;
        }

        // If no existing button, find the add book button container
        const addBookBtn = document.getElementById('addBookBtn');
        if (!addBookBtn) {
            console.error('Add book button not found');
            return;
        }

        // Create theme toggle button
        const themeButton = document.createElement('button');
        themeButton.id = 'btn-theme-toggle';
        themeButton.className = 'btn btn-secondary glass-btn';
        themeButton.setAttribute('aria-pressed', 'false');
        themeButton.setAttribute('aria-label', 'Chuyển đổi chế độ sáng/tối');
        themeButton.setAttribute('title', 'Chuyển đổi chế độ sáng/tối (Ctrl+D)');
        
        // Add icon span
        const iconSpan = document.createElement('span');
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.textContent = '🌙';
        themeButton.appendChild(iconSpan);

        // Insert after add book button
        addBookBtn.parentNode.insertBefore(themeButton, addBookBtn.nextSibling);
        
        this.themeButton = themeButton;
        console.log('Created new theme toggle button');
    }

    /**
     * Apply initial theme based on localStorage or system preference
     */
    applyInitialTheme() {
        const storedTheme = localStorage.getItem(this.storageKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (storedTheme) {
            this.currentTheme = storedTheme;
        } else if (systemPrefersDark) {
            this.currentTheme = 'dark';
        } else {
            this.currentTheme = 'light';
        }

        this.applyTheme(this.currentTheme);
    }

    /**
     * Apply theme to document
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    applyTheme(theme) {
        // Update document attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update localStorage
        localStorage.setItem(this.storageKey, theme);
        
        // Update button state
        this.updateButtonState(theme);
        
        // Update current theme
        this.currentTheme = theme;
        
        console.log(`Theme applied: ${theme}`);
    }

    /**
     * Update button visual state
     * @param {string} theme - Current theme
     */
    updateButtonState(theme) {
        if (!this.themeButton) return;

        const iconSpan = this.themeButton.querySelector('span');
        const isDark = theme === 'dark';
        
        // Update icon
        if (iconSpan) {
            iconSpan.textContent = isDark ? '☀️' : '🌙';
        }
        
        // Update aria-pressed
        this.themeButton.setAttribute('aria-pressed', isDark.toString());
        
        // Update aria-label
        this.themeButton.setAttribute('aria-label', 
            isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'
        );
        
        // Update title
        this.themeButton.setAttribute('title', 
            isDark ? 'Chuyển sang chế độ sáng (Ctrl+D)' : 'Chuyển sang chế độ tối (Ctrl+D)'
        );
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add ripple effect
        this.addRippleEffect();
    }

    /**
     * Add ripple effect to button
     */
    addRippleEffect() {
        if (!this.themeButton) return;

        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        // Add to button
        this.themeButton.appendChild(ripple);
        
        // Remove after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.themeButton) return;

        // Click event
        this.themeButton.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard events
        this.themeButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // Global keyboard shortcut (Ctrl+D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only apply system preference if no user preference is stored
            if (!localStorage.getItem(this.storageKey)) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
            }
        });
    }

    /**
     * Get current theme
     * @returns {string} Current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Set theme programmatically
     * @param {string} theme - Theme to set
     */
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }
}

/**
 * Initialize theme toggle functionality
 * @returns {ThemeToggle} Theme toggle instance
 */
export function initThemeToggle() {
    return new ThemeToggle();
}

// Auto-initialize if imported directly
if (typeof window !== 'undefined') {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        initThemeToggle();
    }, 100);
}
