-- BookVerse Database Backup Script
-- Script để backup và restore dữ liệu

-- Backup dữ liệu ra file JSON
.mode json
.output backup_books.json
SELECT * FROM books;

-- Backup dữ liệu ra file CSV
.mode csv
.headers on
.output backup_books.csv
SELECT * FROM books;

-- Reset output về console
.output stdout

-- Script restore từ JSON (nếu cần)
-- .read restore_from_json.sql

-- Thống kê dữ liệu
SELECT 'Tổng số sách: ' || COUNT(*) as stats FROM books
UNION ALL
SELECT 'Số thể loại: ' || COUNT(DISTINCT category) as stats FROM books
UNION ALL
SELECT 'Tác giả nhiều sách nhất: ' || author as stats 
FROM books 
GROUP BY author 
ORDER BY COUNT(*) DESC 
LIMIT 1;
