-- BookVerse Database Schema
-- Tạo bảng books để lưu trữ thông tin sách

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    cover TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index để tối ưu hóa tìm kiếm
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);

-- Dữ liệu mẫu
INSERT INTO books (title, author, category, cover, description) VALUES
('Đắc Nhân Tâm', 'Dale Carnegie', 'Self-help', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300', 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử'),
('Tôi Tài Giỏi, Bạn Cũng Thế', 'Adam Khoo', 'Self-help', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300', 'Phương pháp học tập hiệu quả và phát triển tư duy'),
('Nhà Giả Kim', 'Paulo Coelho', 'Fiction', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 'Câu chuyện về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống'),
('Clean Code', 'Robert C. Martin', 'Programming', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300', 'Nghệ thuật viết code sạch và dễ bảo trì'),
('JavaScript: The Good Parts', 'Douglas Crockford', 'Programming', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300', 'Khám phá những phần tốt nhất của JavaScript'),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300', 'Tiểu thuyết kinh điển về công lý và lòng nhân ái'),
('1984', 'George Orwell', 'Fiction', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 'Tác phẩm dystopian nổi tiếng về xã hội tương lai'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300', 'Tiểu thuyết về giấc mơ Mỹ và sự phù phiếm'),
('Atomic Habits', 'James Clear', 'Self-help', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300', 'Xây dựng thói quen tốt và phá vỡ thói quen xấu'),
('Sapiens', 'Yuval Noah Harari', 'History', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300', 'Lịch sử loài người từ thời tiền sử đến hiện tại');

-- Tạo view để thống kê
CREATE VIEW IF NOT EXISTS book_stats AS
SELECT 
    category,
    COUNT(*) as total_books,
    MIN(created_at) as first_book_date,
    MAX(created_at) as last_book_date
FROM books 
GROUP BY category;

-- Tạo trigger để cập nhật updated_at
CREATE TRIGGER IF NOT EXISTS update_books_timestamp 
    AFTER UPDATE ON books
BEGIN
    UPDATE books SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
