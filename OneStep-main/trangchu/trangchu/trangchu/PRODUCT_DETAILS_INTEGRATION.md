# Tích hợp API Chi Tiết Sản Phẩm vào Checkout

## Tổng quan
Đã tích hợp thành công API `/chi-tiet-san-pham/hien-thi-theo-san-pham/{id}` để lấy thông tin chi tiết sản phẩm và hiển thị trong trang Checkout.

## Cấu trúc dữ liệu API

### Endpoint: `/chi-tiet-san-pham/hien-thi-theo-san-pham/{id}`
```json
{
  "maChiTiet": 0,
  "kichCoId": 0,
  "sanPhamId": 0,
  "mauSacId": 0,
  "duongDanAnh": "string",
  "giaTien": 0,
  "soLuongTon": 0,
  "trangThai": 0,
  "tienGiamGia": 0,
  "daXoa": 0,
  "ngayCapNhat": "2025-09-19",
  "nguoiTao": "string",
  "nguoiCapNhat": "string"
}
```

## Các thay đổi đã thực hiện

### 1. Cập nhật ProductService (`src/services/productService.js`)

#### Thêm method mới:
- `getProductDetailsBySanPhamId(sanPhamId)`: Lấy chi tiết sản phẩm theo ID sản phẩm
- Cập nhật `getCartItemsWithUpdatedPrices()`: Sử dụng API mới để lấy giá và thông tin chi tiết

#### Tính năng:
- Ưu tiên lấy chi tiết theo `sanPhamId` trước
- Fallback về API cũ nếu không có `sanPhamId`
- Xử lý lỗi gracefully
- Log chi tiết để debug

### 2. Cập nhật Checkout.vue

#### Hiển thị thông tin chi tiết:
- **Mã chi tiết**: `maChiTiet`
- **Kích cỡ ID**: `kichCoId`
- **Màu sắc ID**: `mauSacId`
- **Tồn kho**: `soLuongTon`
- **Trạng thái**: `trangThai` (với màu sắc phân biệt)
- **Ngày cập nhật**: `ngayCapNhat`

#### Thêm methods:
- `getStatusText(status)`: Chuyển đổi mã trạng thái thành text
- `getStatusClass(status)`: CSS class cho trạng thái
- `formatDate(dateString)`: Format ngày tháng

#### CSS mới:
- `.product-details`: Container cho thông tin chi tiết
- `.detail-row`: Hàng thông tin
- `.status-*`: Màu sắc cho các trạng thái khác nhau

## Cách hoạt động

### 1. Khi vào trang Checkout:
1. Component gọi `loadUpdatedPrices()`
2. Với mỗi sản phẩm trong giỏ hàng:
   - Kiểm tra có `sanPhamId` không
   - Gọi API `/chi-tiet-san-pham/hien-thi-theo-san-pham/{sanPhamId}`
   - Lấy chi tiết đầu tiên làm thông tin chính
   - Cập nhật giá, tồn kho, trạng thái

### 2. Hiển thị thông tin:
- Thông tin chi tiết hiển thị trong khung màu xanh
- Trạng thái có màu sắc phân biệt:
  - 🟢 Hoạt động (1)
  - ⚫ Không hoạt động (0)
  - 🟡 Tạm ngưng (2)
  - 🔴 Hết hàng (3)

### 3. Error handling:
- Nếu API lỗi: fallback về dữ liệu gốc
- Nếu không có `sanPhamId`: thử API cũ
- Log chi tiết để debug

## Test API

### 1. Test trực tiếp:
Mở file `test-product-details.html` trong browser:
```
file:///C:/Users/FPTShop/Downloads/trangchu/trangchu/test-product-details.html
```

### 2. Test từ Checkout:
1. Thêm sản phẩm vào giỏ hàng (cần có `sanPhamId`)
2. Vào trang Checkout
3. Xem Console để thấy log API calls
4. Kiểm tra thông tin chi tiết hiển thị

## Lợi ích

1. **Thông tin chi tiết**: Hiển thị đầy đủ thông tin sản phẩm
2. **Giá chính xác**: Lấy giá từ API thực
3. **Tồn kho thực**: Hiển thị số lượng tồn kho chính xác
4. **Trạng thái sản phẩm**: Biết sản phẩm có còn bán không
5. **Debug dễ dàng**: Log chi tiết để troubleshoot

## Cấu trúc dữ liệu trong Cart Item

Sau khi cập nhật, mỗi item trong giỏ hàng sẽ có:
```javascript
{
  // Thông tin cơ bản
  id: "product_id",
  name: "Tên sản phẩm",
  price: 1000000,
  originalPrice: 1200000,
  quantity: 2,
  
  // Thông tin chi tiết từ API
  chiTietSanPhamId: 123,
  kichCoId: 1,
  mauSacId: 2,
  giaTien: 1000000,
  tienGiamGia: 200000,
  soLuongTon: 50,
  trangThai: 1,
  ngayCapNhat: "2025-09-19",
  
  // Thông tin khác
  sanPhamId: 456,
  image: "path/to/image.jpg",
  brand: "Nike"
}
```

## Troubleshooting

### Nếu không thấy thông tin chi tiết:
1. Kiểm tra Console có log lỗi không
2. Kiểm tra sản phẩm có `sanPhamId` không
3. Test API trực tiếp với `test-product-details.html`
4. Kiểm tra backend có chạy không

### Nếu giá không cập nhật:
1. Kiểm tra API `/chi-tiet-san-pham/hien-thi-theo-san-pham/{id}` có hoạt động không
2. Kiểm tra dữ liệu trả về có đúng format không
3. Xem log trong Console để debug
