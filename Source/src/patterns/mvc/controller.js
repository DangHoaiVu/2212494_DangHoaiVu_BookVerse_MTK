/**
 * Controller - MVC Pattern Implementation
 * Handles business logic and coordinates between Model and View
 */
import bookManager from '../singleton/bookManager.js';
import { View } from './view.js';
import { Modal } from '../../components/Modal.js';
import eventBus, { EVENTS } from '../observer/eventBus.js';
import { initializeDemoData } from '../../utils/demoLoader.js';

export class Controller {
    constructor() {
        this.view = null;
        this.modal = null;
        this.currentBooks = [];
        this.currentFilter = '';
        this.currentSearch = '';
        this.init();
    }

    /**
     * Initialize controller
     */
    init() {
        console.log('Controller: Initializing...');
        
        console.log('Controller: Creating View...');
        this.view = new View();
        console.log('Controller: View created');
        
        console.log('Controller: Creating Modal...');
        this.modal = new Modal();
        this.modal.init();
        console.log('Controller: Modal created and initialized');
        
        console.log('Controller: Setting up event listeners...');
        this.setupEventListeners();
        console.log('Controller: Event listeners setup complete');
        
        console.log('Controller: Loading initial data...');
        this.loadInitialData();
        console.log('Controller: Initial data loaded');
        
        console.log('Controller: Initialization complete');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Book management events
        eventBus.on(EVENTS.BOOKS_CHANGED, (books) => {
            this.handleBooksChanged(books);
        });

        eventBus.on(EVENTS.BOOK_ADDED, (book) => {
            this.handleBookAdded(book);
        });

        eventBus.on(EVENTS.BOOK_UPDATED, (book) => {
            this.handleBookUpdated(book);
        });

        eventBus.on(EVENTS.BOOK_DELETED, (book) => {
            this.handleBookDeleted(book);
        });

        // UI events
        eventBus.on(EVENTS.BOOK_SELECTED, (data) => {
            this.handleBookSelected(data);
        });

        eventBus.on(EVENTS.MODAL_OPEN, (data) => {
            this.handleModalOpen(data);
        });

        eventBus.on(EVENTS.SEARCH_CHANGED, (query) => {
            this.handleSearchChanged(query);
        });

        eventBus.on(EVENTS.FILTER_CHANGED, (category) => {
            this.handleFilterChanged(category);
        });

        // Error handling
        eventBus.on(EVENTS.ERROR_OCCURRED, (error) => {
            this.handleError(error);
        });

        eventBus.on(EVENTS.SUCCESS_MESSAGE, (message) => {
            this.handleSuccess(message);
        });

        // Custom events for form submission
        window.addEventListener('book:add', (e) => {
            this.handleAddBook(e.detail.data);
        });

        window.addEventListener('book:update', (e) => {
            this.handleUpdateBook(e.detail.id, e.detail.data);
        });

        // Export/Import events
        eventBus.on('books:export', () => {
            const json = this.exportBooks();
            if (!json) return;
            const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookverse-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            this.view.showSuccess('Đã xuất dữ liệu JSON');
        });

        eventBus.on('books:import', (text) => {
            try {
                const data = JSON.parse(text);
                if (!Array.isArray(data)) throw new Error('File JSON không đúng cấu trúc');
                this.importBooks(data);
            } catch (err) {
                this.view.showError('File JSON không hợp lệ');
            }
        });
    }

    /**
     * Load initial data
     */
    loadInitialData() {
        try {
            console.log('Controller: Loading initial data...');
            const books = bookManager.getAll();
            console.log('Controller: Books loaded:', books);
            
            // If no books exist, load demo data
            if (books.length === 0) {
                console.log('Controller: No books found, loading demo data...');
                initializeDemoData();
                // Reload books after demo data is loaded
                const updatedBooks = bookManager.getAll();
                console.log('Controller: Updated books after demo load:', updatedBooks);
                this.currentBooks = updatedBooks;
            } else {
                this.currentBooks = books;
            }
            
            console.log('Controller: Updating view...');
            // Use setTimeout to ensure DOM is ready
            setTimeout(() => {
                this.updateView();
            }, 100);
            console.log('Controller: View update scheduled');
        } catch (error) {
            console.error('Controller: Error loading initial data:', error);
            this.handleError({
                message: 'Không thể tải dữ liệu ban đầu',
                error
            });
        }
    }

    /**
     * Handle books changed event
     * @param {Array} books - Updated books array
     */
    handleBooksChanged(books) {
        this.currentBooks = books;
        this.applyFilters();
    }

    /**
     * Handle book added event
     * @param {Object} book - Added book
     */
    handleBookAdded(book) {
        this.view.showSuccess(`Đã thêm sách "${book.title}" thành công!`);
        this.view.clearSearch();
        this.view.clearFilter();
        this.currentSearch = '';
        this.currentFilter = '';
        
        // Update view with new data
        this.updateView();
    }

    /**
     * Handle book updated event
     * @param {Object} book - Updated book
     */
    handleBookUpdated(book) {
        this.view.showSuccess(`Đã cập nhật sách "${book.title}" thành công!`);
        
        // Update view with new data
        this.updateView();
    }

    /**
     * Handle book deleted event
     * @param {Object} book - Deleted book
     */
    handleBookDeleted(book) {
        this.view.showSuccess(`Đã xóa sách "${book.title}" thành công!`);
        
        // Update view with new data
        this.updateView();
    }

