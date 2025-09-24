<template>
  <div>
    <!-- Hero Slider -->
    <aside id="colorlib-hero">
      <div class="flexslider">
        <ul class="slides">
          <li style="background-image: url(images/item-11.jpg);">
            <div class="overlay"></div>
            <div class="container-fluid">
              <div class="row">
              </div>
            </div>
          </li>
          <li style="background-image: url(images/item-4.jpg);">
            <div class="overlay"></div>
            <div class="container-fluid">
              <div class="row">
              </div>
            </div>
          </li>
          <li style="background-image: url(images/item-13.jpg);">
            <div class="overlay"></div>
            <div class="container-fluid">
              <div class="row">
              </div>
            </div>
          </li>
          <li style="background-image: url(images/item-14.jpg);">
            <div class="overlay"></div>
            <div class="container-fluid">
              <div class="row">
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
          />
        </div>
        
        <div class="row">
          <div class="col-md-12 text-center">
            <p><router-link to="/products" class="btn btn-primary btn-lg">🛍️ Xem tất cả sản phẩm</router-link></p>
          </div>
        </div>
      </div>
    </div>

    <!-- All Products Section -->
    <div class="colorlib-product all-products-section">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>🛍️ Tất cả sản phẩm</h2>
            <p>Khám phá bộ sưu tập giày đa dạng với chất lượng cao và giá cả hợp lý</p>
          </div>
        </div>
        
        <!-- Products Grid -->
        <div class="row row-pb-md">
          <ProductCard 
            v-for="product in allProducts" 
            :key="product.id" 
            :product="product"
            @product-added="handleProductAdded"
          />
        </div>
        
        <div class="row">
          <div class="col-md-12 text-center">
            <p><router-link to="/products" class="btn btn-outline-primary btn-lg">🔍 Xem thêm sản phẩm</router-link></p>
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
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import ProductCard from '../components/ProductCard.vue'
import ProductFilter from '../components/ProductFilter.vue'

export default {
  name: 'Home',
  components: {
    ProductCard,
    ProductFilter
  },
  data() {
    return {
      allProducts: [],
      bestSellingProducts: []
    }
  },
  mounted() {
    this.fetchProducts()
    this.initSlider()
  },
  methods: {
    initSlider() {
      // Khởi tạo slider với hiệu ứng chuyển động tự động
      const slides = document.querySelectorAll('.slides li')
      let currentSlide = 0
      
      if (slides.length === 0) return
      
      // Ẩn tất cả slides trừ slide đầu tiên
      slides.forEach((slide, index) => {
        if (index === 0) {
          slide.style.opacity = '1'
        } else {
          slide.style.opacity = '0'
        }
      })
      
      // Tự động chuyển slide mỗi 4 giây
      setInterval(() => {
        // Ẩn slide hiện tại
        slides[currentSlide].style.opacity = '0'
        
        // Chuyển sang slide tiếp theo
        currentSlide = (currentSlide + 1) % slides.length
        
        // Hiển thị slide mới
        slides[currentSlide].style.opacity = '1'
      }, 4000)
    },
    
    async fetchProducts() {
      console.log('🔄 Home - Bắt đầu fetch products từ API...');
      
      try {
        // Gọi API chi-tiet-san-pham để lấy sản phẩm
        console.log('📡 Home - Gọi API chi-tiet-san-pham/hien-thi...');
        const response = await axios.get('/chi-tiet-san-pham/hien-thi');
        console.log('✅ Home - API Response:', response.data);
        
        if (response.data && response.data.length > 0) {
          this.allProducts = response.data.map(product => {
            // Lấy giá từ ChiTietSanPhamResponse
            const basePrice = product.giaTien || product.giaBan || product.gia || 0;
            const discountAmount = product.tienGiamGia || 0;
            const originalPrice = basePrice + discountAmount;
            
            // Tạo tags giảm giá
            const discountPercent = discountAmount > 0 ? Math.floor((discountAmount / originalPrice) * 100) : 0;
            const tags = [];
            if (discountPercent > 0) {
              tags.push(`-${discountPercent}%`);
            }
            
            return {
              id: product.id || product.chiTietSanPhamId || Math.random().toString(),
              name: product.tenSanPham || product.tenChiTiet || 'Unknown Product',
              image: product.duongDanAnh || product.hinhAnh || product.image || product.anh || '/images/item-1.jpg',
              price: basePrice,
              originalPrice: originalPrice,
              brand: product.thuongHieuTen || (product.thuongHieu && product.thuongHieu.ten) || '',
              rating: 5,
              colors: Array.isArray(product.mauSacList) ? product.mauSacList : ['Đen', 'Trắng'],
              sizes: Array.isArray(product.kichCoList) ? product.kichCoList : ['39', '40', '41', '42'],
              tags: tags,
              category: product.danhMuc || '',
              description: product.moTa || '',
              stock: product.soLuongTon || 0,
              // Thông tin bổ sung
              sanPhamId: product.sanPhamId,
              chiTietSanPhamId: product.chiTietSanPhamId,
              giaTien: product.giaTien,
              tienGiamGia: product.tienGiamGia,
              soLuongTon: product.soLuongTon
            }
          });
          
          console.log('✅ Home - Đã xử lý sản phẩm từ API:', this.allProducts.length);
        } else {
          console.log('⚠️ Home - API trả về dữ liệu rỗng');
          this.allProducts = [];
        }
        
      } catch (error) {
        console.error('❌ Home - Lỗi khi gọi API:', error);
        this.allProducts = [];
        // Hiển thị thông báo lỗi cho người dùng
        this.$toast?.error('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      }
      
      // Lấy 8 sản phẩm đầu tiên làm sản phẩm bán chạy
      this.bestSellingProducts = this.allProducts.slice(0, 8);
      console.log('🎉 Home - Hoàn thành fetch products. Tổng số sản phẩm:', this.allProducts.length);
    },
    
    
    
    handleProductAdded(product) {
      // Show success notification
      this.$toast?.success(`${product.name} đã được thêm vào giỏ hàng!`)
    },
    
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
  position: relative;
  overflow: hidden;
}

.slides {
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
}

.slides li {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  animation: slideIn 2s ease-in-out;
}

.slides li:first-child {
  opacity: 1;
}

/* Animation cho slider */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(1.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Hiệu ứng zoom nhẹ cho background */
.slides li::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  background-size: cover;
  background-position: center;
  transition: transform 8s ease-out;
  transform: scale(1);
}

.slides li:hover::before {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
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

.all-products-section {
  background: #f8f9fa;
  padding: 80px 0;
}

.all-products-section .colorlib-heading h2 {
  margin-bottom: 20px;
}

.all-products-section .colorlib-heading p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 40px;
}

.colorlib-partner {
  padding: 60px 0;
  background: white;
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
  .intro { font-size: 1.2rem; }
}
</style>
