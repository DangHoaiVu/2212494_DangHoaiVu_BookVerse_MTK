import './styles/style.css';
import { Controller } from './patterns/mvc/controller.js';
import eventBus, { EVENTS } from './patterns/observer/eventBus.js';
import { ThemeManager } from './utils/themeManager.js';
import { SkeletonLoader } from './components/SkeletonLoader.js';
import { initThemeToggle } from './utils/theme.js';

class BookVerseApp {
    constructor() {
        this.controller = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            this.showLoadingState();
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            console.error('Failed to initialize BookVerse app:', error);
            this.showErrorState('Không thể khởi tạo ứng dụng. Vui lòng tải lại trang.');
        }
    }

    async initializeApp() {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            this.themeManager = new ThemeManager();
            this.controller = new Controller();
            this.setupGlobalErrorHandling();
            this.setupKeyboardShortcuts();
            this.setupAccessibility();
            
            // Initialize new theme toggle
            initThemeToggle();
            
            this.isInitialized = true;
            this.hideLoadingState();
            this.showWelcomeMessage();
        } catch (error) {
            console.error('Error initializing application:', error);
            this.showErrorState('Lỗi khởi tạo ứng dụng: ' + error.message);
        }
    }

    showLoadingState() {
        const appContainer = document.querySelector('.app-container');
        if (appContainer) appContainer.style.display = 'none';
        
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'app-loading';
        loadingOverlay.innerHTML = `
            <div class="loading-container glass">
                <div class="loading-spinner"></div>
                <h2>📚 BookVerse</h2>
                <p>Đang khởi tạo ứng dụng...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }

    hideLoadingState() {
        const loadingElement = document.querySelector('.app-loading');
        if (loadingElement) loadingElement.remove();
        
        const appContainer = document.querySelector('.app-container');
        if (appContainer) appContainer.style.display = 'block';
    }

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showErrorState(message) {
        const body = document.body;
        body.innerHTML = `
            <div class="app-error">
                <div class="error-container glass">
                    <div class="error-icon">⚠️</div>
                    <h2>Lỗi Khởi Tạo</h2>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Tải Lại Trang
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        // Only show welcome message if no books exist
        if (this.controller && this.controller.getState()) {
            const books = this.controller.getState().books;
            if (books && books.length === 0) {
                setTimeout(() => {
                    eventBus.emit(EVENTS.SUCCESS_MESSAGE, {
                        message: 'Chào mừng đến với BookVerse! Hãy thêm sách đầu tiên của bạn.'
                    });
                }, 1000);
            }
        }
    }

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            eventBus.emit(EVENTS.ERROR_OCCURRED, {
                message: 'Đã xảy ra lỗi không xác định',
                error: event.error
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            eventBus.emit(EVENTS.ERROR_OCCURRED, {
                message: 'Lỗi xử lý bất đồng bộ',
                error: event.reason
            });
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: Add new book
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                eventBus.emit(EVENTS.MODAL_OPEN, { mode: 'add' });
            }

            // Ctrl/Cmd + F: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                if (this.controller && this.controller.view) {
                    this.controller.view.focusSearch();
                }
            }

            // Escape: Close modal or clear search
            if (e.key === 'Escape') {
                if (this.controller && this.controller.view && this.controller.view.getSearchQuery()) {
                    this.controller.resetFilters();
                }
            }

            // Ctrl/Cmd + /: Show help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }

            // Ctrl/Cmd + D: Toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * Show keyboard shortcuts help
     */
    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl/Cmd + N', action: 'Thêm sách mới' },
            { key: 'Ctrl/Cmd + F', action: 'Tìm kiếm' },
            { key: 'Escape', action: 'Đóng modal / Xóa tìm kiếm' },
            { key: 'Ctrl/Cmd + /', action: 'Hiện phím tắt' },
            { key: 'Ctrl/Cmd + D', action: 'Chuyển đổi chế độ sáng/tối' }
        ];

        const shortcutsText = shortcuts.map(s => `${s.key}: ${s.action}`).join('\n');
        alert('Phím tắt:\n\n' + shortcutsText);
    }


    /**
     * Initialize theme manager (simplified)
     */
    initThemeManager() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Apply stored theme or system theme
        const storedTheme = localStorage.getItem('bookverse-theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentTheme = storedTheme || systemTheme;
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeToggleButton(currentTheme);
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('bookverse-theme', newTheme);
        this.updateThemeToggleButton(newTheme);
    }

    /**
     * Update theme toggle button
     */
    updateThemeToggleButton(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('span');
            if (icon) {
                icon.textContent = theme === 'light' ? '🌙' : '☀️';
            }
            themeToggle.setAttribute('aria-label', 
                theme === 'light' 
                    ? 'Chuyển sang chế độ tối' 
                    : 'Chuyển sang chế độ sáng'
            );
        }
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Announce page load to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = 'Trang BookVerse đã tải xong. Sử dụng Tab để điều hướng.';
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 3000);

        // Setup reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--animation-iteration-count', '1');
        }

        // Setup high contrast mode
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.documentElement.classList.add('high-contrast');
        }
    }


    /**
     * Get application state
     * @returns {Object} Application state
     */
    getState() {
        return this.controller ? this.controller.getState() : null;
    }

    /**
     * Check if app is initialized
     * @returns {boolean} Initialization status
     */
    isReady() {
        return this.isInitialized;
    }

    initThemeManager() {
        this.themeManager = new ThemeManager();
    }

    toggleTheme() {
        if (this.themeManager) {
            this.themeManager.toggleTheme();
        }
    }

    updateThemeToggleButton() {
        if (this.themeManager) {
            this.themeManager.updateThemeToggleButton();
        }
    }
}

// Initialize the application
const app = new BookVerseApp();
app.init();

// Export for debugging purposes
window.BookVerseApp = app;
