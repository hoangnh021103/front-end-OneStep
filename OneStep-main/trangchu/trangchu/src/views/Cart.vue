<template>
  <div>
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <div class="container">
        <div class="row">
          <div class="col">
            <p class="bread">
              <span><router-link to="/">Trang chủ</router-link></span> / 
              <span>Giỏ hàng</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Section -->
    <div class="colorlib-product">
      <div class="container">
        <!-- Process Steps -->
        <div class="row row-pb-lg">
          <div class="col-md-10 offset-md-1">
            <div class="process-wrap">
              <div class="process text-center active">
                <div class="process-icon">
                  <i class="icon-shopping-cart"></i>
                </div>
                <div class="process-content">
                  <span class="process-number">01</span>
                  <h3>Giỏ hàng</h3>
                  <p class="process-desc">Chọn sản phẩm</p>
                </div>
              </div>
              <div class="process text-center pending">
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

        <!-- Cart Items -->
        <div class="row row-pb-lg" v-if="cartItems.length > 0">
          <div class="col-md-12">
            <!-- Cart Header -->
            <div class="product-name d-flex">
              <div class="one-forth text-left px-4">
                <span>Chi tiết sản phẩm</span>
              </div>
              <div class="one-eight text-center">
                <span>Giá</span>
              </div>
              <div class="one-eight text-center">
                <span>Số lượng</span>
              </div>
              <div class="one-eight text-center">
                <span>Tổng</span>
              </div>
              <div class="one-eight text-center">
                <span>Trạng thái</span>
              </div>
              <div class="one-eight text-center px-4">
                <span>Xóa</span>
              </div>
            </div>

            <!-- Cart Items -->
            <div 
              v-for="item in cartItems" 
              :key="item.id" 
              class="product-cart d-flex"
            >
              <div class="one-forth">
                <div class="product-img" :style="{ backgroundImage: `url(${item.image})` }"></div>
                <div class="display-tc">
                  <h3>{{ item.name }}</h3>
                  <p class="brand">{{ item.brand }}</p>
                </div>
              </div>
              <div class="one-eight text-center">
                <div class="display-tc">
                  <span class="price">{{ formatPrice(item.price) }}</span>
                </div>
              </div>
              <div class="one-eight text-center">
                <div class="display-tc">
                  <div class="quantity-controls">
                    <button 
                      class="btn btn-sm btn-outline-secondary" 
                      @click="handleUpdateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      :value="item.quantity" 
                      @change="handleUpdateQuantity(item.id, parseInt($event.target.value) || 1)"
                      @blur="handleInputBlur(item.id, $event)"
                      @keyup.enter="handleInputBlur(item.id, $event)"
                      class="form-control input-number text-center quantity-input"
                      min="1" 
                      max="100"
                    >
                    <button 
                      class="btn btn-sm btn-outline-secondary" 
                      @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div class="one-eight text-center">
                <div class="display-tc">
                  <span class="price">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
              <div class="one-eight text-center">
                <div class="display-tc">
                  <div class="item-status">
                    <span v-if="item.stock > 0" class="status-available">
                      <i class="icon-check"></i> Còn hàng
                    </span>
                    <span v-else class="status-out">
                      <i class="icon-close"></i> Hết hàng
                    </span>
                    <div v-if="item.selectedColor || item.selectedSize" class="variant-info">
                      <small>{{ item.selectedColor }} - Size {{ item.selectedSize }}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="one-eight text-center px-4">
                <div class="display-tc">
                  <button 
                    class="btn btn-outline-danger btn-sm" 
                    @click="removeFromCart(item.id)"
                    title="Xóa sản phẩm"
                  >
                    <i class="icon-trash"></i>
                  </button>
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
              <p>Hãy thêm một số sản phẩm vào giỏ hàng của bạn</p>
              <router-link to="/products" class="btn btn-primary btn-lg">Tiếp tục mua sắm</router-link>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="row" v-if="cartItems.length > 0">
          <div class="col-md-8">
            <div class="cart-actions">
              <router-link to="/products" class="btn btn-outline-primary">
                <i class="icon-arrow-left"></i> Tiếp tục mua sắm
              </router-link>
              <button @click="clearCart" class="btn btn-outline-danger">
                <i class="icon-trash"></i> Xóa tất cả
              </button>
            </div>
          </div>
          <div class="col-md-4">
            <div class="cart-summary">
              <div class="summary-item">
                <span>Tạm tính:</span>
                <span>{{ formatPrice(cartTotal) }}</span>
              </div>
              <div class="summary-item">
                <span>Phí vận chuyển:</span>
                <span>{{ formatPrice(shippingFee) }}</span>
              </div>
              <div class="summary-item total">
                <span><strong>Tổng cộng:</strong></span>
                <span><strong>{{ formatPrice(cartTotal + shippingFee) }}</strong></span>
              </div>
              <button @click="proceedToCheckout" class="btn btn-primary btn-lg w-100 mt-3">
                Thanh toán
              </button>
            </div>
          </div>
        </div>

        <!-- Recommended Products -->
        <div class="row" v-if="cartItems.length > 0">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading colorlib-heading-sm">
            <h2>Mua thêm</h2>
          </div>
        </div>
        <div class="row" v-if="cartItems.length > 0">
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Cart',
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal']),
    ...mapGetters('products', ['allProducts']),
    
    shippingFee() {
      return this.cartTotal > 2000000 ? 0 : 50000 // Free shipping over 2M
    },
    
    recommendedProducts() {
      // Get 4 random products that are not in cart
      const cartIds = this.cartItems.map(item => item.id)
      const availableProducts = this.allProducts.filter(product => !cartIds.includes(product.id))
      return availableProducts.slice(0, 4)
    }
  },
  methods: {
    ...mapActions('cart', ['updateQuantity', 'removeFromCart', 'clearCart']),
    
    handleUpdateQuantity(productId, quantity) {
      // Validate quantity
      if (isNaN(quantity) || quantity < 0) {
        console.warn('Invalid quantity:', quantity)
        return
      }
      
      if (quantity === 0) {
        // Xóa sản phẩm khỏi giỏ hàng
        this.removeFromCart(productId)
        this.$toast?.success('Đã xóa sản phẩm khỏi giỏ hàng')
      } else if (quantity > 100) {
        // Giới hạn số lượng tối đa
        this.$toast?.warning('Số lượng tối đa là 100 sản phẩm')
        this.updateQuantity({ productId, quantity: 100 })
      } else {
        // Cập nhật số lượng bình thường
        this.updateQuantity({ productId, quantity })
        console.log(`Updated quantity for product ${productId} to ${quantity}`)
      }
    },
    
    handleInputBlur(productId, event) {
      const value = parseInt(event.target.value)
      if (isNaN(value) || value < 1) {
        // Reset về giá trị hợp lệ
        const item = this.cartItems.find(item => item.id === productId)
        if (item) {
          event.target.value = item.quantity
          this.$toast?.warning('Số lượng phải lớn hơn 0')
        }
      } else {
        this.handleUpdateQuantity(productId, value)
      }
    },
    
    proceedToCheckout() {
      this.$router.push('/checkout')
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
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

.product-name {
  background: #f8f9fa;
  padding: 15px 0;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  color: #333;
}

.product-cart {
  border: 1px solid #e9ecef;
  border-top: none;
  padding: 20px 0;
  align-items: center;
}

.product-cart:last-child {
  border-radius: 0 0 8px 8px;
}

.one-forth {
  flex: 0 0 40%;
  display: flex;
  align-items: center;
  gap: 15px;
}

.one-eight {
  flex: 0 0 15%;
  text-align: center;
}

.product-img {
  width: 80px;
  height: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.display-tc h3 {
  margin: 0 0 5px;
  font-size: 1rem;
  color: #333;
}

.display-tc .brand {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.price {
  font-weight: 600;
  color: #007bff;
  font-size: 1.1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
}

.quantity-controls .btn {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.quantity-controls .btn:hover:not(:disabled) {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.quantity-controls .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  text-align: center;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 5px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.quantity-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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

.cart-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.cart-summary {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.summary-item.total {
  border-bottom: 2px solid #007bff;
  font-size: 1.1rem;
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

/* Item Status Styles */
.item-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.status-available {
  color: #28a745;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-out {
  color: #dc3545;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.variant-info {
  color: #666;
  font-size: 10px;
  text-align: center;
}

.variant-info small {
  display: block;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .product-cart {
    flex-direction: column;
    gap: 15px;
  }
  
  .one-forth,
  .one-eight {
    flex: 1;
    width: 100%;
  }
  
  .cart-actions {
    flex-direction: column;
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
