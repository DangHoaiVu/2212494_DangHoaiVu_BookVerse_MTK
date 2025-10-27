/**
 * View - MVC Pattern Implementation
 * Handles UI rendering and user interaction
 */
import { BookCard } from '../../components/BookCard.js';
import eventBus, { EVENTS } from '../observer/eventBus.js';

export class View {
    constructor() {
        this.elements = {};
        this.chart = null;
        this.searchTimeout = null;
        this.init();
    }

    /**
     * Initialize view elements and event listeners
     */
    init() {
        console.log('View: Initializing...');
        
        console.log('View: Caching elements...');
        this.cacheElements();
        console.log('View: Elements cached:', this.elements);
        
        console.log('View: Setting up event listeners...');
        this.setupEventListeners();
        console.log('View: Event listeners setup complete');
        
        console.log('View: Initializing chart...');
        // Initialize chart with delay to ensure DOM is ready
        setTimeout(async () => {
            await this.initializeChart();
            console.log('View: Chart initialization complete');
        }, 200);
        
        console.log('View: Initialization complete');
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            booksContainer: document.getElementById('booksContainer'),
            emptyState: document.getElementById('emptyState'),
            searchInput: document.getElementById('searchInput'),
            categoryFilter: document.getElementById('categoryFilter'),
            totalBooks: document.getElementById('totalBooks'),
            totalCategories: document.getElementById('totalCategories'),
            popularCategory: document.getElementById('popularCategory'),
            categoryChart: document.getElementById('categoryChart'),
            addBookBtn: document.getElementById('addBookBtn'),
            exportBtn: document.getElementById('exportBtn'),
            importInput: document.getElementById('importInput'),
            addFirstBookBtn: null // Will be set when empty state is shown
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input with debouncing
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    eventBus.emit(EVENTS.SEARCH_CHANGED, e.target.value);
                }, 300);
            });
        }

        // Category filter
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.addEventListener('change', (e) => {
                eventBus.emit(EVENTS.FILTER_CHANGED, e.target.value);
            });
        }

        // Add book button
        if (this.elements.addBookBtn) {
            this.elements.addBookBtn.addEventListener('click', () => {
                eventBus.emit(EVENTS.MODAL_OPEN, { mode: 'add' });
            });
        }

        // Export button
        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', () => {
                eventBus.emit('books:export');
            });
        }

        // Import input
        if (this.elements.importInput) {
            this.elements.importInput.addEventListener('change', async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                try {
                    const text = await file.text();
                    eventBus.emit('books:import', text);
                    e.target.value = '';
                } catch (err) {
                    this.showError('Không thể đọc file JSON');
                }
            });
        }

        // Event delegation for book actions
        if (this.elements.booksContainer) {
            this.elements.booksContainer.addEventListener('click', (e) => {
                this.handleBookAction(e);
            });
        }
    }

    /**
     * Handle book action clicks
     * @param {Event} e - Click event
     */
    handleBookAction(e) {
        const button = e.target.closest('.edit-btn, .delete-btn');
        if (!button) return;

        const bookId = parseInt(button.dataset.id);
        const action = button.classList.contains('edit-btn') ? 'edit' : 'delete';

        if (action === 'edit') {
            eventBus.emit(EVENTS.BOOK_SELECTED, { id: bookId, action: 'edit' });
        } else if (action === 'delete') {
            if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
                eventBus.emit(EVENTS.BOOK_SELECTED, { id: bookId, action: 'delete' });
            }
        }
    }

    /**
     * Render books grid
     * @param {Array} books - Array of book objects
     */
    renderBooks(books) {
        if (!this.elements.booksContainer) return;
        
        if (!books || books.length === 0) {
            this.renderEmptyState();
            return;
        }

        // Add fade-in animation
        this.elements.booksContainer.style.opacity = '0';
        this.elements.booksContainer.style.transform = 'translateY(20px)';
        
        this.elements.booksContainer.innerHTML = books.map(book => 
            BookCard.create(book)
        ).join('');

        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = 'none';
        }
        this.elements.booksContainer.style.display = 'grid';

        // Add hover effects to new cards
        this.addHoverEffects();

        // Animate in
        requestAnimationFrame(() => {
            this.elements.booksContainer.style.transition = 'all 0.3s ease';
            this.elements.booksContainer.style.opacity = '1';
            this.elements.booksContainer.style.transform = 'translateY(0)';
        });
    }

    /**
     * Render empty state
     */
    renderEmptyState() {
        if (!this.elements.booksContainer) return;
        
        this.elements.booksContainer.innerHTML = BookCard.createEmptyState();
        this.elements.booksContainer.style.display = 'flex';
        
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = 'none';
        }

        // Setup add first book button
        this.elements.addFirstBookBtn = document.getElementById('addFirstBookBtn');
        if (this.elements.addFirstBookBtn) {
            this.elements.addFirstBookBtn.addEventListener('click', () => {
                eventBus.emit(EVENTS.MODAL_OPEN, { mode: 'add' });
            });
        }
    }

    /**
     * Add hover effects to book cards
     */
    addHoverEffects() {
        const cards = this.elements.booksContainer.querySelectorAll('.book-card');
        cards.forEach(card => {
            BookCard.addHoverEffects(card);
        });
    }

    /**
     * Update statistics display
     * @param {Object} stats - Statistics object
     */
    renderStats(stats) {
        console.log('View: Rendering stats:', stats);
        
        if (this.elements.totalBooks) {
            this.animateNumber(this.elements.totalBooks, stats.totalBooks);
        }
        if (this.elements.totalCategories) {
            this.animateNumber(this.elements.totalCategories, stats.totalCategories);
        }
        if (this.elements.popularCategory) {
            this.elements.popularCategory.textContent = stats.popularCategory;
        }

        // Force update chart to ensure it displays
        console.log('View: Force updating chart with stats:', stats.categoryCount);
        this.forceUpdateChart(stats.categoryCount);
    }

    /**
     * Animate number change
     * @param {HTMLElement} element - Element to animate
     * @param {number} newValue - New value to display
     */
    animateNumber(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const difference = newValue - currentValue;
        
        if (difference === 0) return;

        // Add animation class
        element.style.transform = 'scale(1.1)';
        element.style.color = difference > 0 ? '#10B981' : '#EF4444';
        
        // Update value
        element.textContent = newValue;
        
        // Reset animation
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '#0f172a';
        }, 300);
    }

    /**
     * Update category filter options
     * @param {Array} categories - Array of category names
     */
    updateCategoryFilter(categories) {
        if (!this.elements.categoryFilter) return;
        
        const filter = this.elements.categoryFilter;
        const currentValue = filter.value;

        // Clear existing options except the first one
        filter.innerHTML = '<option value="">Tất cả thể loại</option>';

        // Add category options with count
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filter.appendChild(option);
        });

        // Restore previous selection if still valid
        if (categories.includes(currentValue)) {
            filter.value = currentValue;
        }

        // Add visual feedback
        if (categories.length > 0) {
            filter.style.borderColor = '#7DD3FC';
            filter.style.boxShadow = '0 0 0 3px rgba(125, 211, 252, 0.2)';
        }
    }

    /**
     * Initialize Chart.js
     */
    async initializeChart() {
        try {
            if (!this.elements.categoryChart) {
                console.log('Chart element not found, skipping chart initialization');
                return;
            }

            console.log('Loading Chart.js...');
            
            // Try to load Chart.js with fallback
            let Chart, registerables;
            try {
                const chartModule = await import('chart.js');
                Chart = chartModule.Chart;
                registerables = chartModule.registerables;
            } catch (importError) {
                console.warn('Chart.js import failed, using fallback:', importError);
                // Fallback: create a simple text display
                this.createFallbackChart();
                return;
            }

            Chart.register(...registerables);
            console.log('Chart.js loaded successfully');

            this.chart = new Chart(this.elements.categoryChart, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#FF6B6B',  // Red
                            '#4ECDC4',  // Teal
                            '#45B7D1',  // Blue
                            '#96CEB4',  // Green
                            '#FFEAA7',  // Yellow
                            '#DDA0DD',  // Plum
                            '#98D8C8',  // Mint
                            '#F7DC6F',  // Light Yellow
                            '#BB8FCE',  // Light Purple
                            '#85C1E9'   // Light Blue
                        ],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                font: {
                                    family: 'Inter',
                                    size: 12,
                                    weight: '500'
                                },
                                color: '#2D3748'
                            }
                        }
                    }
                }
            });
            console.log('Chart initialized successfully');
        } catch (error) {
            console.error('Error initializing chart:', error);
            this.createFallbackChart();
        }
    }

    /**
     * Create fallback chart display
     */
    createFallbackChart() {
        if (this.elements.categoryChart) {
            this.elements.categoryChart.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; color: #64748b;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📊</div>
                    <div style="text-align: center;">
                        <p style="margin: 0; font-weight: 500;">Biểu đồ thống kê</p>
                        <p style="margin: 0; font-size: 0.875rem;">Sẽ hiển thị khi có dữ liệu</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Update chart with new data
     * @param {Object} categoryCount - Object with category counts
     */
    updateChart(categoryCount) {
        console.log('View: Updating chart with data:', categoryCount);
        
        if (!this.chart) {
            console.log('View: Chart not initialized, using fallback display');
            // If chart is not available, update fallback display
            this.updateFallbackChart(categoryCount);
            return;
        }

        const categories = Object.keys(categoryCount);
        const counts = Object.values(categoryCount);

        console.log('View: Chart categories:', categories);
        console.log('View: Chart counts:', counts);

        this.chart.data.labels = categories;
        this.chart.data.datasets[0].data = counts;
        this.chart.update();
        
        console.log('View: Chart updated successfully');
    }

    /**
     * Update fallback chart display
     * @param {Object} categoryCount - Object with category counts
     */
    updateFallbackChart(categoryCount) {
        if (!this.elements.categoryChart) return;

        const categories = Object.keys(categoryCount);
        const counts = Object.values(categoryCount);
        
        console.log('View: Updating fallback chart with:', { categories, counts });
        
        if (categories.length === 0) {
            this.createFallbackChart();
            return;
        }

        // Create a simple list display
        const listItems = categories.map((category, index) => {
            const count = counts[index];
            const total = counts.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            
            // Color palette for fallback
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
            const color = colors[index % colors.length];
            
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; border: 2px solid #ffffff;"></div>
                        <span style="color: #0f172a; font-weight: 500; font-size: 14px;">${category}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 80px; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden;">
                            <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.3s ease;"></div>
                        </div>
                        <span style="color: #64748b; font-size: 12px; min-width: 40px; text-align: right; font-weight: 600;">${count}</span>
                        <span style="color: #94a3b8; font-size: 11px; min-width: 35px; text-align: right;">${percentage}%</span>
                    </div>
                </div>
            `;
        }).join('');

        this.elements.categoryChart.innerHTML = `
            <div style="padding: 20px;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${listItems}
                </div>
            </div>
        `;
        
        console.log('View: Fallback chart updated successfully');
    }

    /**
     * Force update chart (used when chart might not be initialized yet)
     * @param {Object} categoryCount - Object with category counts
     */
    forceUpdateChart(categoryCount) {
        console.log('View: Force updating chart...');
        
        // If chart exists, update it
        if (this.chart) {
            this.updateChart(categoryCount);
            return;
        }
        
        // If chart doesn't exist, try to initialize it first
        if (this.elements.categoryChart) {
            this.initializeChart().then(() => {
                // After chart is initialized, update it
                setTimeout(() => {
                    this.updateChart(categoryCount);
                }, 100);
            }).catch(() => {
                // If chart initialization fails, use fallback
                this.updateFallbackChart(categoryCount);
            });
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.elements.booksContainer.innerHTML = BookCard.createLoadingState();
        this.elements.booksContainer.style.display = 'flex';
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showToast(message, 'error');
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type ('success', 'error', 'info')
     */
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast glass toast-${type}`;
        toast.style.display = 'block';

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.style.display = 'none';
            }, 300);
        }, 3000);
    }

    /**
     * Clear search input
     */
    clearSearch() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
    }

    /**
     * Clear category filter
     */
    clearFilter() {
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.value = '';
        }
    }

    /**
     * Focus search input
     */
    focusSearch() {
        if (this.elements.searchInput) {
            this.elements.searchInput.focus();
        }
    }

    /**
     * Get current search query
     * @returns {string} Current search query
     */
    getSearchQuery() {
        return this.elements.searchInput ? this.elements.searchInput.value : '';
    }

    /**
     * Get current filter value
     * @returns {string} Current filter value
     */
    getFilterValue() {
        return this.elements.categoryFilter ? this.elements.categoryFilter.value : '';
    }
}
