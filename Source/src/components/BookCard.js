export class BookCard {
    static create(book) {
        const coverImage = book.cover || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwSDgwVjEyMEgxMDBWMTAwWiIgZmlsbD0iI0QxRDVEQyIvPgo8cGF0aCBkPSJNMTIwIDEyMEg4MFYxNDBIMTIwVjEyMFoiIGZpbGw9IiNEQzEzNDEiLz4KPHA+dGggZD0iTTEwMCAxNDBIODBWMTYwSDEwMFYxNDBaIiBmaWxsPSIjRENEM0M0Ii8+CjxwYXRoIGQ9Ik0xMjAgMTYwSDgwVjE4MEgxMjBWMTYwWiIgZmlsbD0iI0U1RjdFQiIvPgo8dGV4dCB4PSIxMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5KaIFNhw6NjaDwvdGV4dD4KPC9zdmc+';
        
        return `
            <div class="book-card glass-card" data-id="${book.id}" role="gridcell" tabindex="0" aria-label="Sách: ${this.escapeHtml(book.title)} - Tác giả: ${this.escapeHtml(book.author)}">
				<div class="book-cover">
					<img src="${coverImage}" 
						 alt="Ảnh bìa sách ${this.escapeHtml(book.title)}" 
						 loading="lazy"
						 onload="this.style.opacity='1'"
						 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwSDgwVjEyMEgxMDBWMTAwWiIgZmlsbD0iI0QxRDVEQyIvPgo8cGF0aCBkPSJNMTIwIDEyMEg4MFYxNDBIMTIwVjEyMFoiIGZpbGw9IiNEQzEzNDEiLz4KPHA+dGggZD0iTTEwMCAxNDBIODBWMTYwSDEwMFYxNDBaIiBmaWxsPSIjRENEM0M0Ii8+CjxwYXRoIGQ9Ik0xMjAgMTYwSDgwVjE4MEgxMjBWMTYwWiIgZmlsbD0iI0U1RjdFQiIvPgo8dGV4dCB4PSIxMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5KaIFNhw6NjaDwvdGV4dD4KPC9zdmc+'; this.style.opacity='1'"
						 style="opacity:0; transition: opacity 0.3s ease;">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${this.escapeHtml(book.title)}</h3>
                    <p class="book-author">${this.escapeHtml(book.author)}</p>
                    <span class="book-category" aria-label="Thể loại: ${this.escapeHtml(book.category)}">${this.escapeHtml(book.category)}</span>
                    ${book.description ? `<p class="book-description">${this.escapeHtml(book.description)}</p>` : ''}
                </div>
                <div class="book-actions" role="group" aria-label="Hành động với sách">
                    <button class="btn btn-sm btn-edit edit-btn" data-id="${book.id}" aria-label="Chỉnh sửa sách ${this.escapeHtml(book.title)}">
                        <span aria-hidden="true">✏️</span>
                    </button>
                    <button class="btn btn-sm btn-delete delete-btn" data-id="${book.id}" aria-label="Xóa sách ${this.escapeHtml(book.title)}">
                        <span aria-hidden="true">🗑️</span>
                    </button>
                </div>
            </div>
        `;
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static createEmptyState() {
        return `
            <div class="empty-state glass">
                <div class="empty-icon">📚</div>
                <h3>Chưa có sách nào</h3>
                <p>Hãy thêm sách đầu tiên để bắt đầu quản lý thư viện của bạn!</p>
                <button class="btn btn-primary" id="addFirstBookBtn">
                    <span>+</span> Thêm Sách Đầu Tiên
                </button>
            </div>
        `;
    }

    static createLoadingState() {
        return `
            <div class="loading-state glass">
                <div class="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        `;
    }

    static addHoverEffects(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    }

    static removeHoverEffects(card) {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
    }
}