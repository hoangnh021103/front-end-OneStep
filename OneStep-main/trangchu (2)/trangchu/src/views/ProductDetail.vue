<template>
  <div v-if="product">
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <div class="container">
        <div class="row">
          <div class="col">
            <p class="bread">
              <span><router-link to="/">Trang chủ</router-link></span> / 
              <span><router-link to="/products">Sản phẩm</router-link></span> / 
              <span>{{ product.name }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail Section -->
    <div class="colorlib-product">
      <div class="container">
        <div class="row">
          <!-- Product Images -->
          <div class="col-md-6">
            <div class="product-images">
              <div class="main-image">
                <img :src="product.image" :alt="product.name" class="img-fluid">
              </div>
              <div class="thumbnail-images">
                <img 
                  v-for="(img, index) in productImages" 
                  :key="index"
                  :src="img" 
                  :alt="product.name"
                  class="thumbnail"
                  @click="setMainImage(img)"
                >
              </div>
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="col-md-6">
            <div class="product-info">
              <div class="product-tags">
                <span v-for="tag in product.tags" :key="tag" :class="getTagClass(tag)">{{ tag }}</span>
              </div>
              
              <h1 class="product-title">{{ product.name }}</h1>
              
              <div class="product-rating">
                <span class="stars">{{ getStars(product.rating) }}</span>
                <span class="rating-text">({{ product.rating }}/5)</span>
              </div>
              
              <div class="product-brand">
                <strong>Thương hiệu:</strong> {{ product.brand }}
              </div>
              
              <div class="product-price">
                <span class="current-price">{{ formatPrice(product.price) }}</span>
                <span v-if="product.originalPrice > product.price" class="original-price">
                  {{ formatPrice(product.originalPrice) }}
                </span>
                <div v-if="product.originalPrice > product.price" class="discount">
                  Tiết kiệm {{ formatPrice(product.originalPrice - product.price) }}
                </div>
              </div>
              
              <div class="product-description">
                <h4>Mô tả sản phẩm</h4>
                <p>{{ product.description || 'Sản phẩm chất lượng cao với thiết kế hiện đại, phù hợp cho mọi hoạt động hàng ngày. Được làm từ chất liệu cao cấp, đảm bảo độ bền và sự thoải mái tối đa.' }}</p>
              </div>
              
              <!-- Color Selection -->
              <div class="product-options" v-if="product.colors.length > 1">
                <h4>Màu sắc:</h4>
                <div class="color-options">
                  <button 
                    v-for="color in product.colors" 
                    :key="color"
                    class="color-option"
                    :class="{ active: selectedColor === color }"
                    :style="{ backgroundColor: getColorValue(color) }"
                    @click="selectedColor = color"
                    :title="color"
                  ></button>
                </div>
              </div>
              
              <!-- Size Selection -->
              <div class="product-options" v-if="product.sizes.length > 1">
                <h4>Kích thước:</h4>
                <div class="size-options">
                  <button 
                    v-for="size in product.sizes" 
                    :key="size"
                    class="size-option"
                    :class="{ active: selectedSize === size }"
                    @click="selectedSize = size"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>
              
              <!-- Quantity Selection -->
              <div class="product-options">
                <h4>Số lượng:</h4>
                <div class="quantity-selector">
                  <button @click="decreaseQuantity" class="quantity-btn" :disabled="quantity <= 1">-</button>
                  <input v-model.number="quantity" type="number" min="1" max="10" class="quantity-input">
                  <button @click="increaseQuantity" class="quantity-btn" :disabled="quantity >= 10">+</button>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="product-actions">
                <button 
                  @click="addProductToCart" 
                  class="btn btn-primary btn-lg add-to-cart-btn"
                >                  
                  <i class="icon-shopping-cart"></i>
                  Thêm vào giỏ hàng
                </button>
                
                <button 
                  @click="toggleWishlist" 
                  class="btn btn-outline-secondary btn-lg wishlist-btn"
                >
                  <i :class="isInWishlist ? 'icon-heart' : 'icon-heart-o'"></i>
                  {{ isInWishlist ? 'Đã yêu thích' : 'Yêu thích' }}
                </button>
              </div>
              
              <!-- Product Features -->
              <div class="product-features">
                <h4>Đặc điểm nổi bật:</h4>
                <ul>
                  <li>✅ Chất liệu cao cấp, bền đẹp</li>
                  <li>✅ Thiết kế thời trang, hiện đại</li>
                  <li>✅ Phù hợp mọi hoạt động</li>
                  <li>✅ Dễ dàng vệ sinh và bảo quản</li>
                  <li>✅ Bảo hành chính hãng</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="colorlib-product">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>🛍️ Sản phẩm liên quan</h2>
            <p>Những sản phẩm khác bạn có thể thích</p>
          </div>
        </div>
        
        <div class="row">
          <ProductCard 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            :product="relatedProduct"
            @product-added="handleProductAdded"
            @wishlist-toggled="handleWishlistToggled"
          />
        </div>
      </div>
    </div>
  </div>
  
  <!-- Loading State -->
  <div v-else class="loading-container">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p>Đang tải sản phẩm...</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'ProductDetail',
  components: {
    ProductCard
  },
  data() {
    return {
      selectedColor: '',
      selectedSize: '',
      quantity: 1,
      mainImage: '',
      isInWishlist: false
    }
  },
  computed: {
    ...mapGetters('products', ['productById', 'allProducts']),
    ...mapGetters('cart', ['isInCart']),
    
    product() {
      return this.productById(parseInt(this.$route.params.id))
    },
    
    productImages() {
      if (!this.product) return []
      // In a real app, this would come from the product data
      return [
        this.product.image,
        this.product.image, // Duplicate for demo
        this.product.image
      ]
    },
    
    relatedProducts() {
      if (!this.product) return []
      return this.allProducts
        .filter(p => p.id !== this.product.id && p.brand === this.product.brand)
        .slice(0, 4)
    }
  },
  watch: {
    product: {
      handler(newProduct) {
        if (newProduct) {
          this.selectedColor = newProduct.colors[0] || ''
          this.selectedSize = newProduct.sizes[0] || ''
          this.mainImage = newProduct.image
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    
    setMainImage(image) {
      this.mainImage = image
    },
    
    getTagClass(tag) {
      if (tag.includes('SALE')) return 'tag tag-sale'
      if (tag.includes('MỚI')) return 'tag tag-new'
      if (tag.includes('QUYỀN')) return 'tag tag-exclusive'
      if (tag.includes('-')) return 'tag tag-discount'
      return 'tag'
    },
    
    getStars(rating) {
      return '★'.repeat(rating) + '☆'.repeat(5 - rating)
    },
    
    getColorValue(color) {
      const colorMap = {
        'Đen': '#000000',
        'Trắng': '#ffffff',
        'Xanh': '#007bff',
        'Đỏ': '#dc3545',
        'Vàng': '#ffc107',
        'Hồng': '#e83e8c',
        'Xám': '#6c757d',
        'Nâu': '#8b4513'
      }
      return colorMap[color] || '#cccccc'
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    
    increaseQuantity() {
      if (this.quantity < 10) {
        this.quantity++
      }
    },
    
    addProductToCart() {
      const cartItem = {
        ...this.product,
        selectedColor: this.selectedColor,
        selectedSize: this.selectedSize,
        quantity: this.quantity
      }
      
      this.addToCart(cartItem)
      this.$toast?.success(`${this.product.name} đã được thêm vào giỏ hàng!`)
      
      // Chuyển hướng đến trang giỏ hàng sau khi thêm sản phẩm
      this.$router.push('/cart')
    },
    
    toggleWishlist() {
      this.isInWishlist = !this.isInWishlist
      this.$toast?.info(
        this.isInWishlist 
          ? `${this.product.name} đã được thêm vào danh sách yêu thích!`
          : `${this.product.name} đã được xóa khỏi danh sách yêu thích!`
      )
    },
    
    handleProductAdded(product) {
      this.$toast?.success(`${product.name} đã được thêm vào giỏ hàng!`)
    },
    
    handleWishlistToggled(product) {
      this.$toast?.info(`${product.name} đã được thêm vào danh sách yêu thích!`)
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

.bread a:hover {
  text-decoration: underline;
}

.product-images {
  margin-bottom: 30px;
}

.main-image {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: contain;
}

.thumbnail-images {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.thumbnail:hover {
  border-color: #007bff;
}

.product-info {
  padding-left: 30px;
  max-width: 100%;
  box-sizing: border-box;
}

.product-tags {
  margin-bottom: 20px;
}

.tag {
  display: inline-block;
  padding: 6px 12px;
  margin: 4px;
  border-radius: 15px;
  font-size: 12px;
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

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.stars {
  color: #ffa502;
  font-size: 1.2rem;
  margin-right: 10px;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

.product-brand {
  color: #666;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.product-price {
  margin-bottom: 30px;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #007bff;
  margin-right: 15px;
}

.original-price {
  font-size: 1.5rem;
  color: #999;
  text-decoration: line-through;
  margin-right: 15px;
}

.discount {
  background: #28a745;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  display: block;
  margin-top: 10px;
  width: fit-content;
}

.product-description {
  margin-bottom: 30px;
}

.product-description h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.product-description p {
  color: #666;
  line-height: 1.6;
}

.product-options {
  margin-bottom: 25px;
}

.product-options h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.color-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.size-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.size-option {
  padding: 10px 20px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.size-option:hover {
  border-color: #007bff;
  color: #007bff;
}

.size-option.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s;
}

.quantity-btn:hover:not(:disabled) {
  border-color: #007bff;
  color: #007bff;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 80px;
  height: 40px;
  text-align: center;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
}

.quantity-input:focus {
  outline: none;
  border-color: #007bff;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.add-to-cart-btn {
  flex: 1;
  min-width: 200px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
}

.wishlist-btn {
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
}

.product-features {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
}

.product-features h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.product-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-features li {
  padding: 8px 0;
  color: #666;
  font-size: 1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #666;
}

.loading-container p {
  margin-top: 20px;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .product-info {
    padding-left: 0;
    margin-top: 30px;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 2rem;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .add-to-cart-btn,
  .wishlist-btn {
    width: 100%;
  }
}
/* Responsive styles */
@media (max-width: 768px) {
  .product-info {
    padding-left: 0;
    margin-top: 30px;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 2rem;
  }
  
  .original-price {
    font-size: 1.2rem;
  }
  
  .product-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .add-to-cart-btn,
  .wishlist-btn {
    width: 100%;
  }
}
</style>
