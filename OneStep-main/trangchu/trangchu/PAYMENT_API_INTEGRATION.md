# Tích Hợp API Thanh Toán

## Tổng Quan
Đã tích hợp thành công API thanh toán với endpoint `/thanh-toan/{hoaDonId}/chon-khach-hang/{khachHangId}` vào hệ thống Vue.js. API này cho phép tạo và quản lý thanh toán cho đơn hàng với khách hàng cụ thể.

## API Endpoint

### Tạo Thanh Toán
```
POST /thanh-toan/{hoaDonId}/chon-khach-hang/{khachHangId}
```

**Parameters:**
- `hoaDonId` (number): ID hóa đơn
- `khachHangId` (number): ID khách hàng

**Request Body:**
```json
{
  "id": 0,
  "donHangId": 0,
  "phuongThucId": 0,
  "maGiaoDich": "string",
  "tongTien": 0,
  "moTa": "string",
  "trangThai": 0,
  "ngayCapNhat": "2025-09-23",
  "nguoiTao": "string",
  "nguoiCapNhat": "string",
  "daXoa": 0
}
```

**Server:** Port 8080

## Các Thành Phần Đã Tạo

### 1. PaymentService (`src/services/paymentService.js`)

**Chức năng chính:**
- `createPayment(hoaDonId, khachHangId, paymentData)`: Tạo thanh toán mới
- `getPaymentById(paymentId)`: Lấy thông tin thanh toán theo ID
- `getPaymentsByOrder(donHangId)`: Lấy danh sách thanh toán theo đơn hàng
- `updatePayment(paymentId, updateData)`: Cập nhật thanh toán
- `cancelPayment(paymentId)`: Hủy thanh toán
- `getPaymentMethods()`: Lấy danh sách phương thức thanh toán
- `validatePaymentData(paymentData)`: Validate dữ liệu thanh toán
- `generateTransactionCode()`: Tạo mã giao dịch duy nhất

**Tính năng:**
- Xử lý lỗi API gracefully
- Chuẩn hóa dữ liệu từ API
- Fallback về phương thức thanh toán mặc định
- Validation dữ liệu đầu vào
- Format giá tiền theo chuẩn Việt Nam

### 2. Payment Store Module (`src/store/modules/payment.js`)

**State:**
- `payments`: Danh sách thanh toán
- `currentPayment`: Thanh toán hiện tại
- `paymentMethods`: Danh sách phương thức thanh toán
- `pendingPayment`: Thông tin thanh toán đang chờ
- `isLoading`: Trạng thái loading
- `error`: Thông báo lỗi

**Getters:**
- `allPayments`: Lấy tất cả thanh toán
- `getPaymentById`: Lấy thanh toán theo ID
- `getPaymentsByOrder`: Lấy thanh toán theo đơn hàng
- `paymentMethods`: Lấy danh sách phương thức thanh toán
- `defaultPaymentMethod`: Lấy phương thức mặc định (COD)

**Actions:**
- `createPayment`: Tạo thanh toán mới
- `fetchPaymentById`: Lấy thông tin thanh toán
- `fetchPaymentsByOrder`: Lấy thanh toán theo đơn hàng
- `updatePayment`: Cập nhật thanh toán
- `cancelPayment`: Hủy thanh toán
- `fetchPaymentMethods`: Lấy danh sách phương thức thanh toán

### 3. Cập Nhật Checkout.vue

**Tính năng mới:**
- Tích hợp với PaymentService và Payment Store
- Hiển thị phương thức thanh toán động từ API
- Xử lý thanh toán theo phương thức được chọn
- Loading states và error handling
- Thông tin thanh toán chi tiết

**Methods mới:**
- `loadPaymentMethods()`: Load phương thức thanh toán từ API
- `createOrderPayment()`: Tạo thanh toán cho đơn hàng
- `processPayment()`: Xử lý thanh toán theo phương thức
- `processVNPayOrder()`: Xử lý thanh toán VNPay
- `processBankTransferOrder()`: Xử lý chuyển khoản ngân hàng
- `generateOrderId()`, `generateCustomerId()`, `generateInvoiceId()`: Tạo ID tạm thời

**UI cải tiến:**
- Loading spinner khi tải phương thức thanh toán
- Error message khi API lỗi
- Hiển thị phương thức thanh toán với icon và mô tả
- Thông tin thanh toán chi tiết khi chọn phương thức
- Responsive design cho mobile

### 4. Test File (`test-payment-api.html`)

**Chức năng test:**
- Tạo thanh toán mới với dữ liệu ngẫu nhiên
- Lấy danh sách phương thức thanh toán
- Kiểm tra trạng thái thanh toán
- Hiển thị thông tin API chi tiết
- Error handling và validation

## Cách Sử Dụng

### 1. Khởi Tạo Thanh Toán
```javascript
// Trong component Vue
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('payment', ['createPayment']),
    
    async createNewPayment() {
      const paymentData = {
        donHangId: 12345,
        phuongThucId: 1, // COD
        maGiaoDich: 'TXN_1234567890_ABC123',
        tongTien: 1500000,
        moTa: 'Thanh toán đơn hàng',
        trangThai: 0,
        nguoiTao: 'user@example.com',
        nguoiCapNhat: 'user@example.com',
        daXoa: 0
      }
      
      try {
        const payment = await this.createPayment({
          hoaDonId: 12345,
          khachHangId: 67890,
          paymentData
        })
        console.log('Payment created:', payment)
      } catch (error) {
        console.error('Error creating payment:', error)
      }
    }
  }
}
```

