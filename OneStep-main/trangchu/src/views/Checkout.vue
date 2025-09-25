<template>
  <div>
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <div class="container">
        <div class="row">
          <div class="col">
            <p class="bread">
              <span><router-link to="/">Trang chủ</router-link></span> / 
              <span><router-link to="/cart">Giỏ hàng</router-link></span> / 
              <span>Thanh toán</span>
            </p>
          </div>
        </div>
      </div>
    </div>
 
    <!-- Checkout Section -->
    <div class="colorlib-product">
      <div class="container">
        <!-- Process Steps -->
        <div class="row row-pb-lg">
          <div class="col-md-10 offset-md-1">
            <div class="process-wrap">
              <div class="process text-center completed">
                <div class="process-icon">
                  <i class="icon-check"></i>
                </div>
                <div class="process-content">
                  <span class="process-number">01</span>
                  <h3>Giỏ hàng</h3>
                  <p class="process-desc">Chọn sản phẩm</p>
                </div>
              </div>
              <div class="process text-center active">
                <div class="process-icon">
                  <i class="icon-credit-card"></i>
                </div>
                <div class="process-content">
                  <span class="process-number">02</span>
                  <h3>Thanh toán</h3>
                  <p class="process-desc">Thông tin & thanh toán</p>
                </div>
              </div>
              <div class="process text-center pending">
                <div class="process-icon">
                  <i class="icon-check-circle"></i>
                </div>
                <div class="process-content">
                  <span class="process-number">03</span>
                  <h3>Hoàn tất</h3>
                  <p class="process-desc">Đặt hàng thành công</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row" v-if="cartItems.length > 0">
          <!-- Checkout Form -->
          <div class="col-md-8">
            <div class="checkout-form">
              <h3>Thông tin thanh toán</h3>
              
              <form @submit.prevent="submitOrder">
                <!-- Customer Information -->
                <div class="form-section">
                  <h4>Thông tin khách hàng</h4>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="firstName">Họ *</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          v-model="form.firstName"
                          class="form-control" 
                          required
                          :class="{ 'is-invalid': errors.firstName }"
                        >
                        <div v-if="errors.firstName" class="invalid-feedback">{{ errors.firstName }}</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="lastName">Tên *</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          v-model="form.lastName"
                          class="form-control" 
                          required
                          :class="{ 'is-invalid': errors.lastName }"
                        >
                        <div v-if="errors.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="email">Email *</label>
                        <input 
                          type="email" 
                          id="email" 
                          v-model="form.email"
                          class="form-control" 
                          required
                          :class="{ 'is-invalid': errors.email }"
                        >
                        <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="phone">Số điện thoại *</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          v-model="form.phone"
                          class="form-control" 
                          required
                          :class="{ 'is-invalid': errors.phone }"
                        >
                        <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Shipping Address -->
                <div class="form-section">
                  <h4>Địa chỉ giao hàng</h4>
                  
                  <!-- Tỉnh/Thành phố -->
                  <div class="form-group">
                    <label for="province">Tỉnh/Thành phố *</label>
                    <select 
                      id="province" 
                      v-model="form.province"
                      class="form-control" 
                      required
                      :class="{ 'is-invalid': errors.province }"
                      @change="onProvinceChange"
                      :disabled="isLoadingProvinces"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      <option 
                        v-for="province in provinces" 
                        :key="province.code" 
                        :value="province.code"
                      >
                        {{ province.name }}
                      </option>
                    </select>
                    <div v-if="errors.province" class="invalid-feedback">{{ errors.province }}</div>
                    <div v-if="isLoadingProvinces" class="loading-text">
                      <i class="icon-spinner"></i> Đang tải tỉnh/thành phố...
                    </div>
                  </div>
                  
                  <!-- Quận/Huyện -->
                  <div class="form-group">
                    <label for="district">Quận/Huyện *</label>
                    <select 
                      id="district" 
                      v-model="form.district"
                      class="form-control" 
                      required
                      :class="{ 'is-invalid': errors.district }"
                      @change="onDistrictChange"
                      :disabled="!form.province || isLoadingDistricts"
                    >
                      <option value="">Chọn quận/huyện</option>
                      <option 
                        v-for="district in districts" 
                        :key="district.code" 
                        :value="district.code"
                      >
                        {{ district.name }}
                      </option>
                    </select>
                    <div v-if="errors.district" class="invalid-feedback">{{ errors.district }}</div>
                    <div v-if="isLoadingDistricts" class="loading-text">
                      <i class="icon-spinner"></i> Đang tải quận/huyện...
                    </div>
                  </div>
                  
                  <!-- Phường/Xã -->
                  <div class="form-group">
                    <label for="ward">Phường/Xã *</label>
                    <select 
                      id="ward" 
                      v-model="form.ward"
                      class="form-control" 
                      required
                      :class="{ 'is-invalid': errors.ward }"
                      :disabled="!form.district || isLoadingWards"
                    >
                      <option value="">Chọn phường/xã</option>
                      <option 
                        v-for="ward in wards" 
                        :key="ward.code" 
                        :value="ward.code"
                      >
                        {{ ward.name }}
                      </option>
                    </select>
                    <div v-if="errors.ward" class="invalid-feedback">{{ errors.ward }}</div>
                    <div v-if="isLoadingWards" class="loading-text">
                      <i class="icon-spinner"></i> Đang tải phường/xã...
                    </div>
                  </div>
                  
                  <!-- Địa chỉ chi tiết -->
                  <div class="form-group">
                    <label for="address">Địa chỉ chi tiết *</label>
                    <input 
                      type="text" 
                      id="address" 
                      v-model="form.address"
                      class="form-control" 
                      required
                      :class="{ 'is-invalid': errors.address }"
                      placeholder="Số nhà, tên đường..."
                    >
                    <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}</div>
                  </div>
                  
                  <!-- Hiển thị địa chỉ đầy đủ -->
                  <div v-if="fullAddress" class="address-preview">
                    <div class="preview-label">
                      <i class="icon-map-marker"></i>
                      <span>Địa chỉ giao hàng:</span>
                    </div>
                    <div class="preview-address">{{ fullAddress }}</div>
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="form-section">
                  <h4>Phương thức thanh toán</h4>
                  
                  <!-- Loading state -->
                  <div v-if="isLoading" class="payment-loading">
                    <div class="loading-spinner">
                      <i class="icon-spinner"></i>
                      <span>Đang tải phương thức thanh toán...</span>
                    </div>
                  </div>
                  
                  <!-- Error state -->
                  <div v-if="error && !isLoading && !isCreatingPayment && !hasCurrentPayment" class="payment-error">
                    <div class="error-message">
                      <i class="icon-warning"></i>
                      <span>{{ error }}</span>
                      <button @click="clearPaymentError" class="btn btn-sm btn-outline-primary ms-2">
                        <i class="icon-close"></i> Đóng
                      </button>
                    </div>
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
                        v-model="form.paymentMethod" 
                        :value="method.id.toString()"
                        class="payment-radio"
                        :disabled="!method.isActive"
                      >
                      <label :for="`payment-${method.id}`" class="payment-label" :class="{ disabled: !method.isActive }">
                        <div class="payment-icon">
                          <img 
                            v-if="method.icon && method.icon.includes('.png')"
                            :src="`/images/${method.icon}`" 
                            :alt="method.ten"
                            style="width: 40px; height: 40px;"
                            @error="handleImageError"
                          >
                          <i v-else class="icon-cash"></i>
                        </div>
                        <div class="payment-info">
                          <h5>{{ method.ten }}</h5>
                          <p>{{ method.moTa }}</p>
                          <div v-if="method.phiDichVu > 0" class="service-fee">
                            Phí dịch vụ: {{ formatPrice(method.phiDichVu) }}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <!-- Selected payment method info -->
                  <div v-if="selectedPaymentMethod" class="selected-payment-info">
                    <div class="info-card">
                      <h6>Thông tin thanh toán:</h6>
                      <p><strong>Phương thức:</strong> {{ selectedPaymentMethod.ten }}</p>
                      <p><strong>Tổng tiền:</strong> {{ formatPrice(finalTotal) }}</p>
                      <p v-if="selectedPaymentMethod.phiDichVu > 0">
                        <strong>Phí dịch vụ:</strong> {{ formatPrice(selectedPaymentMethod.phiDichVu) }}
                      </p>
                      <p><strong>Tổng cộng:</strong> {{ formatPrice(finalTotal + (selectedPaymentMethod.phiDichVu || 0)) }}</p>
                    </div>
                  </div>
                  
                  <!-- Payment success info - chỉ hiển thị khi đã thanh toán thành công -->
                  <div v-if="hasCurrentPayment && currentPayment.trangThai === 1" class="payment-success-info">
                    <div class="success-card">
                      <h6><i class="icon-check"></i> Thanh toán thành công!</h6>
                      <p><strong>Mã giao dịch:</strong> {{ currentPayment.maGiaoDich }}</p>
                      <p><strong>Trạng thái:</strong> {{ currentPayment.trangThaiText }}</p>
                      <p><strong>Phương thức:</strong> {{ getPaymentMethodName(currentPayment.phuongThucId) }}</p>
                      <p v-if="currentPayment.isMock" class="mock-notice">
                        <i class="icon-info"></i> Đang sử dụng chế độ offline
                      </p>
                    </div>
                  </div>
                  
                  <!-- Payment pending info - hiển thị khi đang chờ thanh toán -->
                  <div v-else-if="hasCurrentPayment && currentPayment.trangThai === 0" class="payment-pending-info">
                    <div class="pending-card">
                      <h6><i class="icon-clock"></i> Đang chờ thanh toán</h6>
                      <p><strong>Mã giao dịch:</strong> {{ currentPayment.maGiaoDich }}</p>
                      <p><strong>Trạng thái:</strong> {{ currentPayment.trangThaiText }}</p>
                      <p><strong>Phương thức:</strong> {{ getPaymentMethodName(currentPayment.phuongThucId) }}</p>
                      <p v-if="currentPayment.isMock" class="mock-notice">
                        <i class="icon-info"></i> Đang sử dụng chế độ offline
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Order Notes -->
                <div class="form-section">
                  <h4>Ghi chú đơn hàng</h4>
                  <div class="form-group">
                    <textarea 
                      v-model="form.notes"
                      class="form-control" 
                      rows="4"
                      placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                    ></textarea>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="form-actions">
                  <router-link to="/cart" class="btn btn-outline-secondary btn-lg">
                    <i class="icon-arrow-left"></i> Quay lại giỏ hàng
                  </router-link>
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isSubmitting ? 'Đang xử lý...' : 'Đặt hàng ngay' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="col-md-4">
            <div class="order-summary">
              <h3>Tóm tắt đơn hàng</h3>
              
              <!-- Price Loading State -->
              <div v-if="isLoadingPrices" class="price-loading">
                <div class="loading-spinner">
                  <i class="icon-spinner"></i>
                  <span>Đang cập nhật giá sản phẩm...</span>
                </div>
              </div>
              
              <!-- Price Error State -->
              <div v-if="priceError" class="price-error">
                <div class="error-message">
                  <i class="icon-warning"></i>
                  <span>{{ priceError }}</span>
                  <button @click="refreshPrices" class="btn btn-sm btn-outline-primary">
                    Thử lại
                  </button>
                </div>
              </div>
              
              <!-- Debug Price State -->
              <div v-if="updatedCartTotal === 0 && cartItems.length > 0" class="price-debug">
                <div class="debug-message">
                  <i class="icon-info"></i>
                  <span>Giá sản phẩm không hiển thị đúng</span>
                  <button @click="debugAndFixPrices" class="btn btn-sm btn-outline-warning">
                    Sửa giá
                  </button>
                </div>
              </div>
              
              <!-- Order Items -->
              <div class="order-items">
                <div 
                  v-for="item in displayCartItems" 
                  :key="item.id" 
                  class="order-item"
                >
                  <div class="item-image">
                    <img :src="item.image" :alt="item.name">
                  </div>
                  <div class="item-details">
                    <h5>{{ item.name }}</h5>
                    <p class="item-brand">{{ item.brand }}</p>
                    <div class="item-quantity">Số lượng: {{ item.quantity }}</div>
                    
                    <!-- Thông tin chi tiết sản phẩm -->
                    <div v-if="item.chiTietSanPhamId" class="product-details">
                      <div class="detail-row">
                        <span class="detail-label">Mã chi tiết:</span>
                        <span class="detail-value">{{ item.chiTietSanPhamId }}</span>
                      </div>
                      <div v-if="item.kichCoId" class="detail-row">
                        <span class="detail-label">Kích cỡ ID:</span>
                        <span class="detail-value">{{ item.kichCoId }}</span>
                      </div>
                      <div v-if="item.mauSacId" class="detail-row">
                        <span class="detail-label">Màu sắc ID:</span>
                        <span class="detail-value">{{ item.mauSacId }}</span>
                      </div>
                      <div v-if="item.soLuongTon !== undefined" class="detail-row">
                        <span class="detail-label">Tồn kho:</span>
                        <span class="detail-value">{{ item.soLuongTon }} sản phẩm</span>
                      </div>
                      <div v-if="item.trangThai !== undefined" class="detail-row">
                        <span class="detail-label">Trạng thái:</span>
                        <span class="detail-value" :class="getStatusClass(item.trangThai)">
                          {{ getStatusText(item.trangThai) }}
                        </span>
                      </div>
                      <div v-if="item.ngayCapNhat" class="detail-row">
                        <span class="detail-label">Cập nhật:</span>
                        <span class="detail-value">{{ formatDate(item.ngayCapNhat) }}</span>
                      </div>
                    </div>
                    
                  </div>
                  <div class="item-price">
                    {{ formatPrice(getItemPrice(item) * item.quantity) }}
                    <!-- Show original price if different -->
                    <div v-if="item.originalPrice && item.originalPrice > getItemPrice(item)" class="original-price">
                      <small>{{ formatPrice(item.originalPrice * item.quantity) }}</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Order Totals -->
              <div class="order-totals">
                <div class="total-row">
                  <span>Tạm tính:</span>
                  <span>{{ formatPrice(updatedCartTotal) }}</span>
                </div>
                <div class="total-row">
                  <span>Phí vận chuyển:</span>
                  <span>{{ formatPrice(shippingFee) }}</span>
                </div>
                <div class="total-row total">
                  <span><strong>Tổng cộng:</strong></span>
                  <span><strong>{{ formatPrice(updatedCartTotal + shippingFee) }}</strong></span>
                </div>
              </div>
              
              <!-- Shipping Info -->
              <div class="shipping-info">
                <h4>Thông tin giao hàng</h4>
                <p><i class="icon-truck"></i> Giao hàng trong 1-3 ngày làm việc</p>
                <p><i class="icon-shield"></i> Đảm bảo chất lượng sản phẩm</p>
                <p><i class="icon-undo"></i> Đổi trả miễn phí trong 7 ngày</p>
                <div class="shipping-fee-info">
                  <h5>Phí vận chuyển:</h5>
                  <ul>
                    <li><strong>Hà Nội:</strong> 30.000 ₫</li>
                    <li><strong>Các tỉnh khác:</strong> 50.000 ₫</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty Cart -->
        <div v-else class="row">
          <div class="col-12 text-center">
            <div class="empty-cart">
              <i class="icon-shopping-cart" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
              <h3>Giỏ hàng trống</h3>
              <p>Hãy thêm một số sản phẩm vào giỏ hàng trước khi thanh toán</p>
              <router-link to="/products" class="btn btn-primary btn-lg">Tiếp tục mua sắm</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VietQR Payment Modal -->
    <div v-if="showVietQRModal" class="modal-overlay" @click="closeVietQRModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Thanh toán VietQR</h3>
          <button @click="closeVietQRModal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div v-if="isGeneratingQR" class="qr-loading">
            <div class="loading-spinner">
              <i class="icon-spinner"></i>
              <span>Đang tạo mã QR...</span>
            </div>
          </div>
          
          <div v-else-if="vietQRData.qrUrl" class="qr-result">
            <div class="qr-info">
              <h4>Quét mã QR để thanh toán</h4>
              <p class="amount">Số tiền: <strong>{{ formatPrice(updatedCartTotal + shippingFee) }}</strong></p>
              <p class="account-info">
                <strong>{{ vietQRData.accountName }}</strong><br>
                {{ vietQRData.bankBin }} - {{ vietQRData.accountNo }}
              </p>
            </div>
            
            <div class="qr-code">
              <img :src="vietQRData.qrUrl" alt="VietQR Code" />
            </div>
            
            <div class="payment-steps">
              <h5>Hướng dẫn thanh toán:</h5>
              <ol>
                <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                <li>Chọn chức năng "Quét mã QR"</li>
                <li>Quét mã QR bên trên</li>
                <li>Kiểm tra thông tin và xác nhận thanh toán</li>
              </ol>
            </div>
            
            <div class="payment-actions">
              <button @click="completeVietQRPayment" class="btn btn-primary">
                <i class="icon-check"></i> Tôi đã thanh toán
              </button>
              <button @click="closeVietQRModal" class="btn btn-outline-secondary">
                Hủy thanh toán
              </button>
            </div>
          </div>
          
          <div v-else-if="vietQRError" class="qr-error">
            <div class="error-message">
              <i class="icon-warning"></i>
              <span>{{ vietQRError }}</span>
              <button @click="generateVietQR" class="btn btn-sm btn-outline-primary">
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import productService from '../services/productService'
import paymentService from '../services/paymentService'
import orderService from '../services/orderService'
import axios from 'axios'

