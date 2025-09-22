<template>
  <div class="col-lg-3 mb-4 text-center">
    <div class="product-entry border animate-fade-in-up">
      <div class="product-tags" :data-colors="product.colors.join(',')" :data-sizes="product.sizes.join(',')">
        <span v-for="tag in product.tags" :key="tag" :class="getTagClass(tag)">{{ tag }}</span>
      </div>
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
            :disabled="product.stock === 0"
          >
            {{ product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng' }}
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
      // Ưu tiên sanPhamId, sau đó id, cuối cùng là chiTietSanPhamId
      const productId = this.product.sanPhamId || this.product.id || this.product.chiTietSanPhamId || this.product.productId
      console.log('🔄 Navigating to product detail:', productId, 'Product:', this.product)
      console.log('🔍 Available IDs:', {
        sanPhamId: this.product.sanPhamId,
        id: this.product.id,
        chiTietSanPhamId: this.product.chiTietSanPhamId,
        productId: this.product.productId
      })
      
      if (!productId) {
        console.error('❌ No product ID found:', this.product)
        console.log('🔍 Full product object:', JSON.stringify(this.product, null, 2))
        
        // Tạo ID tạm thời từ tên sản phẩm hoặc index
        const fallbackId = this.product.name ? 
          this.product.name.toLowerCase().replace(/\s+/g, '-') : 
          `product-${Date.now()}`
        
        console.log('🔄 Using fallback ID:', fallbackId)
        
        try {
          this.$router.push(`/product/${fallbackId}`)
          console.log('✅ Navigation successful with fallback ID:', `/product/${fallbackId}`)
        } catch (error) {
          console.error('❌ Navigation error with fallback:', error)
          window.location.href = `/product/${fallbackId}`
        }
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
      // Gọi action addToCart từ store với tham số là sản phẩm hiện tại
      this.$store.dispatch('cart/addToCart', this.product)
      // Show success message
      this.$emit('product-added', this.product)
    },
    
    
    getStars(rating) {
      return '★'.repeat(rating) + '☆'.repeat(5 - rating)
    },
    
    getTagClass(tag) {
      if (tag.includes('SALE')) return 'tag'
      if (tag.includes('MỚI')) return 'tag tag-new'
      if (tag.includes('QUYỀN')) return 'tag tag-exclusive'
      if (tag.includes('-')) return 'tag'
      return 'tag'
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

.product-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  margin: 2px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.tag-sale {
  background: #ff4757;
  color: white;
}

.tag-new {
  background: #2ed573;
  color: white;
}

.tag-exclusive {
  background: #ffa502;
  color: white;
}

.tag-discount {
  background: #ff6348;
  color: white;
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

.discount-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  z-index: 3;
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
