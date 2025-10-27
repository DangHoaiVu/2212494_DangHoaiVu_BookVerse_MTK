/**
 * Book Model Class
 * Represents a book entity with validation
 */
export class Book {
    constructor(data) {
        this.id = data.id || Date.now();
        this.title = data.title || '';
        this.author = data.author || '';
        this.category = data.category || '';
        this.cover = data.cover || '';
        this.description = data.description || '';
        this.createdAt = data.createdAt || Date.now();
        
        this.validate();
    }

    /**
     * Validate book data
     * @throws {Error} If validation fails
     */
    validate() {
        if (!this.title.trim()) {
            throw new Error('Tiêu đề sách không được để trống');
        }
        if (!this.author.trim()) {
            throw new Error('Tác giả không được để trống');
        }
        if (!this.category.trim()) {
            throw new Error('Thể loại không được để trống');
        }
    }

    /**
     * Update book properties
     * @param {Object} updates - Object containing updates
     */
    update(updates) {
        Object.assign(this, updates);
        this.validate();
    }

    /**
     * Convert book to plain object for storage
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            category: this.category,
            cover: this.cover,
            description: this.description,
            createdAt: this.createdAt
        };
    }

    /**
     * Create book from plain object
     * @param {Object} data - Plain object data
     * @returns {Book} Book instance
     */
    static fromJSON(data) {
        return new Book(data);
    }
}



