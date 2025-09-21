```vue
<template>
  <div>
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <div class="container">
        <div class="row">
          <div class="col">
            <p class="bread">
              <span><router-link to="/">Trang chủ</router-link></span> / 
              <span>Tất cả sản phẩm</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <div class="colorlib-product">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>🛍️ Tất cả sản phẩm</h2>
            <p>Khám phá bộ sưu tập giày đa dạng với chất lượng cao và giá cả hợp lý</p>
            <div class="product-stats">
              <div class="stat-item">
                <span class="stat-number">{{ allProducts.length }}</span>
                <span class="stat-label">Sản phẩm</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ uniqueBrands.length }}</span>
                <span class="stat-label">Thương hiệu</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ categories.length }}</span>
                <span class="stat-label">Danh mục</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Product Filter -->
        <ProductFilter @filter-changed="handleFilterChanged" />
        
        <!-- Sort Options -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="sort-options">
              <span class="sort-label">Sắp xếp theo:</span>
              <select v-model="sortBy" @change="handleSort" class="form-select sort-select">
                <option value="name">Tên A-Z</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Products Count -->
        <div class="row mb-3">
          <div class="col-12">
            <p class="products-count">
              Hiển thị {{ filteredProducts.length }} / {{ allProducts.length }} sản phẩm
            </p>
          </div>
        </div>
        
        <!-- Products Grid -->
        <div v-if="filteredProducts.length" class="row row-pb-md">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @product-added="handleProductAdded"
            @wishlist-toggled="handleWishlistToggled"
          />
        </div>
        <div v-else class="row">
          <div class="col-12 text-center">
            <div class="no-products">
              <i class="icon-search" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
              <h3>Không tìm thấy sản phẩm nào</h3>
              <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <button @click="clearFilters" class="btn btn-primary">Xóa bộ lọc</button>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="row" v-if="totalPages > 1">
          <div class="col-12">
            <nav aria-label="Product pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                    Trước
                  </button>
                </li>
                <li 
                  v-for="page in visiblePages" 
                  :key="page"
                  class="page-item" 
                  :class="{ active: page === currentPage }"
                >
                  <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProductFilter from '../components/ProductFilter.vue';
import ProductCard from '../components/ProductCard.vue';

export default {
  name: 'Products',
  components: {
    ProductFilter,
    ProductCard
  },
  data() {
    return {
      allProducts: [],
      filteredProducts: [],
      sortBy: 'name',
      currentPage: 1,
      itemsPerPage: 12,
      currentFilters: {
        category: null,
        search: null
      },
      selectedColors: [],
      selectedSizes: [],
      priceMin: 0,
      priceMax: 10000000,
      isFiltering: false
    };
  },
  computed: {
    sortedProducts() {
      const products = [...this.filteredProducts];
      switch (this.sortBy) {
        case 'name':
          return products.sort((a, b) => a.name.localeCompare(b.name));
        case 'price-low':
          return products.sort((a, b) => (a.price || 0) - (b.price || 0));
        case 'price-high':
          return products.sort((a, b) => (b.price || 0) - (a.price || 0));
        case 'rating':
          return products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 'newest':
          return products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        default:
          return products;
      }
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1;
    },
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
    uniqueBrands() {
      return [...new Set(this.allProducts.map(product => product.brand))];
    },
    categories() {
      return [...new Set(this.allProducts.map(product => product.category))];
    },
    availableColors() {
      const set = new Set()
      this.allProducts.forEach(p => (p.colors || []).forEach(c => set.add(c)))
      return Array.from(set)
    },
    availableSizes() {
      const set = new Set()
      this.allProducts.forEach(p => (p.sizes || []).forEach(s => set.add(s)))
      return Array.from(set)
    },
    suggestedMin() {
      const arr = this.allProducts.map(p => p.price || 0)
      return arr.length ? Math.min(...arr) : 0
    },
    suggestedMax() {
      const arr = this.allProducts.map(p => p.originalPrice || p.price || 0)
      return arr.length ? Math.max(...arr) : 10000000
    }
  },
  watch: {
    '$route.query'() {
      this.handleRouteQuery();
    },
    filteredProducts() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      console.log('🔄 Bắt đầu fetch products...');
      
      try {
        // Thử API chi-tiet-san-pham trước
        console.log('📡 Gọi API chi-tiet-san-pham/hien-thi...');
        const response = await axios.get('/chi-tiet-san-pham/hien-thi');
        console.log('✅ Chi-tiet-san-pham API Response:', response.data);
        
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
              image: product.duongDanAnh || 'https://via.placeholder.com',
              price: basePrice,
              originalPrice: originalPrice,
              brand: product.thuongHieuTen || (product.thuongHieu && product.thuongHieu.ten) || 'Unknown Brand',
              rating: 5,
              colors: Array.isArray(product.mauSacList) ? product.mauSacList : [],
              sizes: Array.isArray(product.kichCoList) ? product.kichCoList : [],
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
          
          console.log('✅ Processed products from chi-tiet-san-pham:', this.allProducts.length);
        } else {
          console.log('⚠️ Chi-tiet-san-pham API trả về dữ liệu rỗng, thử fallback...');
          throw new Error('No data from chi-tiet-san-pham API');
        }
        
      } catch (error) {
        console.error('❌ Error fetching products from chi-tiet-san-pham:', error);
        
        // Fallback: thử API san-pham
        try {
          console.log('📡 Fallback: Gọi API san-pham/hien-thi...');
          const fallbackResponse = await axios.get('/san-pham/hien-thi');
          console.log('✅ San-pham API Response:', fallbackResponse.data);
          
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
              image: product.duongDanAnh || 'https://via.placeholder.com',
              price: basePrice,
              originalPrice: originalPrice,
              brand: product.thuongHieuTen || product.thuongHieu?.ten || 'Unknown Brand',
              rating: 5,
              colors: product.mauSacList || [],
              sizes: product.kichCoList || [],
              tags: tags,
              category: product.danhMuc || '',
              description: product.moTa || '',
              stock: Math.floor(Math.random() * 50) + 1
            }
          });
          
          console.log('✅ Processed products from san-pham fallback:', this.allProducts.length);
          
        } catch (fallbackError) {
          console.error('❌ Both APIs failed:', fallbackError);
          
          // Tạo dữ liệu demo nếu cả 2 API đều lỗi
          console.log('📦 Tạo dữ liệu demo...');
          this.createDemoProducts();
        }
      }
      
      // Cập nhật UI
      this.filteredProducts = [...this.allProducts];
      this.handleRouteQuery();
      console.log('🎉 Hoàn thành fetch products. Tổng số sản phẩm:', this.allProducts.length);
    },
    
    createDemoProducts() {
      console.log('📦 Tạo dữ liệu demo sản phẩm...');
      this.allProducts = [
        {
          id: '1',
          name: 'Giày Nike Air Max 270',
          image: 'https://via.placeholder.com/300x300',
          price: 2500000,
          originalPrice: 3000000,
          brand: 'Nike',
          rating: 5,
          colors: ['Đen', 'Trắng', 'Xanh'],
          sizes: ['39', '40', '41', '42'],
          tags: ['-17%', 'Bán chạy'],
          category: 'Giày thể thao',
          description: 'Giày thể thao Nike Air Max 270 với thiết kế hiện đại',
          stock: 25
        },
        {
          id: '2',
          name: 'Giày Adidas Ultraboost 22',
          image: 'https://via.placeholder.com/300x300',
          price: 3200000,
          originalPrice: 3800000,
          brand: 'Adidas',
          rating: 5,
          colors: ['Trắng', 'Đen'],
          sizes: ['39', '40', '41', '42', '43'],
          tags: ['-16%', 'Mới'],
          category: 'Giày thể thao',
          description: 'Giày chạy bộ Adidas Ultraboost 22 với công nghệ Boost',
          stock: 18
        },
        {
          id: '3',
          name: 'Giày Converse Chuck Taylor',
          image: 'https://via.placeholder.com/300x300',
          price: 1200000,
          originalPrice: 1500000,
          brand: 'Converse',
          rating: 4,
          colors: ['Đen', 'Trắng', 'Đỏ'],
          sizes: ['38', '39', '40', '41', '42'],
          tags: ['-20%', 'Classic'],
          category: 'Giày sneaker',
          description: 'Giày Converse Chuck Taylor All Star cổ điển',
          stock: 30
        }
      ];
      console.log('✅ Đã tạo', this.allProducts.length, 'sản phẩm demo');
    },
    
    async loadProductDetails() {
      try {
        // Load details for first 20 products to avoid too many API calls
        const productsToLoad = this.allProducts.slice(0, 20);
        
        for (let product of productsToLoad) {
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
    handleRouteQuery() {
      const { category, search } = this.$route.query;
      this.currentFilters = {
        category: category || null,
        search: search || null
      };
      this.applyFilters();
    },
    handleFilterChanged(filters) {
      this.currentFilters = { ...this.currentFilters, ...filters };
      this.applyFilters();
    },
    applyFilters() {
      let filtered = [...this.allProducts];
      if (this.currentFilters.search) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(this.currentFilters.search.toLowerCase())
        );
      }
      if (this.currentFilters.category) {
        filtered = filtered.filter(product => product.category === this.currentFilters.category);
      }
      filtered = filtered.filter(p => {
        const price = p.price || 0
        return price >= this.priceMin && price <= this.priceMax
      })
      this.filteredProducts = filtered;
    },
    handleSort() {
      // Sorting is handled by sortedProducts computed property
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    clearFilters() {
      this.resetFilters()
    },
    handleProductAdded(product) {
      this.$toast?.success(`${product.name} đã được thêm vào giỏ hàng!`);
    },
    handleWishlistToggled(product) {
      this.$toast?.info(`${product.name} đã được thêm vào danh sách yêu thích!`);
    },
    applyFilters() {
      let list = [...this.allProducts]
      if (this.selectedColors.length > 0) {
        list = list.filter(p => {
          const cs = p.colors || []
          return this.selectedColors.some(c => cs.includes(c))
        })
      }
      if (this.selectedSizes.length > 0) {
        list = list.filter(p => {
          const ss = p.sizes || []
          return this.selectedSizes.some(s => ss.includes(s))
        })
      }
      list = list.filter(p => {
        const price = p.price || 0
        return price >= this.priceMin && price <= this.priceMax
      })
      this.filteredProducts = list
    },
    resetFilters() {
      this.selectedColors = []
      this.selectedSizes = []
      this.priceMin = this.suggestedMin
      this.priceMax = this.suggestedMax
      this.applyFilters()
    },
    onFilterChanged() {
      this.isFiltering = true
      this.applyFilters()
    }
  }
};
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

.product-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
}

.sort-label {
  font-weight: 600;
  color: #333;
}

.sort-select {
  width: 200px;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  padding: 8px 12px;
}

.sort-select:focus {
  outline: none;
  border-color: #007bff;
}

.products-count {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.no-products {
  padding: 60px 20px;
  text-align: center;
}

.no-products h3 {
  color: #666;
  margin-bottom: 15px;
}

.no-products p {
  color: #999;
  margin-bottom: 30px;
}

.card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.card-text {
  margin-bottom: 8px;
  color: #666;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-outline-secondary {
  border-color: #6c757d;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
}

.pagination {
  margin-top: 40px;
}

.page-link {
  color: #007bff;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  margin: 0 2px;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.page-link:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.page-item.active .page-link {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d;
  background: #fff;
  border-color: #dee2e6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .sort-options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sort-select {
    width: 100%;
  }
  
  .product-stats {
    flex-direction: column;
    gap: 20px;
    padding: 15px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
</style>
