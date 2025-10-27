/**
 * Skeleton Loader Component
 * Provides loading states for better UX
 */
export class SkeletonLoader {
    static createBookSkeleton() {
        return `
            <div class="book-card skeleton-card">
                <div class="book-cover skeleton-shimmer"></div>
                <div class="book-info">
                    <div class="skeleton-line skeleton-shimmer"></div>
                    <div class="skeleton-line skeleton-shimmer"></div>
                    <div class="skeleton-line skeleton-shimmer"></div>
                </div>
            </div>
        `;
    }

    static createStatsSkeleton() {
        return `
            <div class="stat-card glass skeleton-shimmer">
                <div class="stat-icon skeleton-shimmer"></div>
                <div class="stat-content">
                    <div class="stat-value skeleton-shimmer"></div>
                    <div class="stat-label skeleton-shimmer"></div>
                </div>
            </div>
        `;
    }

    static showSkeletonLoading(container, count = 6) {
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            container.insertAdjacentHTML('beforeend', this.createBookSkeleton());
        }
    }

    static hideSkeletonLoading(container) {
        if (!container) return;
        const skeletons = container.querySelectorAll('.skeleton-card');
        skeletons.forEach(skeleton => skeleton.remove());
    }
}


