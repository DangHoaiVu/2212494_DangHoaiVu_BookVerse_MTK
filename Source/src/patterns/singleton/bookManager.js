/**
 * Book Manager - Singleton Pattern Implementation
 * Manages book data and LocalStorage operations
 */
import { Book } from '../mvc/model.js';
import { BookFactory } from '../factory/BookFactory.js';
import eventBus, { EVENTS } from '../observer/eventBus.js';

class BookManager {
    constructor() {
        if (BookManager.instance) {
            return BookManager.instance;
        }

        this.STORAGE_KEY = 'bookverse_books';
        this.books = [];
        this.loadFromStorage();

        BookManager.instance = this;
    }

    /**
     * Get singleton instance
     * @returns {BookManager} Singleton instance
     */
    static getInstance() {
        if (!BookManager.instance) {
            BookManager.instance = new BookManager();
        }
        return BookManager.instance;
    }

    /**
     * Load books from LocalStorage
     */
    loadFromStorage() {
        try {
            console.log('BookManager: Loading from storage...');
            const stored = localStorage.getItem(this.STORAGE_KEY);
            console.log('BookManager: Stored data:', stored);
            
            if (stored) {
                const booksData = JSON.parse(stored);
                console.log('BookManager: Parsed books data:', booksData);
                this.books = BookFactory.createMultiple(booksData);
                console.log('BookManager: Created books:', this.books);
            } else {
                console.log('BookManager: No stored data found');
                this.books = [];
            }
        } catch (error) {
            console.error('Error loading books from storage:', error);
            this.books = [];
            eventBus.emit(EVENTS.ERROR_OCCURRED, {
                message: 'Không thể tải dữ liệu từ bộ nhớ',
                error
            });
        }
    }

    /**
     * Save books to LocalStorage
     */
    saveToStorage() {
        try {
            const booksData = this.books.map(book => book.toJSON());
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(booksData));
        } catch (error) {
            console.error('Error saving books to storage:', error);
            eventBus.emit(EVENTS.ERROR_OCCURRED, {
                message: 'Không thể lưu dữ liệu vào bộ nhớ',
                error
            });
        }
    }

    /**
     * Get all books
     * @returns {Array<Book>} Array of all books
     */
    getAll() {
        return [...this.books];
    }

    /**
     * Get book by ID
     * @param {number} id - Book ID
     * @returns {Book|null} Book instance or null if not found
     */
    getById(id) {
        return this.books.find(book => book.id === id) || null;
    }

    /**
     * Add a new book
     * @param {Object} bookData - Book data
     * @returns {Book} Added book instance
     */
    add(bookData) {
        try {
            const book = new Book(bookData);
            this.books.push(book);
            this.saveToStorage();
            
            eventBus.emit(EVENTS.BOOK_ADDED, book);
            eventBus.emit(EVENTS.BOOKS_CHANGED, this.getAll());
            
            return book;
        } catch (error) {
            eventBus.emit(EVENTS.ERROR_OCCURRED, {
                message: 'Không thể thêm sách mới',
                error
            });
            throw error;
        }
    }

    /**
     * Update an existing book
     * @param {number} id - Book ID
     * @param {Object} updates - Updated data
     * @returns {Book|null} Updated book or null if not found
     */
    update(id, updates) {
        try {
            const book = this.getById(id);
            if (!book) {
                throw new Error('Không tìm thấy sách cần cập nhật');
            }

            book.update(updates);
            this.saveToStorage();

            eventBus.emit(EVENTS.BOOK_UPDATED, book);
            eventBus.emit(EVENTS.BOOKS_CHANGED, this.getAll());

            return book;
        } catch (error) {
            eventBus.emit(EVENTS.ERROR_OCCURRED, {
                message: 'Không thể cập nhật sách',
                error
            });
            throw error;
        }
    }

    /**
     * Remove a book
     * @param {number} id - Book ID
     * @returns {boolean} True if removed, false if not found
     */
    remove(id) {
        try {
            const index = this.books.findIndex(book => book.id === id);
            if (index === -1) {
                return false;
            }

            const removedBook = this.books[index];
            this.books.splice(index, 1);
            this.saveToStorage();

            eventBus.emit(EVENTS.BOOK_DELETED, removedBook);
            eventBus.emit(EVENTS.BOOKS_CHANGED, this.getAll());

            return true;
        } catch (error) {
            eventBus.emit(EVENTS.ERROR_OCCURRED, {
                message: 'Không thể xóa sách',
                error
            });
            throw error;
        }
    }

    /**
     * Search books by query
     * @param {string} query - Search query
     * @returns {Array<Book>} Filtered books
     */
    search(query) {
        if (!query.trim()) {
            return this.getAll();
        }

        const searchTerm = query.toLowerCase();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Filter books by category
     * @param {string} category - Category name
     * @returns {Array<Book>} Filtered books
     */
    filterByCategory(category) {
        if (!category) {
            return this.getAll();
        }
        return this.books.filter(book => book.category === category);
    }

    /**
     * Get all unique categories
     * @returns {Array<string>} Array of unique categories
     */
    getCategories() {
        const categories = this.books.map(book => book.category);
        return [...new Set(categories)].sort();
    }

    /**
     * Get statistics
     * @returns {Object} Statistics object
     */
    getStats() {
        const totalBooks = this.books.length;
        const categories = this.getCategories();
        const totalCategories = categories.length;
        
        // Find most popular category
        const categoryCount = {};
        this.books.forEach(book => {
            categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
        });
        
        const popularCategory = Object.keys(categoryCount).reduce((a, b) => 
            categoryCount[a] > categoryCount[b] ? a : b, '-'
        );

        return {
            totalBooks,
            totalCategories,
            popularCategory,
            categoryCount
        };
    }

    /**
     * Clear all books
     */
    clear() {
        this.books = [];
        this.saveToStorage();
        eventBus.emit(EVENTS.BOOKS_CHANGED, this.getAll());
    }

    /**
     * Import books from array
     * @param {Array<Object>} booksData - Array of book data
     */
    importBooks(booksData) {
        try {
            const importedBooks = BookFactory.createMultiple(booksData);
            this.books.push(...importedBooks);
            this.saveToStorage();
            
            eventBus.emit(EVENTS.BOOKS_CHANGED, this.getAll());
            eventBus.emit(EVENTS.SUCCESS_MESSAGE, {
                message: `Đã import ${importedBooks.length} sách thành công`
            });
        } catch (error) {
            eventBus.emit(EVENTS.ERROR_OCCURRED, {
                message: 'Không thể import sách',
                error
            });
            throw error;
        }
    }
}

// Export singleton instance
export default BookManager.getInstance();