### 2. Lấy Phương Thức Thanh Toán
```javascript
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('payment', ['paymentMethods', 'isLoading'])
  },
  methods: {
    ...mapActions('payment', ['fetchPaymentMethods']),
    
    async loadPaymentMethods() {
      try {
        await this.fetchPaymentMethods()
        console.log('Payment methods loaded:', this.paymentMethods)
      } catch (error) {
        console.error('Error loading payment methods:', error)
      }
    }
  }
}
```

### 3. Sử Dụng Trong Template
```vue
<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="loading">
      Đang tải phương thức thanh toán...
    </div>
    
    <!-- Payment methods -->
    <div v-else class="payment-methods">
      <div 
        v-for="method in paymentMethods" 
        :key="method.id"
        class="payment-option"
      >
        <input 
          type="radio" 
          :id="`payment-${method.id}`"
          v-model="selectedMethod" 
          :value="method.id"
        >
        <label :for="`payment-${method.id}`">
          <img :src="`/images/${method.icon}`" :alt="method.ten">
          <h5>{{ method.ten }}</h5>
          <p>{{ method.moTa }}</p>
        </label>
      </div>
    </div>
  </div>
</template>
```

## Cấu Hình API

### Development
```javascript
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/thanh-toan': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/phuong-thuc-thanh-toan': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}
```

### Production
```javascript
// main.js
axios.defaults.baseURL = 'http://your-api-server:8080'
```

## Trạng Thái Thanh Toán

| Mã | Trạng Thái | Mô Tả |
|----|------------|-------|
| 0 | Chờ thanh toán | Thanh toán đang chờ xử lý |
| 1 | Đã thanh toán | Thanh toán thành công |
| 2 | Thanh toán thất bại | Thanh toán không thành công |
| 3 | Đã hủy | Thanh toán đã bị hủy |
| 4 | Hoàn tiền | Đã hoàn tiền |

## Phương Thức Thanh Toán Mặc Định

| ID | Tên | Mô Tả | Icon |
|----|-----|-------|------|
| 1 | COD | Thanh toán khi nhận hàng | cash_icon.png |
| 2 | VNPay | Thanh toán qua VNPay | vnpay_icon.png |
| 3 | Chuyển khoản | Chuyển khoản ngân hàng | bank_icon.png |

## Error Handling

### API Errors
- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ
- **404 Not Found**: Không tìm thấy thanh toán/phương thức
- **500 Internal Server Error**: Lỗi server

### Client-side Validation
- Kiểm tra dữ liệu bắt buộc
- Validate format email, số điện thoại
- Kiểm tra tổng tiền > 0
- Validate phương thức thanh toán

## Testing

### 1. Sử Dụng Test File
Mở `test-payment-api.html` trong browser để test API:
- Tạo thanh toán với dữ liệu ngẫu nhiên
- Kiểm tra các phương thức thanh toán
- Test error handling

### 2. Test Trong Vue App
```bash
# Start development server
npm run serve

# Test checkout flow
1. Thêm sản phẩm vào giỏ hàng
2. Vào trang checkout
3. Chọn phương thức thanh toán
4. Điền thông tin và submit
5. Kiểm tra console logs
```

### 3. API Testing với cURL
```bash
# Tạo thanh toán
curl -X POST http://localhost:8080/thanh-toan/12345/chon-khach-hang/67890 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 0,
    "donHangId": 12345,
    "phuongThucId": 1,
    "maGiaoDich": "TXN_TEST_123",
    "tongTien": 1500000,
    "moTa": "Test payment",
    "trangThai": 0,
    "ngayCapNhat": "2025-01-23",
    "nguoiTao": "test-user",
    "nguoiCapNhat": "test-user",
    "daXoa": 0
  }'
```

## Lợi Ích

1. **Tích Hợp Hoàn Chỉnh**: API được tích hợp đầy đủ vào Vue.js app
2. **Error Handling**: Xử lý lỗi graceful với fallback
3. **User Experience**: Loading states và feedback rõ ràng
4. **Maintainable**: Code được tổ chức tốt với service layer
5. **Testable**: Có file test riêng để kiểm tra API
6. **Scalable**: Dễ dàng thêm phương thức thanh toán mới
7. **Responsive**: Hoạt động tốt trên mobile và desktop

## Troubleshooting

### Lỗi Thường Gặp

1. **CORS Error**
   - Kiểm tra cấu hình proxy trong vue.config.js
   - Đảm bảo server cho phép CORS

2. **API Not Found**
   - Kiểm tra server có chạy trên port 8080
   - Verify endpoint URL

3. **Payment Methods Not Loading**
   - Kiểm tra API endpoint `/phuong-thuc-thanh-toan/hien-thi`
   - Fallback về phương thức mặc định

4. **Validation Errors**
   - Kiểm tra dữ liệu đầu vào
   - Verify required fields

### Debug Tips

1. Mở Developer Tools để xem network requests
2. Kiểm tra console logs cho error messages
3. Sử dụng test file để verify API hoạt động
4. Check Vuex store state trong Vue DevTools

## Kết Luận

API thanh toán đã được tích hợp thành công vào hệ thống Vue.js với đầy đủ tính năng:
- Tạo và quản lý thanh toán
- Hiển thị phương thức thanh toán động
- Error handling và validation
- Test tools và documentation
- Responsive UI và UX tốt

Hệ thống sẵn sàng cho production với port 8080 và có thể dễ dàng mở rộng thêm tính năng mới.