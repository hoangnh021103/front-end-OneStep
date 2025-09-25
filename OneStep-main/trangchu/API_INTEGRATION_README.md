# Tích hợp API lấy giá sản phẩm vào Checkout

## Tổng quan
Đã tích hợp thành công API để lấy giá sản phẩm thực từ backend vào trang Checkout thay vì sử dụng dữ liệu tĩnh.

## Các thay đổi đã thực hiện

### 1. Tạo ProductService (`src/services/productService.js`)
- **Chức năng chính:**
  - `getAllProducts()`: Lấy danh sách tất cả sản phẩm từ API
  - `getProductById(productId)`: Lấy thông tin chi tiết sản phẩm theo ID
  - `getProductPrice(productId)`: Lấy giá sản phẩm theo ID
  - `getCartItemsWithUpdatedPrices(cartItems)`: Cập nhật giá sản phẩm trong giỏ hàng từ API
  - `normalizeProducts()` và `normalizeProduct()`: Chuẩn hóa dữ liệu từ API

- **Tính năng:**
  - Xử lý lỗi API gracefully
  - Fallback về dữ liệu gốc nếu API lỗi
  - Chuẩn hóa dữ liệu từ nhiều format API khác nhau
  - Xây dựng URL hình ảnh tự động

### 2. Cập nhật Checkout.vue
- **Dữ liệu mới:**
  - `isLoadingPrices`: Trạng thái loading khi cập nhật giá
  - `updatedCartItems`: Danh sách sản phẩm với giá đã cập nhật từ API
  - `priceError`: Thông báo lỗi khi không thể cập nhật giá

- **Computed properties:**
  - `displayCartItems`: Sử dụng dữ liệu đã cập nhật hoặc dữ liệu gốc
  - `updatedCartTotal`: Tính tổng tiền từ dữ liệu đã cập nhật

- **Methods mới:**
  - `loadUpdatedPrices()`: Load giá từ API khi component mount
  - `refreshPrices()`: Refresh giá thủ công

- **UI cải tiến:**
  - Loading spinner khi đang cập nhật giá
  - Error message với nút "Thử lại" khi API lỗi
  - Indicator "Giá đã cập nhật" cho từng sản phẩm
  - Hiển thị giá gốc (gạch ngang) nếu có giảm giá
  - Thông báo "Giá sản phẩm đã được cập nhật từ hệ thống"

## Cách hoạt động

1. **Khi vào trang Checkout:**
   - Component tự động gọi `loadUpdatedPrices()` trong `mounted()`
   - Hiển thị loading spinner trong khi đang cập nhật giá
   - Nếu thành công: cập nhật `updatedCartItems` với giá mới từ API
   - Nếu lỗi: hiển thị error message và fallback về dữ liệu gốc

2. **Hiển thị giá:**
   - Sử dụng `displayCartItems` thay vì `cartItems` gốc
   - Tính tổng tiền từ `updatedCartTotal` thay vì `cartTotal`
   - Hiển thị indicator khi giá đã được cập nhật

3. **Error handling:**
   - Nếu API lỗi, vẫn hiển thị dữ liệu gốc để không làm gián đoạn trải nghiệm người dùng
   - Cung cấp nút "Thử lại" để refresh giá
   - Log lỗi chi tiết để debug

## API Endpoints được sử dụng

- `GET /san-pham/hien-thi`: Lấy danh sách sản phẩm
- `GET /san-pham/{id}`: Lấy thông tin chi tiết sản phẩm
- `GET /san-pham/{id}/gia`: Lấy giá sản phẩm (nếu có endpoint riêng)

## Cấu hình API

API được cấu hình trong:
- `main.js`: Base URL và credentials
- `vue.config.js`: Proxy configuration cho development

## Lợi ích

1. **Giá chính xác:** Luôn hiển thị giá mới nhất từ hệ thống
2. **UX tốt:** Loading states và error handling không làm gián đoạn trải nghiệm
3. **Fallback:** Vẫn hoạt động ngay cả khi API lỗi
4. **Visual feedback:** Người dùng biết khi nào giá được cập nhật
5. **Maintainable:** Code được tổ chức tốt với service layer riêng biệt

## Cách test

1. Thêm sản phẩm vào giỏ hàng
2. Vào trang Checkout
3. Quan sát loading spinner và giá được cập nhật
4. Test error case bằng cách tắt backend server
5. Sử dụng nút "Thử lại" khi có lỗi