    /**
     * Handle book selected event (edit/delete)
     * @param {Object} data - Selection data
     */
    handleBookSelected(data) {
        const book = bookManager.getById(data.id);
        if (!book) {
            this.view.showError('Không tìm thấy sách!');
            return;
        }

        if (data.action === 'edit') {
            this.modal.openForEdit(book);
        } else if (data.action === 'delete') {
            this.handleDeleteBook(data.id);
        }
    }

    /**
     * Handle modal open event
     * @param {Object} data - Modal data
     */
    handleModalOpen(data) {
        if (data.mode === 'add') {
            this.modal.openForAdd();
        }
    }

    /**
     * Handle search changed event
     * @param {string} query - Search query
     */
    handleSearchChanged(query) {
        this.currentSearch = query;
        this.applyFilters();
    }

    /**
     * Handle filter changed event
     * @param {string} category - Selected category
     */
    handleFilterChanged(category) {
        this.currentFilter = category;
        this.applyFilters();
    }

    /**
     * Apply current filters and search
     */
    applyFilters() {
        let filteredBooks = [...this.currentBooks];

        // Apply search filter
        if (this.currentSearch) {
            filteredBooks = bookManager.search(this.currentSearch);
        }

        // Apply category filter
        if (this.currentFilter) {
            filteredBooks = filteredBooks.filter(book => 
                book.category === this.currentFilter
            );
        }

        this.view.renderBooks(filteredBooks);
    }

    /**
     * Handle add book
     * @param {Object} bookData - Book data
     */
    handleAddBook(bookData) {
        try {
            bookManager.add(bookData);
        } catch (error) {
            this.view.showError(error.message || 'Không thể thêm sách!');
        }
    }

    /**
     * Handle update book
     * @param {number} id - Book ID
     * @param {Object} bookData - Updated book data
     */
    handleUpdateBook(id, bookData) {
        try {
            bookManager.update(id, bookData);
        } catch (error) {
            this.view.showError(error.message || 'Không thể cập nhật sách!');
        }
    }

    /**
     * Handle delete book
     * @param {number} id - Book ID
     */
    handleDeleteBook(id) {
        try {
            const success = bookManager.remove(id);
            if (!success) {
                this.view.showError('Không thể xóa sách!');
            }
        } catch (error) {
            this.view.showError(error.message || 'Không thể xóa sách!');
        }
    }

    /**
     * Update view with current data
     */
    updateView() {
        try {
            console.log('Controller: Updating view...');
            
            // Reload current books from BookManager
            this.currentBooks = bookManager.getAll();
            console.log('Controller: Current books updated:', this.currentBooks.length);
            
            // Update books display
            console.log('Controller: Applying filters...');
            this.applyFilters();

            // Update statistics
            console.log('Controller: Getting stats...');
            const stats = bookManager.getStats();
            console.log('Controller: Stats:', stats);
            
            // Ensure stats have categoryCount
            if (!stats.categoryCount || Object.keys(stats.categoryCount).length === 0) {
                console.log('Controller: No category count data, generating from books...');
                const categories = bookManager.getCategories();
                const categoryCount = {};
                categories.forEach(cat => {
                    categoryCount[cat] = this.currentBooks.filter(book => book.category === cat).length;
                });
                stats.categoryCount = categoryCount;
                console.log('Controller: Generated category count:', stats.categoryCount);
            }
            
            this.view.renderStats(stats);

            // Update category filter
            console.log('Controller: Getting categories...');
            const categories = bookManager.getCategories();
            console.log('Controller: Categories:', categories);
            this.view.updateCategoryFilter(categories);
            
            console.log('Controller: View update complete');
        } catch (error) {
            console.error('Controller: Error updating view:', error);
            this.handleError({
                message: 'Không thể cập nhật giao diện',
                error
            });
        }
    }

    /**
     * Handle error
     * @param {Object} errorData - Error data
     */
    handleError(errorData) {
        console.error('Controller Error:', errorData);
        this.view.showError(errorData.message || 'Đã xảy ra lỗi không xác định!');
    }

    /**
     * Handle success message
     * @param {Object} messageData - Message data
     */
    handleSuccess(messageData) {
        this.view.showSuccess(messageData.message || 'Thao tác thành công!');
    }

    /**
     * Get current state
     * @returns {Object} Current state
     */
    getState() {
        return {
            books: this.currentBooks,
            search: this.currentSearch,
            filter: this.currentFilter,
            stats: bookManager.getStats()
        };
    }

    /**
     * Reset filters
     */
    resetFilters() {
        this.currentSearch = '';
        this.currentFilter = '';
        this.view.clearSearch();
        this.view.clearFilter();
        this.applyFilters();
    }

    /**
     * Import books from data
     * @param {Array} booksData - Array of book data
     */
    importBooks(booksData) {
        try {
            bookManager.importBooks(booksData);
        } catch (error) {
            this.view.showError(error.message || 'Không thể import sách!');
        }
    }

    /**
     * Export books data
     * @returns {string} JSON string of books data
     */
    exportBooks() {
        try {
            const books = bookManager.getAll();
            const booksData = books.map(book => book.toJSON());
            return JSON.stringify(booksData, null, 2);
        } catch (error) {
            this.view.showError('Không thể xuất dữ liệu sách!');
            return null;
        }
    }

    /**
     * Clear all books
     */
    clearAllBooks() {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả sách? Hành động này không thể hoàn tác!')) {
            try {
                bookManager.clear();
                this.view.showSuccess('Đã xóa tất cả sách!');
            } catch (error) {
                this.view.showError('Không thể xóa tất cả sách!');
            }
        }
    }
}
