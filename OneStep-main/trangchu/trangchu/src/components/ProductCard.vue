<template>
  <div class="col-lg-3 mb-4 text-center">
    <div class="product-entry border animate-fade-in-up">
      <a href="#" class="prod-img" @click.prevent="goToProductDetail">
        <img :src="product.image" class="img-fluid" :alt="product.name">
      </a>
      <div class="desc">
        <div class="rating">
          <span class="stars">{{ getStars(product.rating) }}</span>
        </div>
        <div class="brand">{{ product.brand }}</div>
        <h2><a href="#" @click.prevent="goToProductDetail">{{ product.name }}</a></h2>
        <div class="price">
          <span class="current-price">{{ formatPrice(product.price) }}</span>
        </div>
        <!-- Đã xóa phần stock-info -->
        <div class="product-actions mt-3">
          <button
            class="btn btn-primary btn-sm me-2"
            @click.stop="addToCart"
            :disabled="!product.stock || product.stock <= 0"
          >
            {{ (!product.stock || product.stock <= 0) ? 'Hết hàng' : 'Thêm vào giỏ hàng' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('cart', ['isInCart']),
  },
  methods: {
    
    goToProductDetail() {
      // Chuyển đến trang chi tiết sản phẩm
      // Ưu tiên maSanPham, sau đó sanPhamId, sau đó id, cuối cùng là chiTietSanPhamId
      const productId = this.product.maSanPham || this.product.sanPhamId || this.product.id || this.product.chiTietSanPhamId
      console.log('🔄 Navigating to product detail:', productId, 'Product:', this.product)
      console.log('🔍 Available IDs:', {
        maSanPham: this.product.maSanPham,
        sanPhamId: this.product.sanPhamId,
        id: this.product.id,
        chiTietSanPhamId: this.product.chiTietSanPhamId
      })
      
      if (!productId) {
        console.error('❌ No product ID found:', this.product)
        alert('Không tìm thấy ID sản phẩm!')
        return
      }
      
      try {
        this.$router.push(`/product/${productId}`)
        console.log('✅ Navigation successful to:', `/product/${productId}`)
      } catch (error) {
        console.error('❌ Navigation error:', error)
        // Fallback: chuyển bằng window.location
        window.location.href = `/product/${productId}`
      }
    },
    
    addToCart() {
      // Kiểm tra xem sản phẩm có còn hàng không
      if (!this.product.stock || this.product.stock <= 0) {
        this.showErrorToast('Sản phẩm này đã hết hàng và không thể thêm vào giỏ hàng!')
        return
      }

      // Gọi action addToCart từ store với tham số là sản phẩm hiện tại
      this.$store.dispatch('cart/addToCart', this.product)

      // Hiển thị thông báo thành công
      this.showSuccessToast()

      // Emit event cho parent component
      this.$emit('product-added', this.product)
    },

    showErrorToast(message) {
      console.log('❌ Showing error toast:', message)

      // Tạo toast notification với inline styles để đảm bảo hiển thị
      const toast = document.createElement('div')
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 99999;
        max-width: 350px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease-out;
        cursor: pointer;
      `

      toast.innerHTML = `
        <span style="font-size: 20px;">❌</span>
        <span>${message}</span>
      `

      // Thêm toast vào body
      document.body.appendChild(toast)

      // Trigger animation
      setTimeout(() => {
        toast.style.transform = 'translateX(0)'
        toast.style.opacity = '1'
      }, 10)

      // Tự động xóa toast sau 4 giây (dài hơn error)
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)'
        toast.style.opacity = '0'
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast)
          }
        }, 300)
      }, 4000)

      // Click để đóng toast
      toast.addEventListener('click', () => {
        toast.style.transform = 'translateX(100%)'
        toast.style.opacity = '0'
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast)
          }
        }, 300)
      })

      console.log('❌ Error toast created and added to DOM')
    },

    showSuccessToast() {
      console.log('🛒 Showing success toast for:', this.product.name || this.product.tenSanPham)
      
      // Tạo toast notification với inline styles để đảm bảo hiển thị
      const toast = document.createElement('div')
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 99999;
        max-width: 350px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease-out;
        cursor: pointer;
      `
      
      toast.innerHTML = `
        <span style="font-size: 20px;">✅</span>
        <span>Đã thêm "${this.product.name || this.product.tenSanPham || 'Sản phẩm'}" vào giỏ hàng!</span>
      `
      
      // Thêm toast vào body
      document.body.appendChild(toast)
      
      // Trigger animation
      setTimeout(() => {
        toast.style.transform = 'translateX(0)'
        toast.style.opacity = '1'
      }, 10)
      
      // Tự động xóa toast sau 3 giây
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)'
        toast.style.opacity = '0'
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast)
          }
        }, 300)
      }, 3000)
      
      // Click để đóng toast
      toast.addEventListener('click', () => {
        toast.style.transform = 'translateX(100%)'
        toast.style.opacity = '0'
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast)
          }
        }, 300)
      })
      
      console.log('✅ Toast created and added to DOM')
    },
    
    
    getStars(rating) {
      return '★'.repeat(rating) + '☆'.repeat(5 - rating)
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
.product-entry {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  position: relative;
}

.product-entry:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}


.prod-img {
  display: block;
  overflow: hidden;
}

.prod-img img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-entry:hover .prod-img img {
  transform: scale(1.05);
}

.desc {
  padding: 20px;
  text-align: left;
}

.rating {
  margin-bottom: 8px;
}

.stars {
  color: #ffa502;
  font-size: 14px;
}

.brand {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.desc h2 {
  font-size: 16px;
  margin-bottom: 15px;
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
  margin-bottom: 15px;
  position: relative;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #007bff;
  display: block;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-right: 10px;
}


.stock-info {
  margin-bottom: 10px;
  font-size: 12px;
}

.stock-available {
  color: #28a745;
  font-weight: 600;
}

.stock-out {
  color: #dc3545;
  font-weight: 600;
}

.product-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
