# 2212494_DangHoaiVu_BookVerse_MTK
Phát triển bằng HTML, CSS, JavaScript theo mô hình MVC và các mẫu thiết kế phần mềm Singleton, Factory, Observer)
# 📚 BookVerse - Ứng Dụng Quản Lý Thư Viện Sách

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)

## 🎯 Giới Thiệu

BookVerse là một ứng dụng web quản lý thư viện sách được phát triển bằng Vanilla JavaScript và Vite. Ứng dụng hỗ trợ các chức năng CRUD đầy đủ, tìm kiếm thông minh, thống kê trực quan và giao diện hiện đại với thiết kế Glassmorphism.

## ✨ Tính Năng Chính

### 🔧 Chức Năng Cốt Lõi
- **CRUD Sách**: Thêm, sửa, xóa và xem chi tiết sách
- **Tìm Kiếm & Lọc**: Tìm kiếm theo tên, tác giả và lọc theo thể loại
- **Thống Kê Trực Quan**: Biểu đồ tròn hiển thị phân bố sách theo thể loại
- **Lưu Trữ**: Tự động lưu dữ liệu vào LocalStorage

### 🎨 Giao Diện & Trải Nghiệm
- **Thiết Kế Glassmorphism**: Giao diện hiện đại với hiệu ứng kính mờ
- **Dark/Light Mode**: Chế độ sáng/tối với khả năng ghi nhớ tùy chọn
- **Responsive Design**: Tối ưu cho cả máy tính và thiết bị di động
- **Accessibility**: Hỗ trợ ARIA labels và điều hướng bằng bàn phím

### 🔄 Tính Năng Nâng Cao
- **Export/Import JSON**: Xuất và nhập dữ liệu sách
- **Kiến Trúc MVC**: Tách biệt rõ ràng Model, View, Controller
- **Design Patterns**: Áp dụng Factory, Observer, Singleton

## 🛠️ Công Nghệ Sử Dụng

| Công Nghệ | Phiên Bản | Mô Tả |
|-----------|-----------|-------|
| **JavaScript** | ES6+ | Ngôn ngữ lập trình chính |
| **Vite** | 5.x | Công cụ build và dev server |
| **Chart.js** | 4.x | Thư viện tạo biểu đồ |
| **CSS3** | - | Styling với Glassmorphism |
| **LocalStorage** | - | Lưu trữ dữ liệu client-side |

## 🚀 Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Node.js phiên bản 18 trở lên
- npm phiên bản 9 trở lên
- Git phiên bản 2.40 trở lên

### Cài Đặt
```bash
# Clone repository
git clone https://github.com/DangHoaiVu/2212494_DangHoaiVu_BookVerse_MTK.git
cd 2212494_DangHoaiVu_BookVerse_MTK

# Cài đặt dependencies
cd Source
npm install
```

### Chạy Ứng Dụng
```bash
# Chế độ development
npm run dev

# Build sản phẩm
npm run build

# Xem trước bản build
npm run preview
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu Trúc Dự Án

```
2212494_DangHoaiVu_BookVerse_MTK/
├── 📁 Database/                 # Cơ sở dữ liệu mẫu
│   ├── backup.sql              # Backup database
│   ├── sample_data.json       # Dữ liệu mẫu
│   └── schema.sql             # Schema database
├── 📁 Source/                  # Mã nguồn chính
│   ├── 📁 src/
│   │   ├── 📁 components/      # Các thành phần giao diện
│   │   │   ├── BookCard.js    # Component hiển thị sách
│   │   │   ├── Modal.js       # Modal thêm/sửa sách
│   │   │   └── SkeletonLoader.js # Loading animation
│   │   ├── 📁 patterns/       # Design patterns
│   │   │   ├── 📁 factory/    # Factory pattern
│   │   │   ├── 📁 mvc/       # MVC pattern
│   │   │   ├── 📁 observer/   # Observer pattern
│   │   │   └── 📁 singleton/ # Singleton pattern
│   │   ├── 📁 styles/         # CSS styling
│   │   │   └── style.css     # Main stylesheet
│   │   ├── 📁 utils/         # Utility functions
│   │   │   ├── demoLoader.js # Load demo data
│   │   │   ├── theme.js      # Theme management
│   │   │   └── themeManager.js # Theme utilities
│   │   ├── demo-data.js      # Sample data
│   │   └── main.js           # Entry point
│   ├── 📁 dist/              # Build output
│   ├── index.html            # Main HTML file
│   ├── package.json          # Dependencies
│   └── vite.config.js        # Vite configuration
├── 📁 Thực thi/               # Execution files
│   └── run.html              # Quick launcher
├── package.json              # Root package config
├── GitHub_Info.txt           # Project information

```

## 🎮 Hướng Dẫn Sử Dụng

### Thêm Sách Mới
1. Nhấn nút **"+ Thêm Sách"** ở header
2. Điền thông tin: Tiêu đề, Tác giả, Thể loại (bắt buộc)
3. Thêm URL ảnh bìa và mô tả (tùy chọn)
4. Nhấn **"Lưu"** để thêm sách

### Tìm Kiếm và Lọc
- **Tìm kiếm**: Nhập từ khóa vào ô tìm kiếm
- **Lọc**: Chọn thể loại từ dropdown
- **Kết hợp**: Có thể tìm kiếm và lọc cùng lúc

### Quản Lý Dữ Liệu
- **Xuất JSON**: Nhấn **"📤 Xuất JSON"** để tải dữ liệu
- **Nhập JSON**: Nhấn **"📥 Nhập JSON"** để upload file
- **Chế độ tối**: Nhấn nút **🌙** để chuyển đổi

## 🔧 Cấu Hình

### Vite Configuration
```javascript
// Source/vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/2212494_DangHoaiVu_BookVerse_MTK/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: { manualChunks: undefined }
    }
  },
  resolve: {
    alias: { '@': '/src' }
  }
})
```

## 🌐 Triển Khai

### GitHub Pages
1. **Tự động**: Sử dụng GitHub Actions (khuyến nghị)
2. **Thủ công**: 
   ```bash
   cd Source
   npm run build
   git subtree push --prefix Source/dist origin gh-pages
   ```

### GitHub Actions Workflow
```yaml
# .github/workflows/pages.yml
name: Deploy BookVerse to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: 
          node-version: 20
      - run: cd Source && npm ci
      - run: cd Source && npm run build
      - uses: actions/upload-pages-artifact@v3
        with: 
          path: ./Source/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 🐛 Khắc Phục Sự Cố

| Lỗi | Giải Pháp |
|-----|-----------|
| **Lỗi push** | Kiểm tra quyền truy cập repository và cấu hình remote URL |
| **Lỗi build** | Xóa `node_modules` + `package-lock.json` → `npm install` |
| **Pages không hiển thị** | Kiểm tra trạng thái Actions và cấu hình Pages |
| **Lỗi chạy dev** | Đảm bảo đang ở đúng thư mục `Source` |

## 👨‍💻 Tác Giả

**Đặng Hoài Vũ**  
- **MSSV**: 2212494
- **Email**: 2212494@dlu.edu.vn
- **Lớp**: CTK46PM – Đại học Đà Lạt

## 📄 License

Dự án này được phân phối dưới [MIT License](LICENSE).

## 📞 Liên Hệ

- **Email**: 2212494@dlu.edu.vn

---

⭐ **Nếu dự án này hữu ích, hãy cho một star!** ⭐
