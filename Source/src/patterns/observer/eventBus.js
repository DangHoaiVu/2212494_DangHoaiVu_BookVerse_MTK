/**
 * Event Bus - Observer Pattern Implementation
 * Simple pub/sub system for decoupled communication between components
 */
class EventBus {
    constructor() {
        this.events = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    }

    /**
     * Emit an event to all subscribers
     * @param {string} event - Event name
     * @param {*} payload - Data to pass to callbacks
     */
    emit(event, payload) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(payload);
                } catch (error) {
                    console.error(`Error in event callback for "${event}":`, error);
                }
            });
        }
    }

    /**
     * Subscribe to an event only once
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    once(event, callback) {
        const onceCallback = (payload) => {
            callback(payload);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }

    /**
     * Remove all listeners for an event
     * @param {string} event - Event name
     */
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }

    /**
     * Get all event names
     * @returns {Array<string>} Array of event names
     */
    getEventNames() {
        return Array.from(this.events.keys());
    }

    /**
     * Get listener count for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    getListenerCount(event) {
        return this.events.has(event) ? this.events.get(event).size : 0;
    }
}

// Export singleton instance
export default new EventBus();

// Export class for testing purposes
export { EventBus };

// Predefined event constants
export const EVENTS = {
    BOOKS_CHANGED: 'books:changed',
    BOOK_ADDED: 'book:added',
    BOOK_UPDATED: 'book:updated',
    BOOK_DELETED: 'book:deleted',
    BOOK_SELECTED: 'book:selected',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',
    SEARCH_CHANGED: 'search:changed',
    FILTER_CHANGED: 'filter:changed',
    ERROR_OCCURRED: 'error:occurred',
    SUCCESS_MESSAGE: 'success:message'
};


