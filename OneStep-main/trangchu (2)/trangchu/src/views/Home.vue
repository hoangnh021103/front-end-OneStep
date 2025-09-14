<template>
  <div>
    <!-- Hero Slider -->
    <aside id="colorlib-hero">
      <div class="flexslider">
        <ul class="slides">
          <li style="background-image: url(images/img_bg_1.jpg);">
            <div class="overlay"></div>
            <div class="container-fluid">
              <div class="row">
                <div class="col-sm-6 offset-sm-3 text-center slider-text">
                  <div class="slider-text-inner animate-fade-in-up">
                    <div class="desc">
                      <h1 class="head-1">✨ Giày</h1>
                      <h2 class="head-2">👨 Nam</h2>
                      <h2 class="head-3">Bộ sưu tập</h2>
                      <p class="category"><span>🌟 Giày xu hướng mới</span></p>
                      <p><router-link to="/products" class="btn btn-primary">🛍️ Mua sắm bộ sưu tập</router-link></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li style="background-image: url(images/img_bg_2.jpg);">
            <div class="overlay"></div>
            <div class="container-fluid">
              <div class="row">
                <div class="col-sm-6 offset-sm-3 text-center slider-text">
                  <div class="slider-text-inner animate-fade-in-up">
                    <div class="desc">
                      <h1 class="head-1">🎯 Khuyến mãi</h1>
                      <h2 class="head-2">Lớn</h2>
                      <h2 class="head-3"><strong class="font-weight-bold">50%</strong> Giảm giá</h2>
                      <p class="category"><span>🌞 Khuyến mãi lớn giày sandal</span></p>
                      <p><router-link to="/products" class="btn btn-primary">🛍️ Mua sắm bộ sưu tập</router-link></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li style="background-image: url(images/img_bg_3.jpg);">
            <div class="overlay"></div>
            <div class="container-fluid">
              <div class="row">
                <div class="col-sm-6 offset-sm-3 text-center slider-text">
                  <div class="slider-text-inner animate-fade-in-up">
                    <div class="desc">
                      <h1 class="head-1">🆕 Sản phẩm</h1>
                      <h2 class="head-2">Mới</h2>
                      <h2 class="head-3">giảm đến <strong class="font-weight-bold">30%</strong></h2>
                      <p class="category"><span>👟 Giày phong cách mới cho nam</span></p>
                      <p><router-link to="/products" class="btn btn-primary">🛍️ Mua sắm bộ sưu tập</router-link></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Intro Section -->
    <div class="colorlib-intro">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 text-center">
            <h2 class="intro">🌟 Tất cả bắt đầu với một ý tưởng đơn giản: Tạo ra những sản phẩm chất lượng, thiết kế đẹp mà tôi muốn sở hữu.</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Collections -->
    <div class="colorlib-product">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-6 text-center">
            <div class="featured">
              <router-link to="/products?category=men" class="featured-img" style="background-image: url(images/men.jpg);"></router-link>
              <div class="desc">
                <h2><router-link to="/products?category=men">👨 Mua sắm bộ sưu tập Nam</router-link></h2>
              </div>
            </div>
          </div>
          <div class="col-sm-6 text-center">
            <div class="featured">
              <router-link to="/products?category=women" class="featured-img" style="background-image: url(images/women.jpg);"></router-link>
              <div class="desc">
                <h2><router-link to="/products?category=women">👩 Mua sắm bộ sưu tập Nữ</router-link></h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Best Selling Products -->
    <div class="colorlib-product">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>🔥 Sản phẩm bán chạy</h2>
          </div>
        </div>
        
        <!-- Product Filter -->
        <ProductFilter />
        
        <!-- Products Grid -->
        <div class="row row-pb-md">
          <ProductCard 
            v-for="product in bestSellingProducts" 
            :key="product.id" 
            :product="product"
            @product-added="handleProductAdded"
            @wishlist-toggled="handleWishlistToggled"
          />
        </div>
        
        <div class="row">
          <div class="col-md-12 text-center">
            <p><router-link to="/products" class="btn btn-primary btn-lg">🛍️ Mua tất cả sản phẩm</router-link></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Partners -->
    <div class="colorlib-partner">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading colorlib-heading-sm">
            <h2>🤝 Đối tác tin cậy</h2>
          </div>
        </div>
        <div class="row">
          <div class="col partner-col text-center">
            <img src="images/brand-1.jpg" class="img-fluid" alt="Brand 1">
          </div>
          <div class="col partner-col text-center">
            <img src="images/brand-2.jpg" class="img-fluid" alt="Brand 2">
          </div>
          <div class="col partner-col text-center">
            <img src="images/brand-3.jpg" class="img-fluid" alt="Brand 3">
          </div>
          <div class="col partner-col text-center">
            <img src="images/brand-4.jpg" class="img-fluid" alt="Brand 4">
          </div>
          <div class="col partner-col text-center">
            <img src="images/brand-5.jpg" class="img-fluid" alt="Brand 5">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProductCard from '../components/ProductCard.vue'
import ProductFilter from '../components/ProductFilter.vue'

export default {
  name: 'Home',
  components: {
    ProductCard,
    ProductFilter
  },
  computed: {
    ...mapGetters('products', ['filteredProducts']),
    
    bestSellingProducts() {
      return this.filteredProducts.slice(0, 8) // Show first 8 products
    }
  },
  mounted() {
    // Initialize with all products
    this.filterProducts({})
  },
  methods: {
    ...mapActions('products', ['filterProducts']),
    
    handleProductAdded(product) {
      // Show success notification
      this.$toast?.success(`${product.name} đã được thêm vào giỏ hàng!`)
    },
    
    handleWishlistToggled(product) {
      // Handle wishlist toggle
      this.$toast?.info(`${product.name} đã được thêm vào danh sách yêu thích!`)
    }
  }
}
</script>

<style scoped>
#colorlib-hero {
  height: 600px;
  position: relative;
  overflow: hidden;
}

.flexslider {
  height: 100%;
}

.slides {
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.slides li {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
}

.slider-text {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-text-inner {
  text-align: center;
  color: white;
}

.head-1, .head-2, .head-3 {
  margin: 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.head-1 {
  font-size: 4rem;
  margin-bottom: 10px;
}

.head-2 {
  font-size: 3rem;
  margin-bottom: 10px;
}

.head-3 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.category {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.colorlib-intro {
  padding: 80px 0;
  background: #f8f9fa;
}

.intro {
  font-size: 1.5rem;
  color: #333;
  line-height: 1.6;
  font-weight: 300;
}

.featured {
  position: relative;
  height: 400px;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.featured-img {
  display: block;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s;
}

.featured:hover .featured-img {
  transform: scale(1.05);
}

.featured .desc {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 40px 20px 20px;
  color: white;
}

.featured .desc h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.featured .desc a {
  color: white;
  text-decoration: none;
}

.colorlib-partner {
  padding: 60px 0;
  background: #f8f9fa;
}

.partner-col img {
  max-height: 60px;
  filter: grayscale(100%);
  transition: filter 0.3s;
}

.partner-col:hover img {
  filter: grayscale(0%);
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
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

@media (max-width: 768px) {
  .head-1 { font-size: 2.5rem; }
  .head-2 { font-size: 2rem; }
  .head-3 { font-size: 1.5rem; }
  .intro { font-size: 1.2rem; }
}
</style>
