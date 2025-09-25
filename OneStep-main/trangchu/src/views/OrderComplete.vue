<template>
  <div>
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <div class="container">
        <div class="row">
          <div class="col">
            <p class="bread">
              <span><router-link to="/">Trang chủ</router-link></span> / 
              <span>Đặt hàng hoàn tất</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Complete Section -->
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
              <div class="process text-center completed">
                <div class="process-icon">
                  <i class="icon-check"></i>
                </div>
                <div class="process-content">
                  <span class="process-number">02</span>
                  <h3>Thanh toán</h3>
                  <p class="process-desc">Thông tin & thanh toán</p>
                </div>
              </div>
              <div class="process text-center active">
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

        <!-- Success Message -->
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="order-success">
              <div class="success-icon">
                <i class="icon-checkmark"></i>
              </div>
              <h2>🎉 Đặt hàng thành công!</h2>
              <p class="success-message">
                Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.
              </p>
              
              <div class="order-info">
                <div class="info-item">
                  <span class="label">Mã đơn hàng:</span>
                  <span class="value">{{ orderNumber }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Ngày đặt hàng:</span>
                  <span class="value">{{ orderDate }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Tổng tiền:</span>
                  <span class="value">{{ formatPrice(orderTotal) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Phương thức thanh toán:</span>
                  <span class="value">{{ paymentMethod }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Order Tracking -->
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="order-tracking">
              <h3>📦 Theo dõi đơn hàng</h3>
              <p>Bạn có thể theo dõi tình trạng đơn hàng bằng mã đơn hàng:</p>
              
              <div class="tracking-form">
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    :value="orderNumber"
                    readonly
                  >
                  <button class="btn btn-outline-secondary" @click="copyOrderNumber">
                    <i class="icon-copy"></i> Sao chép
                  </button>
                </div>
                
                <div class="tracking-actions">
                  <router-link to="/orders" class="btn btn-primary">
                    <i class="icon-truck"></i> Xem đơn hàng của tôi
                  </router-link>
                </div>
              </div>
              
              <div class="tracking-info">
                <p><i class="icon-phone"></i> Hotline hỗ trợ: <a href="tel:+1235235598">+1235 2355 98</a></p>
                <p><i class="icon-mail"></i> Email: <a href="mailto:info@yoursite.com">info@yoursite.com</a></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Products -->
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>🛍️ Có thể bạn cũng thích</h2>
            <p>Những sản phẩm khác bạn có thể quan tâm</p>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-3 col-lg-3 mb-4 text-center" v-for="product in recommendedProducts" :key="product.id">
            <div class="product-entry border">
              <router-link :to="`/product/${product.id}`" class="prod-img">
                <img :src="product.image" class="img-fluid" :alt="product.name">
              </router-link>
              <div class="desc">
                <h2><router-link :to="`/product/${product.id}`">{{ product.name }}</router-link></h2>
                <span class="price">{{ formatPrice(product.price) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="row">
          <div class="col-md-8 offset-md-2 text-center">
            <div class="action-buttons">
              <router-link to="/products" class="btn btn-primary btn-lg">
                <i class="icon-shopping-cart"></i> Tiếp tục mua sắm
              </router-link>
              <router-link to="/" class="btn btn-outline-primary btn-lg">
                <i class="icon-home"></i> Về trang chủ
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'OrderComplete',
  data() {
    return {
      orderNumber: '',
      orderDate: '',
      orderTotal: 0,
      paymentMethod: 'Thanh toán khi nhận hàng (COD)',
      recommendedProducts: []
    }
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    ...mapGetters('payment', ['currentPayment']),
    ...mapGetters('cart', ['cartTotal']),
    ...mapGetters('order', ['currentOrder']),
    ...mapGetters('orders', ['orders'])
  },
  mounted() {
    this.generateOrderInfo()
    this.loadRecommendedProducts()
  },
  methods: {
    ...mapActions('orders', ['loadOrders']),

    async generateOrderInfo() {
      // Load orders để đảm bảo có dữ liệu mới nhất
      await this.loadOrders()
      // Ưu tiên sử dụng thông tin từ order store
      if (this.currentOrder && this.currentOrder.orderNumber) {
        this.orderNumber = this.currentOrder.orderNumber
        this.orderDate = new Date(this.currentOrder.orderDate).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
        this.orderTotal = this.currentOrder.finalTotal || this.currentOrder.orderTotal
        this.paymentMethod = this.currentOrder.paymentMethod
        console.log('✅ Sử dụng thông tin từ order store:', this.currentOrder)
        return
      }
      
      // Fallback: Generate order number
      this.orderNumber = 'GD' + Date.now().toString().slice(-8)
      
      // Set order date
      this.orderDate = new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      
      // Lấy tổng tiền từ payment hiện tại hoặc cart total
      if (this.currentPayment && this.currentPayment.tongTien) {
        this.orderTotal = this.currentPayment.tongTien
        console.log('✅ Sử dụng tổng tiền từ payment:', this.orderTotal)
      } else if (this.cartTotal > 0) {
        // Tính tổng tiền bao gồm phí vận chuyển
        const shippingFee = this.cartTotal > 2000000 ? 0 : 50000
        this.orderTotal = this.cartTotal + shippingFee
        console.log('✅ Sử dụng tổng tiền từ cart:', this.orderTotal)
      } else {
        // Fallback nếu không có dữ liệu
        this.orderTotal = 0
        console.warn('⚠️ Không có thông tin tổng tiền, sử dụng giá trị mặc định')
      }
      
      // Cập nhật phương thức thanh toán từ payment hiện tại
      if (this.currentPayment && this.currentPayment.phuongThucThanhToan) {
        this.paymentMethod = this.currentPayment.phuongThucThanhToan.tenPhuongThuc || this.paymentMethod
      } else if (this.currentPayment && this.currentPayment.phuongThucId) {
        this.paymentMethod = this.getPaymentMethodName(this.currentPayment.phuongThucId)
      }
    },
    
    loadRecommendedProducts() {
      // Get 4 random products as recommendations
      this.recommendedProducts = this.allProducts.slice(0, 4)
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    
    copyOrderNumber() {
      navigator.clipboard.writeText(this.orderNumber).then(() => {
        this.$toast?.success('Đã sao chép mã đơn hàng!')
      }).catch(() => {
        // Fallback for older browsers
        const input = document.createElement('input')
        input.value = this.orderNumber
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        this.$toast?.success('Đã sao chép mã đơn hàng!')
      })
    },
    
    // Lấy tên phương thức thanh toán theo ID
    getPaymentMethodName(phuongThucId) {
      // Fallback theo ID
      switch (phuongThucId) {
        case 1:
          return 'Thanh toán khi nhận hàng (COD)'
        case 2:
          return 'VNPay'
        default:
          return 'Phương thức thanh toán'
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
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
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
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  animation: pulse-success 2s infinite;
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
  color: #28a745;
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

@keyframes pulse-success {
  0% {
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(40, 167, 69, 0.5);
  }
  100% {
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  }
}

.order-success {
  background: white;
  padding: 60px 40px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  text-align: center;
  margin-bottom: 40px;
}

.success-icon {
  width: 100px;
  height: 100px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
}

.success-icon i {
  font-size: 3rem;
  color: white;
}

.order-success h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
}

.success-message {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 40px;
  line-height: 1.6;
}

.order-info {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  text-align: left;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #333;
}

.value {
  color: #007bff;
  font-weight: 600;
}


.order-tracking {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin-bottom: 40px;
}

.order-tracking h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.order-tracking p {
  color: #666;
  margin-bottom: 20px;
}

.tracking-form {
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  max-width: 400px;
}

.input-group .form-control {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.tracking-actions {
  margin-top: 20px;
  text-align: center;
}

.tracking-actions .btn {
  padding: 12px 24px;
  font-weight: 600;
}

.tracking-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.tracking-info p {
  margin: 0 0 10px;
  color: #666;
  display: flex;
  align-items: center;
}

.tracking-info i {
  margin-right: 10px;
  color: #007bff;
  width: 20px;
}

.tracking-info a {
  color: #007bff;
  text-decoration: none;
}

.tracking-info a:hover {
  text-decoration: underline;
}

.product-entry {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-entry:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.prod-img {
  display: block;
  overflow: hidden;
}

.prod-img img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-entry:hover .prod-img img {
  transform: scale(1.05);
}

.desc {
  padding: 15px;
  text-align: left;
}

.desc h2 {
  font-size: 0.9rem;
  margin-bottom: 10px;
  line-height: 1.4;
}

.desc h2 a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.desc h2 a:hover {
  color: #007bff;
}

.price {
  font-weight: 600;
  color: #007bff;
  font-size: 1.1rem;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .order-success {
    padding: 40px 20px;
  }
  
  .order-success h2 {
    font-size: 1.5rem;
  }
  
  .order-tracking {
    padding: 30px 20px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .btn {
    width: 100%;
    max-width: 300px;
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
}
</style>
