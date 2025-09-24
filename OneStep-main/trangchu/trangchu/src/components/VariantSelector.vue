<template>
  <div class="variant-selector" v-if="showSelector">
    <div class="selector-header">
      <h5>Chọn phiên bản:</h5>
    </div>
    
    <div class="variant-options">
      <div class="color-options" v-if="availableColors.length > 1">
        <label>Màu:</label>
        <div class="color-buttons">
          <button 
            v-for="color in availableColors" 
            :key="color.id"
            class="color-btn"
            :class="{ active: selectedColor === color.id }"
            :style="{ backgroundColor: getColorValue(color.id) }"
            @click="selectColor(color.id)"
            :title="color.name"
          ></button>
        </div>
      </div>
      
      <div class="size-options" v-if="availableSizes.length > 1">
        <label>Size:</label>
        <div class="size-buttons">
          <button 
            v-for="size in availableSizes" 
            :key="size.id"
            class="size-btn"
            :class="{ active: selectedSize === size.id }"
            @click="selectSize(size.id)"
          >
            {{ size.name }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="selected-variant" v-if="selectedVariant">
      <div class="variant-price">
        <span class="current-price">{{ formatPrice(selectedVariant.price) }}</span>
        <span v-if="selectedVariant.originalPrice > selectedVariant.price" class="original-price">
          {{ formatPrice(selectedVariant.originalPrice) }}
        </span>
      </div>
      <div class="variant-stock">
        <span v-if="selectedVariant.stock > 0" class="stock-available">
          Còn {{ selectedVariant.stock }} sản phẩm
        </span>
        <span v-else class="stock-out">
          Hết hàng
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VariantSelector',
  props: {
    variants: {
      type: Array,
      default: () => []
    },
    showSelector: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedColor: null,
      selectedSize: null
    }
  },
  computed: {
    availableColors() {
      const colors = [...new Set(this.variants.map(v => v.colorId))]
      return colors.map(colorId => ({
        id: colorId,
        name: this.getColorName(colorId)
      }))
    },
    
    availableSizes() {
      const sizes = [...new Set(this.variants.map(v => v.sizeId))]
      return sizes.map(sizeId => ({
        id: sizeId,
        name: this.getSizeName(sizeId)
      }))
    },
    
    selectedVariant() {
      if (!this.selectedColor || !this.selectedSize) return null
      return this.variants.find(v => 
        v.colorId === this.selectedColor && v.sizeId === this.selectedSize
      )
    }
  },
  watch: {
    variants: {
      handler(newVariants) {
        if (newVariants.length > 0) {
          this.selectedColor = newVariants[0].colorId
          this.selectedSize = newVariants[0].sizeId
        }
      },
      immediate: true
    },
    
    selectedVariant: {
      handler(newVariant) {
        if (newVariant) {
          this.$emit('variant-selected', newVariant)
        }
      }
    }
  },
  methods: {
    selectColor(colorId) {
      this.selectedColor = colorId
      // Reset size if not available for this color
      const availableSizesForColor = this.variants
        .filter(v => v.colorId === colorId)
        .map(v => v.sizeId)
      
      if (!availableSizesForColor.includes(this.selectedSize)) {
        this.selectedSize = availableSizesForColor[0]
      }
    },
    
    selectSize(sizeId) {
      this.selectedSize = sizeId
      // Reset color if not available for this size
      const availableColorsForSize = this.variants
        .filter(v => v.sizeId === sizeId)
        .map(v => v.colorId)
      
      if (!availableColorsForSize.includes(this.selectedColor)) {
        this.selectedColor = availableColorsForSize[0]
      }
    },
    
    getColorName(colorId) {
      const colorMap = {
        1: 'Đen',
        2: 'Trắng',
        3: 'Xanh',
        4: 'Đỏ',
        5: 'Vàng',
        6: 'Hồng',
        7: 'Xám',
        8: 'Nâu'
      }
      return colorMap[colorId] || `Màu ${colorId}`
    },
    
    getSizeName(sizeId) {
      const sizeMap = {
        1: '39',
        2: '40',
        3: '41',
        4: '42',
        5: '43',
        6: '44',
        7: '45'
      }
      return sizeMap[sizeId] || `Size ${sizeId}`
    },
    
    getColorValue(colorId) {
      const colorMap = {
        1: '#000000',
        2: '#ffffff',
        3: '#007bff',
        4: '#dc3545',
        5: '#ffc107',
        6: '#e83e8c',
        7: '#6c757d',
        8: '#8b4513'
      }
      return colorMap[colorId] || '#cccccc'
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
.variant-selector {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.selector-header h5 {
  margin-bottom: 15px;
  color: #333;
  font-size: 14px;
}

.variant-options {
  margin-bottom: 15px;
}

.color-options,
.size-options {
  margin-bottom: 10px;
}

.color-options label,
.size-options label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 600;
}

.color-buttons,
.size-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.size-btn {
  padding: 4px 8px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.3s;
}

.size-btn:hover {
  border-color: #007bff;
  color: #007bff;
}

.size-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.selected-variant {
  border-top: 1px solid #e9ecef;
  padding-top: 10px;
}

.variant-price {
  margin-bottom: 5px;
}

.current-price {
  font-size: 14px;
  font-weight: 700;
  color: #007bff;
  margin-right: 8px;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.variant-stock {
  font-size: 11px;
}

.stock-available {
  color: #28a745;
  font-weight: 600;
}

.stock-out {
  color: #dc3545;
  font-weight: 600;
}
</style>
