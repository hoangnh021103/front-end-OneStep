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
              <div class="process text-center">
                <p><span>01</span></p>
                <h3>Giỏ hàng</h3>
              </div>
              <div class="process text-center active">
                <p><span>02</span></p>
                <h3>Thanh toán</h3>
              </div>
              <div class="process text-center">
                <p><span>03</span></p>
                <h3>Đặt hàng hoàn tất</h3>
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
                  <div class="form-group">
                    <label for="address">Địa chỉ *</label>
                    <input 
                      type="text" 
                      id="address" 
                      v-model="form.address"
                      class="form-control" 
                      required
                      :class="{ 'is-invalid': errors.address }"
                      placeholder="Số nhà, tên đường, phường/xã"
                    >
                    <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}</div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="city">Thành phố *</label>
                        <select 
                          id="city" 
                          v-model="form.city"
                          class="form-control" 
                          required
                          :class="{ 'is-invalid': errors.city }"
                        >
                          <option value="">Chọn thành phố</option>
                          <option value="hanoi">Hà Nội</option>
                          <option value="hcm">TP. Hồ Chí Minh</option>
                          <option value="danang">Đà Nẵng</option>
                          <option value="haiphong">Hải Phòng</option>
                          <option value="cantho">Cần Thơ</option>
                        </select>
                        <div v-if="errors.city" class="invalid-feedback">{{ errors.city }}</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="district">Quận/Huyện *</label>
                        <input 
                          type="text" 
                          id="district" 
                          v-model="form.district"
                          class="form-control" 
                          required
                          :class="{ 'is-invalid': errors.district }"
                        >
                        <div v-if="errors.district" class="invalid-feedback">{{ errors.district }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="form-section">
                  <h4>Phương thức thanh toán</h4>
                  <div class="payment-methods">
                    <div class="payment-option">
                      <input 
                        type="radio" 
                        id="cod" 
                        v-model="form.paymentMethod" 
                        value="cod"
                        class="payment-radio"
                      >
                      <label for="cod" class="payment-label">
                        <div class="payment-icon">
                          <i class="icon-cash"></i>
                        </div>
                        <div class="payment-info">
                          <h5>Thanh toán khi nhận hàng (COD)</h5>
                          <p>Thanh toán bằng tiền mặt khi giao hàng</p>
                        </div>
                      </label>
                    </div>
                    
                    <div class="payment-option">
                      <input 
                        type="radio" 
                        id="bank" 
                        v-model="form.paymentMethod" 
                        value="bank"
                        class="payment-radio"
                      >
                      <label for="bank" class="payment-label">
                        <div class="payment-icon">
                          <i class="icon-credit-card"></i>
                        </div>
                        <div class="payment-info">
                          <h5>Chuyển khoản ngân hàng</h5>
                          <p>Chuyển khoản qua ngân hàng</p>
                        </div>
                      </label>
                    </div>
                    
                    <div class="payment-option">
                      <input 
                        type="radio" 
                        id="vnpay" 
                        v-model="form.paymentMethod" 
                        value="vnpay"
                        class="payment-radio"
                      >
                      <label for="vnpay" class="payment-label">
                        <div class="payment-icon">
                          <img src="images/vnpay_icon.png" alt="VNPay" style="width: 40px; height: 40px;">
                        </div>
                        <div class="payment-info">
                          <h5>VNPay</h5>
                          <p>Thanh toán qua VNPay</p>
                        </div>
                      </label>
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
                    
                    <!-- Show price update indicator -->
                    <div v-if="updatedCartItems.length > 0 && !isLoadingPrices" class="price-updated">
                      <i class="icon-check"></i>
                      <small>Giá đã cập nhật từ API</small>
                    </div>
                  </div>
                  <div class="item-price">
                    {{ formatPrice(item.price * item.quantity) }}
                    <!-- Show original price if different -->
                    <div v-if="item.originalPrice && item.originalPrice > item.price" class="original-price">
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
                <!-- Show price update info -->
                <div v-if="updatedCartItems.length > 0 && !isLoadingPrices" class="price-update-info">
                  <small>
                    <i class="icon-info"></i>
                    Giá sản phẩm đã được cập nhật từ hệ thống
                  </small>
                </div>
              </div>
              
              <!-- Shipping Info -->
              <div class="shipping-info">
                <h4>Thông tin giao hàng</h4>
                <p><i class="icon-truck"></i> Giao hàng trong 1-3 ngày làm việc</p>
                <p><i class="icon-shield"></i> Đảm bảo chất lượng sản phẩm</p>
                <p><i class="icon-undo"></i> Đổi trả miễn phí trong 7 ngày</p>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import productService from '../services/productService'

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
        city: '',
        district: '',
        paymentMethod: 'cod',
        notes: ''
      },
      errors: {},
      isSubmitting: false,
      isLoadingPrices: false,
      updatedCartItems: [],
      priceError: null
    }
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal']),
    
    // Sử dụng dữ liệu đã cập nhật từ API hoặc dữ liệu gốc
    displayCartItems() {
      return this.updatedCartItems.length > 0 ? this.updatedCartItems : this.cartItems
    },
    
    // Tính tổng tiền từ dữ liệu đã cập nhật
    updatedCartTotal() {
      return this.displayCartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    
    shippingFee() {
      return this.updatedCartTotal > 2000000 ? 0 : 50000 // Free shipping over 2M
    }
  },
  async mounted() {
    // Load updated prices from API when component mounts
    await this.loadUpdatedPrices()
  },
  
  methods: {
    ...mapActions('cart', ['clearCart']),
    
    // Load updated prices from API
    async loadUpdatedPrices() {
      if (this.cartItems.length === 0) return
      
      this.isLoadingPrices = true
      this.priceError = null
      
      try {
        this.updatedCartItems = await productService.getCartItemsWithUpdatedPrices(this.cartItems)
        console.log('Updated cart items with API prices:', this.updatedCartItems)
      } catch (error) {
        console.error('Error loading updated prices:', error)
        this.priceError = 'Không thể cập nhật giá sản phẩm. Vui lòng kiểm tra kết nối mạng.'
        // Fallback to original cart items
        this.updatedCartItems = [...this.cartItems]
      } finally {
        this.isLoadingPrices = false
      }
    },
    
    // Refresh prices manually
    async refreshPrices() {
      await this.loadUpdatedPrices()
    },
    
    submitOrder() {
      this.validateForm()
      
      if (Object.keys(this.errors).length === 0) {
        this.isSubmitting = true
        
        // Simulate order processing
        setTimeout(() => {
          this.isSubmitting = false
          this.clearCart()
          this.$router.push('/order-complete')
        }, 3000)
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
        this.errors.address = 'Vui lòng nhập địa chỉ'
      }
      
      if (!this.form.city) {
        this.errors.city = 'Vui lòng chọn thành phố'
      }
      
      if (!this.form.district.trim()) {
        this.errors.district = 'Vui lòng nhập quận/huyện'
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
  margin-bottom: 40px;
}

.process {
  flex: 1;
  max-width: 200px;
  position: relative;
}

.process:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: #e9ecef;
  z-index: 1;
}

.process.active::after {
  background: #007bff;
}

.process p {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #e9ecef;
}

.process.active p {
  color: #007bff;
}

.process h3 {
  margin: 10px 0 0;
  font-size: 1rem;
  color: #666;
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

.price-updated {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #28a745;
  margin-top: 5px;
}

.price-updated i {
  font-size: 0.8rem;
}

.original-price {
  text-decoration: line-through;
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 2px;
}

.price-update-info {
  text-align: center;
  padding: 10px;
  background: #d1ecf1;
  border-radius: 4px;
  margin-top: 10px;
  color: #0c5460;
}

.price-update-info i {
  margin-right: 5px;
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
    gap: 20px;
  }
  
  .process:not(:last-child)::after {
    display: none;
  }
}
</style>