export default {
  name: 'Checkout',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        paymentMethod: '1', // Default to COD
        notes: ''
      },
      errors: {},
      isSubmitting: false,
      isLoadingPrices: false,
      updatedCartItems: [],
      priceError: null,
      // VietQR data
      showVietQRModal: false,
      isGeneratingQR: false,
      vietQRError: null,
      vietQRData: {
        qrUrl: null,
        bankBin: '970422', // Default bank code
        accountNo: '1234567890', // Default account number
        accountName: 'OneStep Store' // Default account name
      },
      // Address dropdown data
      provinces: [],
      districts: [],
      wards: [],
      isLoadingProvinces: false,
      isLoadingDistricts: false,
      isLoadingWards: false
    }
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal']),
    ...mapGetters('payment', ['paymentMethods', 'isLoading', 'error', 'currentPayment']),
    
    // Sử dụng dữ liệu đã cập nhật từ API hoặc dữ liệu gốc
    displayCartItems() {
      if (this.updatedCartItems.length > 0) {
        // Kiểm tra và đảm bảo giá không bị 0
        return this.updatedCartItems.map(item => ({
          ...item,
          price: item.price || item.giaTien || 0
        }))
      }
      return this.cartItems
    },
    
    // Tính tổng tiền từ dữ liệu đã cập nhật
    updatedCartTotal() {
      const total = this.displayCartItems.reduce((total, item) => {
        // Ưu tiên giá từ updatedCartItems, sau đó từ cartItems gốc
        let itemPrice = item.price || item.giaTien || 0
        
        // Nếu giá vẫn là 0, thử lấy từ cart gốc
        if (itemPrice === 0 && this.cartItems.length > 0) {
          const originalItem = this.cartItems.find(cartItem => cartItem.id === item.id)
          if (originalItem) {
            itemPrice = originalItem.price || originalItem.giaTien || 0
          }
        }
        
        console.log(`💰 Item ${item.name}: price=${item.price}, giaTien=${item.giaTien}, finalPrice=${itemPrice}, quantity=${item.quantity}, total=${itemPrice * item.quantity}`)
        return total + (itemPrice * item.quantity)
      }, 0)
      console.log(`💰 Total cart: ${total}`)
      return total
    },
    
    shippingFee() {
      // Chỉ tính phí vận chuyển khi đã chọn tỉnh/thành phố
      if (!this.form.province) {
        return 0 // Chưa chọn địa chỉ
      }
      
      // Tính phí vận chuyển theo tỉnh/thành phố
      // Mã tỉnh Hà Nội: 01, TP.HCM: 79
      if (this.form.province === '01' || this.form.province === '79') {
        return 30000 // Hà Nội và TP.HCM: 30k
      } else {
        return 50000 // Các tỉnh khác: 50k
      }
    },
    
    // Tổng tiền cuối cùng
    finalTotal() {
      return this.updatedCartTotal + this.shippingFee
    },
    
    // Phương thức thanh toán được chọn
    selectedPaymentMethod() {
      return this.paymentMethods.find(method => method.id === this.form.paymentMethod) || null
    },
    
    // Kiểm tra có đang trong quá trình tạo thanh toán không
    isCreatingPayment() {
      return this.isSubmitting || this.isGeneratingQR
    },
    
    // Kiểm tra có thanh toán hiện tại không
    hasCurrentPayment() {
      return this.currentPayment && this.currentPayment.id
    },
    
    // Địa chỉ đầy đủ
    fullAddress() {
      if (!this.form.province) return ''
      const province = this.provinces.find(p => p.code === this.form.province)
      const district = this.districts.find(d => d.code === this.form.district)
      const ward = this.wards.find(w => w.code === this.form.ward)
      let address = ''
      if (ward) address += ward.name + ', '
      if (district) address += district.name + ', '
      if (province) address += province.name
      if (this.form.address) address = this.form.address + ', ' + address
      return address
    }
  },
  async mounted() {
    // Load updated prices from API when component mounts
    await this.loadUpdatedPrices()
    
    // Debug và sửa giá nếu cần
    this.debugAndFixPrices()
    
    // Load payment methods
    await this.loadPaymentMethods()
    
    // Load provinces for address dropdown
    await this.fetchProvinces()
  },
  
  methods: {
    ...mapActions('cart', ['clearCart']),
    ...mapActions('payment', ['createPayment', 'fetchPaymentMethods', 'setPendingPayment', 'updatePayment']),
    ...mapActions('order', ['setCurrentOrder']),
    ...mapActions('orders', ['createOrderFromCheckout']),
    
    // Load updated prices from API
    async loadUpdatedPrices() {
      if (this.cartItems.length === 0) return
      
      this.isLoadingPrices = true
      this.priceError = null
      
      try {
        this.updatedCartItems = await productService.getCartItemsWithUpdatedPrices(this.cartItems)
        console.log('Updated cart items with API prices:', this.updatedCartItems)
        
        // Kiểm tra xem có item nào có giá không
        const hasValidPrices = this.updatedCartItems.some(item => (item.price || item.giaTien || 0) > 0)
        if (!hasValidPrices) {
          console.warn('⚠️ API không trả về giá hợp lệ, sử dụng giá từ cart gốc')
          this.updatedCartItems = this.cartItems.map(item => ({
            ...item,
            price: item.price || item.giaTien || 0
          }))
        }
      } catch (error) {
        console.error('Error loading updated prices:', error)
        this.priceError = 'Không thể cập nhật giá sản phẩm. Vui lòng kiểm tra kết nối mạng.'
        // Fallback to original cart items
        this.updatedCartItems = this.cartItems.map(item => ({
          ...item,
          price: item.price || item.giaTien || 0
        }))
      } finally {
        this.isLoadingPrices = false
      }
    },
    
    // Refresh prices manually
    async refreshPrices() {
      await this.loadUpdatedPrices()
    },
    
    // Lấy giá của một item, với fallback logic
    getItemPrice(item) {
      let price = item.price || item.giaTien || 0
      
      // Nếu giá là 0, thử lấy từ cart gốc
      if (price === 0 && this.cartItems.length > 0) {
        const originalItem = this.cartItems.find(cartItem => cartItem.id === item.id)
        if (originalItem) {
          price = originalItem.price || originalItem.giaTien || 0
        }
      }
      
      return price
    },
    
    // Debug và sửa giá nếu cần
    debugAndFixPrices() {
      console.log('🔍 Debug cart items:')
      console.log('Original cart items:', this.cartItems)
      console.log('Updated cart items:', this.updatedCartItems)
      console.log('Display cart items:', this.displayCartItems)
      
      // Nếu tất cả giá đều là 0, sử dụng giá gốc từ cart
      const hasZeroPrices = this.displayCartItems.every(item => (item.price || item.giaTien || 0) === 0)
      if (hasZeroPrices && this.cartItems.length > 0) {
        console.log('⚠️ Tất cả giá đều là 0, sử dụng giá gốc từ cart')
        this.updatedCartItems = this.cartItems.map(item => ({
          ...item,
          price: item.price || item.giaTien || 0
        }))
      }
      
      // Kiểm tra và đảm bảo mỗi item có giá hợp lệ
      this.updatedCartItems = this.updatedCartItems.map(item => {
        const price = item.price || item.giaTien || 0
        if (price === 0 && this.cartItems.length > 0) {
          // Tìm item tương ứng trong cart gốc
          const originalItem = this.cartItems.find(cartItem => cartItem.id === item.id)
          if (originalItem && originalItem.price > 0) {
            console.log(`🔧 Sửa giá cho ${item.name}: ${price} -> ${originalItem.price}`)
            return { ...item, price: originalItem.price }
          }
        }
        return item
      })
    },
    
    // Lưu thông tin đơn hàng vào store
    async saveOrderInfo() {
      const orderData = {
        orderNumber: 'ORD' + Date.now().toString().slice(-6),
        orderDate: new Date().toISOString(),
        orderTotal: this.updatedCartTotal,
        shippingFee: this.shippingFee,
        finalTotal: this.finalTotal,
        paymentMethod: this.selectedPaymentMethod?.tenPhuongThuc || 'Thanh toán khi nhận hàng (COD)',
        customerInfo: {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          phone: this.form.phone,
          address: this.form.address,
          province: this.form.province,
          district: this.form.district,
          ward: this.form.ward,
          note: this.form.notes
        },
            items: this.displayCartItems.map(item => ({
              // Lưu cả id sản phẩm gốc và id chi tiết/biến thể (nếu có)
              id: item.id,
              chiTietSanPhamId: item.chiTietSanPhamId || item.variantId || item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              brand: item.brand
            })),
        paymentInfo: this.currentPayment ? {
          id: this.currentPayment.id,
          maGiaoDich: this.currentPayment.maGiaoDich,
          trangThai: this.currentPayment.trangThai,
          phuongThucId: this.currentPayment.phuongThucId
        } : null
      }
      
      console.log('💾 Lưu thông tin đơn hàng:', orderData)
      
      // Lưu vào order store (cũ)
      this.setCurrentOrder(orderData)
      
        // Tạo đơn hàng mới trong orders store và gửi về backend
        try {
          console.log('🚀 Starting order creation process...')
          
          // Lưu thông tin khách hàng vào localStorage để có thể tìm lại đơn hàng
          const customerEmail = orderData.customerInfo.email
          const customerPhone = orderData.customerInfo.phone
          
          if (customerEmail) {
            localStorage.setItem('userEmail', customerEmail)
            localStorage.setItem('email', customerEmail)
          }
          if (customerPhone) {
            localStorage.setItem('userPhone', customerPhone)
            localStorage.setItem('phone', customerPhone)
          }
          
          console.log('💾 Đã lưu thông tin khách hàng:', { customerEmail, customerPhone })
          
          // Gửi đơn hàng về backend trước
          const backendOrder = await orderService.createOrder({
            khachHangId: parseInt(localStorage.getItem('userId') || 0) || null,
            orderNumber: orderData.orderNumber, // Gửi mã đơn gốc
            maDon: orderData.orderNumber, // Gửi mã đơn gốc
            customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
            hoTen: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
            phoneNumber: orderData.customerInfo.phone || '',
            soDienThoai: orderData.customerInfo.phone || '',
            email: orderData.customerInfo.email || '',
            shippingAddress: this.fullAddress || '',
            diaChiGiaoHang: this.fullAddress || '',
            subtotal: parseFloat(orderData.orderTotal || 0),
            tongTienGoc: parseFloat(orderData.orderTotal || 0),
            shippingFee: parseFloat(orderData.shippingFee || 0),
            tienShip: parseFloat(orderData.shippingFee || 0),
            discount: 0,
            tienGiam: 0,
            totalAmount: parseFloat(orderData.finalTotal || 0),
            tongTien: parseFloat(orderData.finalTotal || 0),
            notes: orderData.customerInfo.note || '',
            ghiChu: orderData.customerInfo.note || '',
            items: orderData.items.map(item => ({
              id: parseInt(item.id || 0),
              chiTietSanPhamId: parseInt(item.id || 0),
              name: item.name || '',
              price: parseFloat(item.price || 0),
              donGia: parseFloat(item.price || 0),
              quantity: parseInt(item.quantity || 1),
              soLuong: parseInt(item.quantity || 1)
            })),
            chiTietDonHang: orderData.items.map(item => ({
              chiTietSanPhamId: parseInt(item.chiTietSanPhamId || item.variantId || item.id || 0),
              soLuong: parseInt(item.quantity || 1),
              donGia: parseFloat(item.price || 0),
              thanhTien: parseFloat((item.price || 0) * (item.quantity || 1))
            }))
          })
          console.log('✅ Đơn hàng đã được gửi về backend:', backendOrder)
        
        // Kiểm tra xem backend có trả về thành công không
        if (!backendOrder || !backendOrder.id) {
          throw new Error('Backend không trả về thông tin đơn hàng hợp lệ')
        }
        
        // Cập nhật orderData với thông tin từ backend
        orderData.backendId = backendOrder.id
        orderData.backendMaDon = backendOrder.maDon
        
        // Sau đó lưu vào store local
        await this.createOrderFromCheckout(orderData)
        console.log('✅ Đơn hàng mới đã được tạo thành công!')
        console.log('✅ Backend ID:', backendOrder.id, 'Mã đơn:', backendOrder.maDon)
        
      } catch (error) {
        console.error('❌ CRITICAL: Lỗi khi tạo đơn hàng trên backend:', error)
        console.error('❌ Error type:', error.constructor.name)
        console.error('❌ Error message:', error.message)
        
        // Show error to user
        if (this.$toast) {
          this.$toast.error(`Lỗi tạo đơn hàng: ${error.message}`)
        } else {
          alert(`Lỗi tạo đơn hàng: ${error.message}`)
        }
        
        // Don't proceed if backend fails - this is critical
        throw error
      }
    },
    
    async submitOrder() {
      this.validateForm()
      
      if (Object.keys(this.errors).length === 0) {
        this.isSubmitting = true
        
        try {
          // Sử dụng phương thức thanh toán mới
          await this.processPayment()
        } catch (error) {
          console.error('❌ Error in submitOrder:', error)
          this.isSubmitting = false
        }
      }
    },
    
    handleVietQRPayment() {
      // Xử lý thanh toán VietQR
      console.log('Processing VietQR payment...')
      
      // Hiển thị modal VietQR
      this.showVietQRModal = true
      this.generateVietQR()
    },
    
    async generateVietQR() {
      this.isGeneratingQR = true
      this.vietQRError = null
      
      try {
        const payload = {
          bankBin: this.vietQRData.bankBin,
          accountNo: this.vietQRData.accountNo,
          accountName: this.vietQRData.accountName,
          amount: this.finalTotal,
          addInfo: `Thanh toan don hang OneStep - ${new Date().toLocaleDateString('vi-VN')}`
        }
        
        console.log('Generating VietQR with payload:', payload)
        
        const response = await axios.post('http://localhost:8080/api/vietqr/generate', payload)
        
        if (response.data && response.data.qrUrl) {
          this.vietQRData.qrUrl = response.data.qrUrl
          console.log('VietQR generated successfully:', response.data.qrUrl)
        } else {
          throw new Error('Không thể tạo mã QR. Vui lòng thử lại.')
        }
        
      } catch (error) {
        console.error('Error generating VietQR:', error)
        this.vietQRError = error.response?.data?.message || error.message || 'Không thể tạo mã QR. Vui lòng thử lại.'
      } finally {
        this.isGeneratingQR = false
      }
    },
    
    async checkPaymentStatus() {
      // Kiểm tra trạng thái thanh toán - method này đã deprecated, sử dụng completeVietQRPayment thay thế
      console.log('⚠️ checkPaymentStatus is deprecated, using completeVietQRPayment instead')
      await this.completeVietQRPayment()
    },
    
    closeVietQRModal() {
      this.showVietQRModal = false
      this.vietQRData.qrUrl = null
      this.vietQRError = null
      this.isSubmitting = false
    },
    
    async processCODOrder() {
      // Xử lý đơn hàng COD
      console.log('Processing COD order...')
      
      try {
        // Hiển thị thông báo đang xử lý
        this.$toast?.success('Đang xử lý đơn hàng COD...')
        
        // Simulate order processing với delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Cập nhật trạng thái thanh toán thành công cho COD
        if (this.currentPayment) {
          if (this.currentPayment.isMock) {
            // Cập nhật mock payment trong store
            const updatedPayment = {
              ...this.currentPayment,
              trangThai: 1, // Đã thanh toán
              trangThaiText: 'Đã thanh toán',
              ngayCapNhat: new Date().toISOString().split('T')[0],
              nguoiCapNhat: this.form.email
            }
            this.$store.commit('payment/UPDATE_PAYMENT', updatedPayment)
            this.$store.commit('payment/SET_CURRENT_PAYMENT', updatedPayment)
            console.log('✅ Mock COD payment updated:', updatedPayment)
          } else {
            // Cập nhật payment thật qua API
            await this.updatePayment({
              paymentId: this.currentPayment.id,
              updateData: {
                trangThai: 1, // Đã thanh toán
                ngayCapNhat: new Date().toISOString().split('T')[0],
                nguoiCapNhat: this.form.email
              }
            })
          }
        }
        
        // Lưu thông tin đơn hàng vào store
        await this.saveOrderInfo()
        
        // Hoàn tất đơn hàng
        this.isSubmitting = false
        this.clearCart()
        
        // Chuyển đến trang hoàn tất
        this.$router.push('/order-complete')
        
      } catch (error) {
        console.error('❌ Error processing COD order:', error)
        this.$toast?.error('Có lỗi xảy ra khi xử lý đơn hàng')
        this.isSubmitting = false
      }
    },
    
    validateForm() {
      this.errors = {}
      
      if (!this.form.firstName.trim()) {
        this.errors.firstName = 'Vui lòng nhập họ'
      }
      
      if (!this.form.lastName.trim()) {
        this.errors.lastName = 'Vui lòng nhập tên'
      }
      
      if (!this.form.email.trim()) {
        this.errors.email = 'Vui lòng nhập email'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Email không hợp lệ'
      }
      
      if (!this.form.phone.trim()) {
        this.errors.phone = 'Vui lòng nhập số điện thoại'
      } else if (!this.isValidPhone(this.form.phone)) {
        this.errors.phone = 'Số điện thoại không hợp lệ'
      }
      
      if (!this.form.address.trim()) {
        this.errors.address = 'Vui lòng nhập địa chỉ chi tiết'
      }
      
      if (!this.form.province) {
        this.errors.province = 'Vui lòng chọn tỉnh/thành phố'
      }
      
      if (!this.form.district) {
        this.errors.district = 'Vui lòng chọn quận/huyện'
      }
      
      if (!this.form.ward) {
        this.errors.ward = 'Vui lòng chọn phường/xã'
      }
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    isValidPhone(phone) {
      const phoneRegex = /^[0-9]{10,11}$/
      return phoneRegex.test(phone.replace(/\s/g, ''))
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    
    // Xử lý thông tin chi tiết sản phẩm
    getStatusText(status) {
      const statusMap = {
        0: 'Không hoạt động',
        1: 'Hoạt động',
        2: 'Tạm ngưng',
        3: 'Hết hàng'
      }
      return statusMap[status] || 'Không xác định'
    },
    
    getStatusClass(status) {
      const classMap = {
        0: 'status-inactive',
        1: 'status-active',
        2: 'status-paused',
        3: 'status-out-of-stock'
      }
      return classMap[status] || 'status-unknown'
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      } catch (error) {
        return dateString
      }
    },
    
    // Payment-related methods
    async loadPaymentMethods() {
      try {
        await this.fetchPaymentMethods()
        console.log('✅ Payment methods loaded successfully')
      } catch (error) {
        console.error('❌ Error loading payment methods:', error)
      }
    },
    
    async createOrderPayment() {
      try {
        // Tạo mã giao dịch duy nhất
        const maGiaoDich = paymentService.generateTransactionCode()
        
        // Chuẩn bị dữ liệu thanh toán
        const paymentData = {
          id: 0,
          donHangId: parseInt(this.generateOrderId()), // Tạo ID đơn hàng tạm thời
          phuongThucId: parseInt(this.form.paymentMethod || 1),
          maGiaoDich: maGiaoDich,
          tongTien: parseFloat(this.finalTotal || 0),
          moTa: `Thanh toán đơn hàng - ${this.form.notes || 'Không có ghi chú'}`,
          trangThai: 0, // Chờ thanh toán
          ngayCapNhat: new Date().toISOString().split('T')[0],
          nguoiTao: this.form.email || 'Khách hàng',
          nguoiCapNhat: this.form.email || 'Khách hàng',
          daXoa: 0
        }
        
        // Tạo ID khách hàng tạm thời (trong thực tế sẽ lấy từ hệ thống auth)
        const khachHangId = this.generateCustomerId()
        
        // Tạo ID hóa đơn tạm thời
        const hoaDonId = this.generateInvoiceId()
        
        console.log('🔄 Creating payment with data:', {
          hoaDonId,
          khachHangId,
          paymentData,
          endpoint: `/thanh-toan/${hoaDonId}/chon-khach-hang/${khachHangId}`
        })
        
        // Validate dữ liệu trước khi gửi
        const validation = paymentService.validatePaymentData(paymentData)
        if (!validation.isValid) {
          throw new Error(`Dữ liệu thanh toán không hợp lệ: ${validation.errors.join(', ')}`)
        }
        
        // Thử gọi API tạo thanh toán
        try {
          const payment = await this.createPayment({
            hoaDonId,
            khachHangId,
            paymentData
          })
          
          console.log('✅ Payment created successfully via API:', payment)
          
          // Clear error sau khi tạo thanh toán thành công
          this.$store.commit('payment/CLEAR_ERROR')
          
          // Lưu thông tin thanh toán vào store
          this.setPendingPayment({
            donHangId: paymentData.donHangId,
            khachHangId: khachHangId,
            phuongThucId: paymentData.phuongThucId,
            tongTien: paymentData.tongTien,
            moTa: paymentData.moTa,
            maGiaoDich: paymentData.maGiaoDich
          })
          
          return payment
          
        } catch (apiError) {
          console.warn('⚠️ API call failed, creating mock payment:', apiError.message)
          
          // Fallback: Tạo thanh toán mock khi API không hoạt động
          const mockPayment = {
            id: Math.floor(Math.random() * 100000) + 10000,
            donHangId: paymentData.donHangId,
            phuongThucId: paymentData.phuongThucId,
            maGiaoDich: paymentData.maGiaoDich,
            tongTien: paymentData.tongTien,
            moTa: paymentData.moTa,
            trangThai: 0,
            ngayCapNhat: paymentData.ngayCapNhat,
            nguoiTao: paymentData.nguoiTao,
            nguoiCapNhat: paymentData.nguoiCapNhat,
            daXoa: 0,
            // Thông tin bổ sung
            trangThaiText: 'Chờ thanh toán',
            phuongThucText: paymentService.getPaymentMethodText(paymentData.phuongThucId),
            formattedTongTien: this.formatPrice(paymentData.tongTien),
            isActive: true,
            isMock: true // Đánh dấu đây là mock payment
          }
          
          console.log('✅ Mock payment created:', mockPayment)
          
          // Clear error sau khi tạo mock payment thành công
          this.$store.commit('payment/CLEAR_ERROR')
          
          // Lưu thông tin thanh toán vào store
          this.setPendingPayment({
            donHangId: paymentData.donHangId,
            khachHangId: khachHangId,
            phuongThucId: paymentData.phuongThucId,
            tongTien: paymentData.tongTien,
            moTa: paymentData.moTa,
            maGiaoDich: paymentData.maGiaoDich
          })
          
          // Thêm vào store như một payment thật
          this.$store.commit('payment/ADD_PAYMENT', mockPayment)
          this.$store.commit('payment/SET_CURRENT_PAYMENT', mockPayment)
          
          return mockPayment
        }
        
      } catch (error) {
        console.error('❌ Error creating payment:', error)
        this.$toast?.error(`Lỗi tạo thanh toán: ${error.message}`)
        throw error
      }
    },
    
    generateOrderId() {
      // Tạo ID đơn hàng tạm thời
      return Math.floor(Math.random() * 1000000) + 100000
    },
    
    generateCustomerId() {
      // Tạo ID khách hàng tạm thời
      return Math.floor(Math.random() * 100000) + 10000
    },
    
    generateInvoiceId() {
      // Tạo ID hóa đơn tạm thời
      return Math.floor(Math.random() * 1000000) + 200000
    },
    
    async processPayment() {
      try {
        // Tạo thanh toán trước
        const payment = await this.createOrderPayment()
        
        // Xử lý thanh toán theo phương thức được chọn
        if (this.form.paymentMethod === '1') {
          // COD - Thanh toán khi nhận hàng
          await this.processCODOrder()
        } else if (this.form.paymentMethod === '2') {
        // VietQR
        await this.processVietQROrder(payment)
        } else {
          throw new Error('Phương thức thanh toán không hợp lệ')
        }
        
      } catch (error) {
        console.error('❌ Error processing payment:', error)
        this.$toast?.error('Có lỗi xảy ra khi xử lý thanh toán: ' + error.message)
        this.isSubmitting = false
      }
    },
    
    async processVietQROrder(payment) {
      try {
        console.log('🔄 Processing VietQR order:', payment)

        // Tạo VietQR
        await this.generateVietQR()

        // Hiển thị modal VietQR
        this.showVietQRModal = true

      } catch (error) {
        console.error('❌ Error processing VietQR order:', error)
        throw error
      }
    },

    async completeVietQRPayment() {
      try {
        console.log('🔄 Completing VietQR payment...')

        // Cập nhật trạng thái thanh toán thành công cho VietQR
        if (this.currentPayment) {
          if (this.currentPayment.isMock) {
            // Cập nhật mock payment trong store
            const updatedPayment = {
              ...this.currentPayment,
              trangThai: 1, // Đã thanh toán
              trangThaiText: 'Đã thanh toán',
              ngayCapNhat: new Date().toISOString().split('T')[0],
              nguoiCapNhat: this.form.email
            }
            this.$store.commit('payment/UPDATE_PAYMENT', updatedPayment)
            this.$store.commit('payment/SET_CURRENT_PAYMENT', updatedPayment)
            console.log('✅ Mock VietQR payment updated:', updatedPayment)
          } else {
            // Cập nhật payment thật qua API
            await this.updatePayment({
              paymentId: this.currentPayment.id,
              updateData: {
                trangThai: 1, // Đã thanh toán
                ngayCapNhat: new Date().toISOString().split('T')[0],
                nguoiCapNhat: this.form.email
              }
            })
          }
        }

        // Lưu thông tin đơn hàng vào store và database
        await this.saveOrderInfo()

        // Hoàn tất đơn hàng
        this.isSubmitting = false
        this.showVietQRModal = false
        this.clearCart()

        // Chuyển đến trang hoàn tất
        this.$router.push('/order-complete')

      } catch (error) {
        console.error('❌ Error completing VietQR payment:', error)
        this.$toast?.error('Có lỗi xảy ra khi hoàn tất thanh toán')
        this.isSubmitting = false
      }
    },
    
    
    handleImageError(event) {
      // Fallback to default icon when image fails to load
      event.target.style.display = 'none'
      const iconElement = event.target.nextElementSibling
      if (iconElement && iconElement.classList.contains('icon-cash')) {
        iconElement.style.display = 'block'
      }
    },
    
    clearPaymentError() {
      // Clear error từ store
      this.$store.commit('payment/CLEAR_ERROR')
    },
    
    // Lấy tên phương thức thanh toán theo ID
    getPaymentMethodName(phuongThucId) {
      const method = this.paymentMethods.find(m => m.id === phuongThucId)
      if (method) {
        return method.ten
      }
      
      // Fallback theo ID
      switch (phuongThucId) {
        case 1:
          return 'Thanh toán khi nhận hàng (COD)'
        case 2:
          return 'VietQR'
        default:
          return 'Phương thức thanh toán'
      }
    },
    
    // Get city text from code  
    getCityText(city) {
      const cityMap = {
        'hanoi': 'Hà Nội',
        'hcm': 'TP. Hồ Chí Minh',
        'danang': 'Đà Nẵng',
        'haiphong': 'Hải Phòng',
        'cantho': 'Cần Thơ',
        'other': 'Tỉnh khác'
      }
      return cityMap[city] || 'Tỉnh khác'
    },
    
    // Address dropdown methods
    async fetchProvinces() {
      try {
        this.isLoadingProvinces = true
        const res = await fetch('https://provinces.open-api.vn/api/p/')
        const data = await res.json()
        this.provinces = data.map(p => ({ code: p.code.toString(), name: p.name }))
        console.log('✅ Provinces loaded:', this.provinces.length)
      } catch (error) {
        console.error('❌ Error loading provinces:', error)
        this.provinces = []
      } finally {
        this.isLoadingProvinces = false
      }
    },

    async fetchDistricts(provinceCode) {
      try {
        this.isLoadingDistricts = true
        this.districts = []
        this.wards = []
        const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
        const data = await res.json()
        this.districts = (data.districts || []).map(d => ({ code: d.code.toString(), name: d.name }))
        console.log('✅ Districts loaded:', this.districts.length)
      } catch (error) {
        console.error('❌ Error loading districts:', error)
        this.districts = []
      } finally {
        this.isLoadingDistricts = false
      }
    },

    async fetchWards(districtCode) {
      try {
        this.isLoadingWards = true
        this.wards = []
        const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
        const data = await res.json()
        this.wards = (data.wards || []).map(w => ({ code: w.code.toString(), name: w.name }))
        console.log('✅ Wards loaded:', this.wards.length)
      } catch (error) {
        console.error('❌ Error loading wards:', error)
        this.wards = []
      } finally {
        this.isLoadingWards = false
      }
    },

    async onProvinceChange() {
      this.form.district = ''
      this.form.ward = ''
      this.districts = []
      this.wards = []
      if (this.form.province) {
        await this.fetchDistricts(this.form.province)
      }
    },

    async onDistrictChange() {
      this.form.ward = ''
      this.wards = []
      if (this.form.district) {
        await this.fetchWards(this.form.district)
      }
    }
  }
}
</script>

