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
            <h2> Tất cả sản phẩm</h2>
            <p>Khám phá bộ sưu tập giày đa dạng với chất lượng cao và giá cả hợp lý</p>
            <div class="product-stats">
              <div class="stat-item">
                <span class="stat-number">{{ filteredProducts.length }}</span>
                <span class="stat-label">Sản phẩm khả dụng</span>
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
        
        
        
        <!-- Products Grid -->
        <div v-if="paginatedProducts.length" class="row row-pb-md">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
            @product-added="handleProductAdded"
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
import { mapGetters, mapActions } from 'vuex';
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
    ...mapGetters('products', ['allProducts', 'filteredProducts']),
    ...mapGetters('filters', ['currentFilters']),
    
    sortedProducts() {
      // Sử dụng filteredProducts từ store, không cần sort lại vì đã được sort trong store
      return this.filteredProducts;
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
    this.loadProducts();
  },
  methods: {
    ...mapActions('products', ['fetchProducts', 'filterProducts']),
    ...mapActions('filters', ['setColor', 'setSize', 'setPriceRange']),
    
    async loadProducts() {
      console.log('🔄 Loading products...');
      try {
        await this.fetchProducts();
        // Áp dụng filter hiện tại sau khi load xong
        this.applyCurrentFilters();
      } catch (error) {
        console.error('❌ Error loading products:', error);
        this.$toast?.error('Không thể tải danh sách sản phẩm');
      }
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
              product.image = firstVariant.duongDanAnh || firstVariant.hinhAnh || firstVariant.image || firstVariant.anh || product.image;
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
      this.applyCurrentFilters();
    },
    handleFilterChanged(filters) {
      console.log('🔍 Filter changed:', filters);
      this.currentFilters = { ...this.currentFilters, ...filters };
      this.applyCurrentFilters();
    },
    
    applyCurrentFilters() {
      const filters = {
        ...this.currentFilters,
        priceRange: this.getPriceRange(),
        color: this.selectedColors.length > 0 ? this.selectedColors[0] : 'all',
        size: this.selectedSizes.length > 0 ? this.selectedSizes[0] : 'all'
      };
      this.filterProducts(filters);
    },
    
    getPriceRange() {
      if (this.priceMin > 0 || this.priceMax < 10000000) {
        return `${this.priceMin}-${this.priceMax}`;
      }
      return 'all';
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
    resetFilters() {
      this.selectedColors = []
      this.selectedSizes = []
      this.priceMin = this.suggestedMin
      this.priceMax = this.suggestedMax
      this.applyCurrentFilters()
    },
    onFilterChanged() {
      this.isFiltering = true
      this.applyCurrentFilters()
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
