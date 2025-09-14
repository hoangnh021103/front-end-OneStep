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
        <ProductFilter />
        
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
        <div class="row row-pb-md" v-if="filteredProducts.length > 0">
          <ProductCard 
            v-for="product in paginatedProducts" 
            :key="product.id" 
            :product="product"
            @product-added="handleProductAdded"
            @wishlist-toggled="handleWishlistToggled"
          />
        </div>
        
        <!-- No Products Message -->
        <div v-else class="row">
          <div class="col-12 text-center">
            <div class="no-products">
              <i class="icon-search" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
              <h3>Không tìm thấy sản phẩm nào</h3>
              <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <button @click="resetFilters" class="btn btn-primary">Xóa bộ lọc</button>
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
import { mapGetters, mapActions } from 'vuex'
import ProductCard from '../components/ProductCard.vue'
import ProductFilter from '../components/ProductFilter.vue'

export default {
  name: 'Products',
  components: {
    ProductCard,
    ProductFilter
  },
  data() {
    return {
      sortBy: 'name',
      currentPage: 1,
      itemsPerPage: 12
    }
  },
  computed: {
    ...mapGetters('products', ['filteredProducts', 'allProducts']),
    ...mapGetters('filters', ['currentFilters']),
    
    sortedProducts() {
      const products = [...this.filteredProducts]
      
      switch (this.sortBy) {
        case 'name':
          return products.sort((a, b) => a.name.localeCompare(b.name))
        case 'price-low':
          return products.sort((a, b) => a.price - b.price)
        case 'price-high':
          return products.sort((a, b) => b.price - a.price)
        case 'rating':
          return products.sort((a, b) => b.rating - a.rating)
        case 'newest':
          return products.sort((a, b) => b.id - a.id)
        default:
          return products
      }
    },
    
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.sortedProducts.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },
    
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    },
    
    uniqueBrands() {
      const brands = [...new Set(this.allProducts.map(product => product.brand))]
      return brands
    },
    
    categories() {
      const cats = [...new Set(this.allProducts.map(product => product.category))]
      return cats.map(cat => cat === 'men' ? 'Nam' : cat === 'women' ? 'Nữ' : cat)
    }
  },
  watch: {
    '$route.query'() {
      this.handleRouteQuery()
    },
    filteredProducts() {
      this.currentPage = 1
    }
  },
  mounted() {
    this.handleRouteQuery()
    // Đảm bảo hiển thị tất cả sản phẩm khi load trang
    if (this.filteredProducts.length === 0) {
      this.filterProducts({})
    }
  },
  methods: {
    ...mapActions('products', ['filterProducts']),
    ...mapActions('filters', ['resetFilters', 'setCategory']),
    
    handleRouteQuery() {
      const { category, search } = this.$route.query
      
      if (category) {
        this.setCategory(category)
      }
      
      if (search) {
        this.searchProducts(search)
      }
      
      this.filterProducts(this.currentFilters)
    },
    
    handleSort() {
      // Sorting is handled by computed property
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    
    resetFilters() {
      this.resetFilters()
      this.filterProducts({})
      this.currentPage = 1
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
