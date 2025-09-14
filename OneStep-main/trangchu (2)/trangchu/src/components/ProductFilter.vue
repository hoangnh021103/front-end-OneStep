<template>
  <div class="row mb-4">
    <div class="col-12">
      <div class="homepage-price-filter">
        <!-- Color and Size Filters -->
        <div class="homepage-color-size-filter" style="margin-bottom: 16px; display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
          <div>
            <span style="font-weight:600;">Lọc theo màu:</span>
            <button 
              v-for="color in availableColors" 
              :key="color"
              class="color-filter-btn" 
              :class="{ active: filters.color === color }"
              :data-color="color"
              @click="setColorFilter(color)"
            >
              {{ color }}
            </button>
          </div>
          <div>
            <span style="font-weight:600;">Lọc theo size:</span>
            <button 
              v-for="size in availableSizes" 
              :key="size"
              class="size-filter-btn" 
              :class="{ active: filters.size === size }"
              :data-size="size"
              @click="setSizeFilter(size)"
            >
              {{ size }}
            </button>
          </div>
        </div>
        
        <!-- Price Filter -->
        <div class="filter-container">
          <div class="filter-label">
            <i class="icon-filter"></i>
            <span>Lọc theo giá:</span>
          </div>
          <div class="price-filter-buttons">
            <button 
              v-for="range in priceRanges" 
              :key="range.value"
              class="price-filter-btn" 
              :class="{ active: filters.priceRange === range.value }"
              :data-price="range.value"
              @click="setPriceFilter(range.value)"
            >
              {{ range.label }}
            </button>
          </div>
          <div class="custom-price-input">
            <input 
              type="number" 
              v-model="customMinPrice"
              placeholder="Từ" 
              class="price-input-small"
            >
            <span class="price-separator">-</span>
            <input 
              type="number" 
              v-model="customMaxPrice"
              placeholder="Đến" 
              class="price-input-small"
            >
            <button class="apply-custom-price-btn" @click="applyCustomPrice">
              <i class="icon-search"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductFilter',
  data() {
    return {
      customMinPrice: '',
      customMaxPrice: '',
      priceRanges: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Dưới 1M', value: '0-1000000' },
        { label: '1M - 2.5M', value: '1000000-2500000' },
        { label: '2.5M - 4M', value: '2500000-4000000' },
        { label: 'Trên 4M', value: '4000000-9999999' }
      ]
    }
  },
  computed: {
    ...mapGetters('filters', ['currentFilters']),
    ...mapGetters('products', ['allProducts']),
    
    filters() {
      return this.currentFilters
    },
    
    availableColors() {
      const colors = new Set()
      this.allProducts.forEach(product => {
        product.colors.forEach(color => colors.add(color))
      })
      return ['all', ...Array.from(colors)]
    },
    
    availableSizes() {
      const sizes = new Set()
      this.allProducts.forEach(product => {
        product.sizes.forEach(size => sizes.add(size))
      })
      return ['all', ...Array.from(sizes).sort((a, b) => parseInt(a) - parseInt(b))]
    }
  },
  methods: {
    ...mapActions('filters', ['setColor', 'setSize', 'setPriceRange']),
    ...mapActions('products', ['filterProducts']),
    
    setColorFilter(color) {
      this.setColor(color)
      this.applyFilters()
    },
    
    setSizeFilter(size) {
      this.setSize(size)
      this.applyFilters()
    },
    
    setPriceFilter(priceRange) {
      this.setPriceRange(priceRange)
      this.applyFilters()
    },
    
    applyCustomPrice() {
      if (this.customMinPrice || this.customMaxPrice) {
        const min = parseInt(this.customMinPrice) || 0
        const max = parseInt(this.customMaxPrice) || 9999999
        const priceRange = `${min}-${max}`
        this.setPriceRange(priceRange)
        this.applyFilters()
      }
    },
    
    applyFilters() {
      this.filterProducts(this.filters)
    }
  }
}
</script>

<style scoped>
.homepage-color-size-filter {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.color-filter-btn,
.size-filter-btn,
.price-filter-btn {
  background: white;
  border: 2px solid #e9ecef;
  padding: 8px 16px;
  margin: 4px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 500;
}

.color-filter-btn:hover,
.size-filter-btn:hover,
.price-filter-btn:hover {
  border-color: #007bff;
  color: #007bff;
}

.color-filter-btn.active,
.size-filter-btn.active,
.price-filter-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.filter-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
}

.price-filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.custom-price-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-input-small {
  width: 100px;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
}

.price-input-small:focus {
  outline: none;
  border-color: #007bff;
}

.price-separator {
  font-weight: 600;
  color: #666;
}

.apply-custom-price-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.apply-custom-price-btn:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .homepage-color-size-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .price-filter-buttons {
    justify-content: flex-start;
  }
}
</style>