<style scoped>
.breadcrumbs {
  background: #f8f9fa;
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;
}

.bread {
  margin: 0;
  color: #666;
}

.bread a {
  color: #007bff;
  text-decoration: none;
}

.process-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
  padding: 30px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.process {
  flex: 1;
  max-width: 250px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.process:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 30px;
  right: -50%;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #e9ecef 0%, #dee2e6 100%);
  border-radius: 2px;
  z-index: 1;
}

.process.completed::after {
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
}

.process.active::after {
  background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
}

.process-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.process.completed .process-icon {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.process.active .process-icon {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  animation: pulse 2s infinite;
}

.process.pending .process-icon {
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e9ecef;
}

.process-content {
  text-align: center;
}

.process-number {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #6c757d;
}

.process.completed .process-number {
  color: #28a745;
}

.process.active .process-number {
  color: #007bff;
}

.process h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.process-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 400;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(0, 123, 255, 0.5);
  }
  100% {
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  }
}

.checkout-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.checkout-form h3 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.5rem;
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e9ecef;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h4 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 4px;
  padding: 12px 15px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-option {
  position: relative;
}

.payment-radio {
  position: absolute;
  opacity: 0;
}

.payment-label {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-label:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.payment-radio:checked + .payment-label {
  border-color: #007bff;
  background: #e3f2fd;
}

.payment-icon {
  width: 60px;
  height: 60px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.payment-icon i {
  font-size: 1.5rem;
  color: #007bff;
}

.payment-info h5 {
  margin: 0 0 5px;
  color: #333;
  font-size: 1.1rem;
}

.payment-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e9ecef;
}

.order-summary {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.order-summary h3 {
  color: #333;
  margin-bottom: 25px;
  font-size: 1.3rem;
}

.order-items {
  margin-bottom: 25px;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e9ecef;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
  margin-right: 15px;
}

.item-details h5 {
  margin: 0 0 5px;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.3;
}

.item-brand {
  margin: 0 0 5px;
  font-size: 0.8rem;
  color: #666;
}

.item-quantity {
  font-size: 0.8rem;
  color: #666;
}

.item-price {
  font-weight: 600;
  color: #007bff;
  font-size: 1rem;
}

.order-totals {
  margin-bottom: 25px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.total-row.total {
  border-bottom: 2px solid #007bff;
  font-size: 1.1rem;
  padding-top: 15px;
}

.shipping-info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.shipping-info h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.shipping-info p {
  margin: 0 0 10px;
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.shipping-info i {
  margin-right: 10px;
  color: #007bff;
}

.empty-cart {
  padding: 80px 20px;
  text-align: center;
}

.empty-cart h3 {
  color: #666;
  margin-bottom: 15px;
}

.empty-cart p {
  color: #999;
  margin-bottom: 30px;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Price Loading and Error States */
.price-loading {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #007bff;
}

.loading-spinner i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.price-error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #721c24;
}

.error-message i {
  color: #dc3545;
}

.price-debug {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.debug-message {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #856404;
}

.debug-message i {
  color: #ffc107;
}


.original-price {
  text-decoration: line-through;
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 2px;
}


/* Product Details Styles */
.product-details {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #007bff;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.85rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 600;
  color: #495057;
  flex: 1;
}

.detail-value {
  color: #007bff;
  font-weight: 500;
  text-align: right;
  flex: 1;
}

/* Status Classes */
.status-active {
  color: #28a745 !important;
  font-weight: 600;
}

.status-inactive {
  color: #6c757d !important;
}

.status-paused {
  color: #ffc107 !important;
  font-weight: 600;
}

.status-out-of-stock {
  color: #dc3545 !important;
  font-weight: 600;
}

.status-unknown {
  color: #6c757d !important;
  font-style: italic;
}

/* VietQR Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 30px;
}

.qr-loading {
  text-align: center;
  padding: 40px 20px;
}

.qr-result {
  text-align: center;
}

.qr-info {
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.qr-info h4 {
  margin: 0 0 15px;
  color: #333;
  font-size: 1.2rem;
}

.qr-info .amount {
  font-size: 1.1rem;
  color: #007bff;
  margin: 10px 0;
}

.qr-info .account-info {
  margin: 10px 0 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.qr-code {
  margin: 25px 0;
  padding: 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  display: inline-block;
}

.qr-code img {
  max-width: 250px;
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.payment-steps {
  margin: 25px 0;
  text-align: left;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.payment-steps h5 {
  margin: 0 0 15px;
  color: #333;
  font-size: 1rem;
}

.payment-steps ol {
  margin: 0;
  padding-left: 20px;
  color: #666;
  line-height: 1.6;
}

.payment-steps li {
  margin-bottom: 8px;
}

.payment-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
}

.qr-error {
  text-align: center;
  padding: 20px;
}

.qr-error .error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #721c24;
}

.qr-error .error-message i {
  font-size: 2rem;
  color: #dc3545;
}

/* Payment method styles */
.payment-loading {
  text-align: center;
  padding: 20px;
}

.payment-loading .loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #666;
}

.payment-loading .loading-spinner i {
  font-size: 1.5rem;
  animation: spin 1s linear infinite;
}

.payment-error {
  padding: 15px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 20px;
}

.payment-error .error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #721c24;
}

.payment-error .error-message i {
  font-size: 1.2rem;
}

.payment-label.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.service-fee {
  font-size: 0.875rem;
  color: #666;
  margin-top: 5px;
}

.selected-payment-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.selected-payment-info .info-card h6 {
  margin: 0 0 10px;
  color: #333;
  font-size: 1rem;
}

.selected-payment-info .info-card p {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.selected-payment-info .info-card p strong {
  color: #333;
}

.payment-success-info {
  margin-top: 20px;
  padding: 15px;
  background: #d4edda;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
}

.payment-success-info .success-card h6 {
  margin: 0 0 10px;
  color: #155724;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.payment-success-info .success-card p {
  margin: 5px 0;
  color: #155724;
  font-size: 0.9rem;
}

.payment-success-info .success-card p strong {
  color: #0c5460;
}

.payment-pending-info {
  margin-top: 20px;
  padding: 15px;
  background: #fff3cd;
  border-radius: 8px;
  border: 1px solid #ffeaa7;
}

.payment-pending-info .pending-card h6 {
  margin: 0 0 10px;
  color: #856404;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.payment-pending-info .pending-card p {
  margin: 5px 0;
  color: #856404;
  font-size: 0.9rem;
}

.payment-pending-info .pending-card p strong {
  color: #6c5700;
}

.mock-notice {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 8px;
  margin-top: 10px;
  color: #856404;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Address Preview Styles */
.address-preview {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.preview-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #666;
  font-size: 0.9rem;
}

.preview-label i {
  margin-right: 8px;
  color: #28a745;
}

.preview-address {
  color: #333;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.4;
}

/* Loading Text Styles */
.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  color: #666;
  font-size: 0.875rem;
}

.loading-text i {
  animation: spin 1s linear infinite;
}

.shipping-fee-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.shipping-fee-info h5 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.shipping-fee-info ul {
  margin: 0;
  padding-left: 20px;
}

.shipping-fee-info li {
  margin-bottom: 5px;
  color: #666;
}

.shipping-fee-info strong {
  color: #333;
}

.shipping-pending {
  opacity: 0.7;
}

.shipping-pending .text-muted {
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .checkout-form {
    padding: 30px 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .payment-label {
    flex-direction: column;
    text-align: center;
  }
  
  .payment-icon {
    margin: 0 0 15px;
  }
  
  .order-summary {
    margin-top: 30px;
    position: static;
  }
  
  .process-wrap {
    flex-direction: column;
    gap: 25px;
    padding: 20px 0;
  }
  
  .process:not(:last-child)::after {
    display: none;
  }
  
  .process-icon {
    width: 50px;
    height: 50px;
  }
  
  .process h3 {
    font-size: 1rem;
  }
  
  .process-desc {
    font-size: 0.8rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header,
  .modal-body {
    padding: 20px;
  }
  
  .payment-actions {
    flex-direction: column;
  }
  
  .qr-code img {
    max-width: 200px;
  }
}
</style>
