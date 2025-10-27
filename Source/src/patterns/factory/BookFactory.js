/**
 * BookFactory - Factory Pattern Implementation
 * Creates different types of books with specific configurations
 */
import { Book } from '../mvc/model.js';

export class BookFactory {
    /**
     * Create a book instance
     * @param {string} type - Type of book ('comic', 'novel', 'textbook', 'general')
     * @param {Object} data - Book data
     * @returns {Book} Book instance
     */
    static create(type, data) {
        const defaultData = {
            id: data.id || Date.now(),
            title: data.title || '',
            author: data.author || '',
            category: data.category || '',
            cover: data.cover || '',
            description: data.description || '',
            createdAt: data.createdAt || Date.now()
        };

        // Apply type-specific defaults
        switch (type.toLowerCase()) {
            case 'comic':
                defaultData.category = defaultData.category || 'Truyện tranh';
                defaultData.description = defaultData.description || 'Truyện tranh với hình ảnh minh họa sinh động';
                break;
            case 'novel':
                defaultData.category = defaultData.category || 'Tiểu thuyết';
                defaultData.description = defaultData.description || 'Tiểu thuyết văn học với cốt truyện hấp dẫn';
                break;
            case 'textbook':
                defaultData.category = defaultData.category || 'Sách giáo khoa';
                defaultData.description = defaultData.description || 'Sách giáo khoa chuyên môn';
                break;
            default:
                // General book - no special defaults
                break;
        }

        return new Book(defaultData);
    }

    /**
     * Create multiple books from array
     * @param {Array} booksData - Array of book data
     * @returns {Array<Book>} Array of Book instances
     */
    static createMultiple(booksData) {
        return booksData.map(data => new Book(data));
    }

    /**
     * Get available book types
     * @returns {Array<string>} Array of book types
     */
    static getTypes() {
        return ['comic', 'novel', 'textbook', 'general'];
    }

    /**
     * Create a comic book
     * @param {Object} data - Book data
     * @returns {Book} Comic book instance
     */
    static createComic(data) {
        return this.create('comic', data);
    }

    /**
     * Create a novel
     * @param {Object} data - Book data
     * @returns {Book} Novel instance
     */
    static createNovel(data) {
        return this.create('novel', data);
    }

    /**
     * Create a textbook
     * @param {Object} data - Book data
     * @returns {Book} Textbook instance
     */
    static createTextbook(data) {
        return this.create('textbook', data);
    }

    /**
     * Create a general book
     * @param {Object} data - Book data
     * @returns {Book} General book instance
     */
    static createGeneral(data) {
        return this.create('general', data);
    }
}


