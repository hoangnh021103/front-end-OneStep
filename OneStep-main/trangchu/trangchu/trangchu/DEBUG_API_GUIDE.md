# Hướng dẫn Debug API và Lấy Dữ liệu Sản phẩm

## Vấn đề hiện tại
Frontend Vue.js không lấy được dữ liệu sản phẩm từ API backend.

## Các bước kiểm tra và sửa lỗi

### 1. Kiểm tra Backend API

#### Bước 1: Test API trực tiếp
Mở trình duyệt và truy cập:
```
http://localhost:8080/chi-tiet-san-pham/hien-thi
```

**Kết quả mong đợi:** Trả về JSON array chứa danh sách sản phẩm

#### Bước 2: Kiểm tra CORS
Mở Developer Tools (F12) và kiểm tra Console có lỗi CORS không.

#### Bước 3: Test với Postman/Insomnia
- Method: GET
- URL: `http://localhost:8080/chi-tiet-san-pham/hien-thi`
- Headers: `Origin: http://localhost:5177`

### 2. Kiểm tra Frontend

#### Bước 1: Mở file test
Mở file `test-api.html` trong trình duyệt:
```
file:///path/to/trangchu/test-api.html
```

#### Bước 2: Kiểm tra Console
Mở Developer Tools (F12) và xem Console có lỗi gì không.

#### Bước 3: Test API từ frontend
Nhấn nút "Test Chi Tiết Sản Phẩm API" và xem kết quả.

### 3. Các lỗi thường gặp và cách sửa

#### Lỗi CORS
**Triệu chứng:** `Access to fetch at 'http://localhost:8080/...' from origin 'http://localhost:5177' has been blocked by CORS policy`

**Cách sửa:**
1. Kiểm tra file `WebConfig.java` có đúng cấu hình CORS không
2. Đảm bảo `allowedOrigins` có chứa `http://localhost:5177`
3. Restart backend server

#### Lỗi 404 Not Found
**Triệu chứng:** `GET http://localhost:8080/chi-tiet-san-pham/hien-thi 404 (Not Found)`

**Cách sửa:**
1. Kiểm tra controller có annotation `@RestController` và `@RequestMapping("/chi-tiet-san-pham")`
2. Kiểm tra method có annotation `@GetMapping("/hien-thi")`
3. Đảm bảo package controller được scan

#### Lỗi 500 Internal Server Error
**Triệu chứng:** `GET http://localhost:8080/chi-tiet-san-pham/hien-thi 500 (Internal Server Error)`

**Cách sửa:**
1. Kiểm tra log backend để xem lỗi chi tiết
2. Kiểm tra service và repository có hoạt động không
3. Kiểm tra database connection

#### Lỗi Network
**Triệu chứng:** `Network Error` hoặc `ERR_CONNECTION_REFUSED`

**Cách sửa:**
1. Đảm bảo backend server đang chạy trên port 8080
2. Kiểm tra firewall không chặn port 8080
3. Thử truy cập `http://localhost:8080` trực tiếp

### 4. Cấu hình đã cập nhật

#### Frontend (Vue.js)
- ✅ Cập nhật `ProductService` để sử dụng `/chi-tiet-san-pham/hien-thi`
- ✅ Cập nhật `store/modules/products.js` để xử lý dữ liệu từ API mới
- ✅ Cập nhật `Home.vue` và `Products.vue` để sử dụng API mới
- ✅ Thêm fallback về `/san-pham/hien-thi` nếu API chính lỗi

#### Backend (Spring Boot)
- ✅ Cấu hình CORS cho `http://localhost:5177`
- ✅ Controller `ChiTietSanPhamController` với endpoint `/hien-thi`

### 5. Debug Commands

#### Chạy test API từ Node.js
```bash
cd trangchu
node test-api.js
```

#### Kiểm tra log backend
Xem console của Spring Boot application để tìm lỗi.

#### Kiểm tra network requests
1. Mở Developer Tools (F12)
2. Vào tab Network
3. Reload trang
4. Xem request đến API có thành công không

### 6. Cấu trúc dữ liệu mong đợi

API `/chi-tiet-san-pham/hien-thi` nên trả về:
```json
[
  {
    "id": 1,
    "chiTietSanPhamId": 1,
    "sanPhamId": 1,
    "tenSanPham": "Tên sản phẩm",
    "tenChiTiet": "Tên chi tiết",
    "giaTien": 1000000,
    "tienGiamGia": 200000,
    "soLuongTon": 50,
    "duongDanAnh": "/images/product1.jpg",
    "thuongHieuTen": "Nike",
    "mauSacList": ["Đen", "Trắng"],
    "kichCoList": ["39", "40", "41"],
    "moTa": "Mô tả sản phẩm",
    "danhMuc": "Giày thể thao"
  }
]
```

### 7. Nếu vẫn không hoạt động

1. **Kiểm tra database:** Đảm bảo có dữ liệu trong bảng chi_tiet_san_pham
2. **Kiểm tra service:** Test service `ChiTietSanPhamService.getAll()` trực tiếp
3. **Kiểm tra repository:** Test repository method
4. **Tạo dữ liệu test:** Thêm một vài record test vào database

### 8. Test cuối cùng

Sau khi sửa lỗi, test lại:
1. Mở `http://localhost:5177` (frontend)
2. Vào trang Products hoặc Home
3. Kiểm tra Console có log "API Response" không
4. Kiểm tra sản phẩm có hiển thị không
5. Kiểm tra giá có đúng không

Nếu vẫn có vấn đề, hãy gửi log lỗi chi tiết để được hỗ trợ thêm.
