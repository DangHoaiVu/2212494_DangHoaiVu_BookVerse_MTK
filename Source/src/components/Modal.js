/**
 * Modal Component
 * Handles modal operations for add/edit book forms
 */
export class Modal {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.form = null;
        this.currentBookId = null;
        this.isOpen = false;
    }

    /**
     * Initialize modal elements
     */
    init() {
        this.modal = document.getElementById('bookModal');
        if (!this.modal) {
            console.error('Modal element not found');
            return;
        }
        this.overlay = this.modal.querySelector('.modal-overlay') || this.modal;
        this.form = document.getElementById('bookForm');
        this.setupEventListeners();
    }

    /**
     * Setup modal event listeners
     */
    setupEventListeners() {
        // Close modal events
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.close());
        }
        if (modalCancel) {
            modalCancel.addEventListener('click', () => this.close());
        }
        
        // Overlay click to close
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        // Real-time validation
        this.setupFormValidation();
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const requiredFields = ['bookTitle', 'bookAuthor', 'bookCategory'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.validateField(field));
                field.addEventListener('blur', () => this.validateField(field));
            }
        });

        // Live preview for cover URL
        const coverInput = document.getElementById('bookCover');
        if (coverInput) {
            coverInput.addEventListener('input', () => this.updateCoverPreview());
            coverInput.addEventListener('blur', () => this.updateCoverPreview());
        }
    }

    /**
     * Validate individual field
     * @param {HTMLElement} field - Form field element
     */
    validateField(field) {
        const isValid = field.value.trim() !== '';
        const errorElement = document.getElementById(field.id + '-error');
        
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            field.setAttribute('aria-invalid', 'false');
            if (errorElement) {
                errorElement.textContent = '';
            }
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            if (errorElement) {
                errorElement.textContent = 'Trường này không được để trống';
            }
        }

        this.updateSubmitButton();
    }

    /**
     * Update submit button state
     */
    updateSubmitButton() {
        const requiredFields = ['bookTitle', 'bookAuthor', 'bookCategory'];
        const allValid = requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim() !== '';
        });

        const submitBtn = document.getElementById('modalSave');
        if (submitBtn) {
            submitBtn.disabled = !allValid;
            submitBtn.textContent = this.currentBookId ? 'Cập nhật' : 'Thêm sách';
        }
    }

    /**
     * Open modal for adding new book
     */
    openForAdd() {
        this.currentBookId = null;
        this.resetForm();
        this.setTitle('Thêm Sách Mới');
        this.open();
    }

    /**
     * Open modal for editing existing book
     * @param {Object} book - Book object to edit
     */
    openForEdit(book) {
        this.currentBookId = book.id;
        this.fillForm(book);
        this.setTitle('Chỉnh Sửa Sách');
        this.open();
    }

    /**
     * Open modal
     */
    open() {
        this.isOpen = true;
        this.modal.style.display = 'flex';
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Focus trap
        this.trapFocus();
        
        // Animate in
        requestAnimationFrame(() => {
            this.modal.classList.add('show');
        });

        // Focus first input
        const firstInput = document.getElementById('bookTitle');
        if (firstInput) {
            firstInput.focus();
        }
        
        // Announce modal opening to screen readers
        this.announceModalOpen();
    }

    /**
     * Close modal
     */
    close() {
        this.isOpen = false;
        this.modal.classList.remove('show');
        this.modal.setAttribute('aria-hidden', 'true');
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.resetForm();
            this.cleanup();
        }, 300);
        
        // Return focus to trigger element
        this.returnFocus();
    }

    /**
     * Set modal title
     * @param {string} title - Modal title
     */
    setTitle(title) {
        const titleElement = document.getElementById('modalTitle');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    /**
     * Reset form to initial state
     */
    resetForm() {
        if (this.form) {
            this.form.reset();
            
            // Remove validation classes
            const fields = this.form.querySelectorAll('input, textarea');
            fields.forEach(field => {
                field.classList.remove('error', 'valid');
            });
        }
        
        this.currentBookId = null;
        this.updateSubmitButton();

        // Remove preview if exists
        const preview = document.getElementById('coverPreview');
        if (preview && preview.parentElement) {
            preview.parentElement.remove();
        }
    }

    /**
     * Fill form with book data
     * @param {Object} book - Book object
     */
    fillForm(book) {
        const fields = {
            bookTitle: document.getElementById('bookTitle'),
            bookAuthor: document.getElementById('bookAuthor'),
            bookCategory: document.getElementById('bookCategory'),
            bookCover: document.getElementById('bookCover'),
            bookDescription: document.getElementById('bookDescription')
        };

        if (fields.bookTitle) fields.bookTitle.value = book.title || '';
        if (fields.bookAuthor) fields.bookAuthor.value = book.author || '';
        if (fields.bookCategory) fields.bookCategory.value = book.category || '';
        if (fields.bookCover) fields.bookCover.value = book.cover || '';
        if (fields.bookDescription) fields.bookDescription.value = book.description || '';

        // Validate filled fields
        const requiredFields = ['bookTitle', 'bookAuthor', 'bookCategory'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                this.validateField(field);
            }
        });

        // Update preview for existing book cover
        this.updateCoverPreview();
    }

    /**
     * Handle form submission
     */
    handleSubmit() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }

        // Emit event for controller to handle
        if (this.currentBookId) {
            window.dispatchEvent(new CustomEvent('book:update', {
                detail: { id: this.currentBookId, data: formData }
            }));
        } else {
            window.dispatchEvent(new CustomEvent('book:add', {
                detail: { data: formData }
            }));
        }

        this.close();
    }

    /**
     * Get form data
     * @returns {Object} Form data object
     */
    getFormData() {
        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value.trim() : '';
        };

        return {
            title: getValue('bookTitle'),
            author: getValue('bookAuthor'),
            category: getValue('bookCategory'),
            cover: getValue('bookCover'),
            description: getValue('bookDescription')
        };
    }

    /**
     * Validate form data
     * @param {Object} formData - Form data to validate
     * @returns {boolean} True if valid
     */
    validateForm(formData) {
        const errors = [];

        if (!formData.title) {
            errors.push('Tiêu đề sách không được để trống');
        }

        if (!formData.author) {
            errors.push('Tác giả không được để trống');
        }

        if (!formData.category) {
            errors.push('Thể loại không được để trống');
        }

        if (errors.length > 0) {
            this.showValidationErrors(errors);
            return false;
        }

        return true;
    }

    /**
     * Update cover preview area below cover URL input
     */
    updateCoverPreview() {
        const coverInput = document.getElementById('bookCover');
        if (!coverInput) return;

        const url = coverInput.value.trim();
        let container = document.getElementById('coverPreviewContainer');

        if (!container) {
            // Create preview container under the input's form-group
            const group = coverInput.closest('.form-group');
            if (!group) return;
            container = document.createElement('div');
            container.id = 'coverPreviewContainer';
            container.style.marginTop = '8px';
            container.style.border = '1px dashed rgba(0,0,0,0.15)';
            container.style.borderRadius = '8px';
            container.style.padding = '8px';
            container.style.background = 'rgba(255,255,255,0.3)';
            container.innerHTML = '<div id="coverPreview" style="height: 160px; display:flex; align-items:center; justify-content:center; overflow:hidden; border-radius:6px; background:#f8fafc; color:#64748b; font-size:12px;">Dán URL ảnh để xem trước</div>';
            group.appendChild(container);
        }

        const preview = document.getElementById('coverPreview');
        if (!preview) return;

        if (!url) {
            preview.textContent = 'Dán URL ảnh để xem trước';
            preview.style.backgroundImage = 'none';
            return;
        }

        // Check if it's a search URL (Bing, Google, etc.)
        if (url.includes('bing.com/images/search') || url.includes('google.com/search') || url.includes('images.google.com')) {
            preview.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                    <div style="font-weight: 500; margin-bottom: 4px;">URL không hợp lệ</div>
                    <div style="font-size: 11px; color: #64748b;">
                        Đây là link tìm kiếm, không phải link ảnh trực tiếp.<br>
                        Hãy click chuột phải vào ảnh → "Copy image address"
                    </div>
                </div>
            `;
            return;
        }

        // Basic URL validation
        try {
            // eslint-disable-next-line no-new
            new URL(url);
        } catch {
            preview.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">❌</div>
                    <div style="font-weight: 500; margin-bottom: 4px;">URL không hợp lệ</div>
                    <div style="font-size: 11px; color: #64748b;">
                        Vui lòng nhập URL ảnh hợp lệ (bắt đầu bằng http:// hoặc https://)
                    </div>
                </div>
            `;
            return;
        }

        // Show loading state
        preview.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 24px; margin-bottom: 8px;">⏳</div>
                <div style="font-weight: 500;">Đang tải ảnh...</div>
            </div>
        `;

        // Show image inside the preview safely
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Xem trước ảnh bìa';
        img.loading = 'eager';
        img.referrerPolicy = 'no-referrer';
        img.crossOrigin = 'anonymous';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '150px';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '6px';
        img.style.display = 'none';
        
        img.onload = () => {
            preview.innerHTML = '';
            preview.style.background = '#f8fafc';
            preview.style.backgroundImage = 'none';
            preview.appendChild(img);
            img.style.display = 'block';
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 100);
        };
        
        img.onerror = () => {
            preview.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">❌</div>
                    <div style="font-weight: 500; margin-bottom: 4px;">Không tải được ảnh</div>
                    <div style="font-size: 11px; color: #64748b;">
                        URL có thể không tồn tại hoặc không cho phép truy cập từ bên ngoài
                    </div>
                </div>
            `;
        };
    }

    /**
     * Show validation errors
     * @param {Array<string>} errors - Array of error messages
     */
    showValidationErrors(errors) {
        const errorMessage = errors.join('\n');
        alert('Vui lòng kiểm tra lại thông tin:\n' + errorMessage);
    }

    /**
     * Trap focus within modal
     */
    trapFocus() {
        if (!this.modal) return;
        
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        this.modal.addEventListener('keydown', handleTabKey);
        
        // Store cleanup function
        this.cleanupFocusTrap = () => {
            this.modal.removeEventListener('keydown', handleTabKey);
        };
    }

    /**
     * Cleanup focus trap
     */
    cleanup() {
        if (this.cleanupFocusTrap) {
            this.cleanupFocusTrap();
        }
    }

    /**
     * Announce modal opening to screen readers
     */
    announceModalOpen() {
        const title = document.getElementById('modalTitle');
        if (title) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = `Modal ${title.textContent} đã mở`;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
    }

    /**
     * Store and return focus to trigger element
     */
    returnFocus() {
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    }

    /**
     * Store the element that triggered the modal
     * @param {HTMLElement} element - Element that triggered modal
     */
    setTriggerElement(element) {
        this.lastFocusedElement = element;
    }
}
