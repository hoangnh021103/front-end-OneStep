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
            v-for="product in availableBestSellingProducts"
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
            v-for="product in availableProducts"
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
  computed: {
    availableProducts() {
      // Lọc sản phẩm có stock > 0 và stock không phải null/undefined
      return this.allProducts.filter(product => product.stock && product.stock > 0)
    },
    availableBestSellingProducts() {
      // Trả về sản phẩm bán chạy đã được filter
      return this.bestSellingProducts
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
      console.log('🔄 Home - Bắt đầu fetch products...');
      
      try {
        // Thử API chi-tiet-san-pham trước
        console.log('📡 Home - Gọi API chi-tiet-san-pham/hien-thi...');
        const response = await axios.get('/chi-tiet-san-pham/hien-thi');
        console.log('✅ Home - Chi-tiet-san-pham API Response:', response.data);
        
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
          
          console.log('✅ Home - Processed products from chi-tiet-san-pham:', this.allProducts.length);
        } else {
          console.log('⚠️ Home - Chi-tiet-san-pham API trả về dữ liệu rỗng, thử fallback...');
          throw new Error('No data from chi-tiet-san-pham API');
        }
        
      } catch (error) {
        console.error('❌ Home - Error fetching products from chi-tiet-san-pham:', error);
        
        // Fallback: thử API san-pham
        try {
          console.log('📡 Home - Fallback: Gọi API san-pham/hien-thi...');
          const fallbackResponse = await axios.get('/san-pham/hien-thi');
          console.log('✅ Home - San-pham API Response:', fallbackResponse.data);
          
          this.allProducts = fallbackResponse.data.map(product => {
            const basePrice = product.giaBan || product.gia || Math.floor(Math.random() * 2000000) + 500000;
            const originalPrice = product.giaGoc || product.giaNiemYet || Math.floor(basePrice * (1.2 + Math.random() * 0.3));
            const discountPercent = Math.floor(((originalPrice - basePrice) / originalPrice) * 100);
            const tags = product.tags || [];
            if (discountPercent > 0) {
              tags.push(`-${discountPercent}%`);
            }
            
            return {
              id: product.productId || product.id || Math.random().toString(),
              name: product.tenSanPham || 'Unknown Product',
              image: product.duongDanAnh || product.hinhAnh || product.image || product.anh || '/images/item-1.jpg',
              price: basePrice,
              originalPrice: originalPrice,
              brand: product.thuongHieuTen || product.thuongHieu?.ten || '',
              rating: 5,
              colors: product.mauSacList || ['Đen', 'Trắng'],
              sizes: product.kichCoList || ['39', '40', '41', '42'],
              tags: tags,
              category: product.danhMuc || '',
              description: product.moTa || '',
              stock: Math.floor(Math.random() * 50) + 1,
              // Thông tin bổ sung cho navigation
              sanPhamId: product.productId || product.id,
              productId: product.productId || product.id
            }
          });
          
          console.log('✅ Home - Processed products from san-pham fallback:', this.allProducts.length);
          
        } catch (fallbackError) {
          console.error('❌ Home - Both APIs failed:', fallbackError);
          console.log('📦 Home - Tạo dữ liệu demo...');
          this.createFallbackProducts();
        }
      }
      
      // Lấy 8 sản phẩm có stock > 0 đầu tiên làm sản phẩm bán chạy
      this.bestSellingProducts = this.allProducts.filter(product => product.stock && product.stock > 0).slice(0, 8);
      console.log('🎉 Home - Hoàn thành fetch products. Tổng số sản phẩm:', this.allProducts.length, 'Sản phẩm khả dụng:', this.availableProducts.length);

      // Debug: In ra stock của các sản phẩm
      console.log('🔍 Debug stock của tất cả sản phẩm:');
      this.allProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - Stock: ${product.stock} - Available: ${product.stock && product.stock > 0}`);
      });

      console.log('🔍 Debug stock của sản phẩm khả dụng:');
      this.availableProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - Stock: ${product.stock}`);
      });

      console.log('🔍 Debug stock của sản phẩm bán chạy:');
      this.bestSellingProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - Stock: ${product.stock}`);
      });
    },
    
    async loadProductDetails() {
      try {
        // Fetch chi tiết cho từng sản phẩm bán chạy
        for (let product of this.bestSellingProducts) {
          try {
            const detailsResponse = await axios.get(`http://localhost:8080/chi-tiet-san-pham/hien-thi-theo-san-pham/${product.id}`);
            if (detailsResponse.data && detailsResponse.data.length > 0) {
              // Lấy variant đầu tiên làm giá mặc định
              const firstVariant = detailsResponse.data[0];
              product.price = firstVariant.giaTien || product.price;
              product.originalPrice = (firstVariant.giaTien || 0) + (firstVariant.tienGiamGia || 0);
              product.stock = firstVariant.soLuongTon || product.stock;
              product.image = firstVariant.duongDanAnh || product.image;
            }
          } catch (detailError) {
            console.warn(`Could not fetch details for product ${product.id}:`, detailError);
          }
        }
      } catch (error) {
        console.error('Error loading product details:', error);
      }
    },
    
    createFallbackProducts() {
      const fallbackProducts = [
        {
          id: 1,
          sanPhamId: 1,
          productId: 1,
          name: 'Giày Adidas Ultraboost',
          image: '/images/item-1.jpg',
          price: 1890000,
          originalPrice: 2200000,
          brand: 'Adidas',
          rating: 5,
          colors: ['Đen', 'Trắng'],
          sizes: ['39', '40', '41', '42'],
          tags: ['-14%', 'MỚI'],
          category: 'Giày thể thao',
          description: 'Giày thể thao cao cấp với công nghệ Boost',
          stock: 15
        },
        {
          id: 2,
          sanPhamId: 2,
          productId: 2,
          name: 'Giày Converse Sneaker',
          image: '/images/item-2.jpg',
          price: 850000,
          originalPrice: 1200000,
          brand: 'Converse',
          rating: 5,
          colors: ['Đen', 'Trắng', 'Đỏ'],
          sizes: ['38', '39', '40', '41'],
          tags: ['-29%', 'SALE'],
          category: 'Giày sneaker',
          description: 'Giày sneaker cổ điển với thiết kế đơn giản',
          stock: 20
        },
        {
          id: 3,
          sanPhamId: 3,
          productId: 3,
          name: 'Giày Nike Court Vision Mid',
          image: '/images/item-3.jpg',
          price: 1450000,
          originalPrice: 1800000,
          brand: 'Nike',
          rating: 5,
          colors: ['Xám', 'Trắng'],
          sizes: ['39', '40', '41', '42', '43'],
          tags: ['-19%', 'QUYỀN'],
          category: 'Giày thể thao',
          description: 'Giày thể thao với thiết kế hiện đại',
          stock: 12
        },
        {
          id: 4,
          sanPhamId: 4,
          productId: 4,
          name: 'Giày Puma Speedcat OG',
          image: '/images/item-4.jpg',
          price: 1200000,
          originalPrice: 1500000,
          brand: 'Puma',
          rating: 5,
          colors: ['Xanh', 'Đen'],
          sizes: ['39', '40', '41', '42'],
          tags: ['-20%', 'MỚI'],
          category: 'Giày thể thao',
          description: 'Giày thể thao với công nghệ tiên tiến',
          stock: 18
        },
        {
          id: 5,
          sanPhamId: 5,
          productId: 5,
          name: 'Giày Vans Old Skool',
          image: '/images/item-5.jpg',
          price: 950000,
          originalPrice: 1300000,
          brand: 'Vans',
          rating: 5,
          colors: ['Đen', 'Trắng'],
          sizes: ['38', '39', '40', '41'],
          tags: ['-27%', 'SALE'],
          category: 'Giày sneaker',
          description: 'Giày sneaker với thiết kế cổ điển',
          stock: 25
        }
      ];
      
      this.allProducts = fallbackProducts;
      // Lấy sản phẩm có stock > 0 đầu tiên làm sản phẩm bán chạy
      this.bestSellingProducts = fallbackProducts.filter(p => p.stock && p.stock > 0).slice(0, 4);
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
