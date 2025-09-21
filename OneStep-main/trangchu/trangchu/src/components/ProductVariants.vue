<template>
  <div class="product-variants" v-if="variants.length > 0">
    <div class="variants-header">
      <h4>🛍️ Các phiên bản có sẵn</h4>
      <p class="variants-count">{{ variants.length }} phiên bản</p>
    </div>
    
    <div class="variants-grid">
      <div 
        v-for="variant in variants" 
        :key="variant.id"
        class="variant-card"
        :class="{ 
          'selected': selectedVariant?.id === variant.id,
          'out-of-stock': !variant.canPurchase,
          'inactive': !variant.isActive
        }"
        @click="selectVariant(variant)"
      >
        <div class="variant-image">
          <img :src="variant.image" :alt="`Variant ${variant.id}`" />
          <div class="variant-overlay">
          <div class="variant-badges">
            <span v-if="!variant.canPurchase" class="stock-badge out">
                Hết hàng
              </span>
              <span v-else-if="variant.stock <= 5" class="stock-badge low">
                Sắp hết
              </span>
            </div>
          </div>
        </div>
        
        <div class="variant-info">
          <div class="variant-details">
            <span class="color-info">Màu: {{ getColorName(variant.colorId) }}</span>
            <span class="size-info">Size: {{ getSizeName(variant.sizeId) }}</span>
          </div>
          
          <div class="variant-price">
            <span class="current-price">{{ formatPrice(variant.price) }}</span>
            <span v-if="variant.originalPrice > variant.price" class="original-price">
              ({{ formatPrice(variant.originalPrice) }})
            </span>
          </div>
          <!-- Đã xóa phần variant-stock -->
        </div>
        
        <div class="variant-actions">
          <button 
            class="btn btn-sm"
            :class="selectedVariant?.id === variant.id ? 'btn-primary' : 'btn-outline-primary'"
            @click.stop="selectVariant(variant)"
            :disabled="!variant.canPurchase"
          >
            {{ selectedVariant?.id === variant.id ? 'Đã chọn' : 'Chọn' }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="selectedVariant" class="selected-variant-info">
      <div class="selected-info">
        <h5>✅ Phiên bản đã chọn:</h5>
        <p>
          <strong>{{ getColorName(selectedVariant.colorId) }}</strong> - 
          Size <strong>{{ getSizeName(selectedVariant.sizeId) }}</strong>
        </p>
        <p class="selected-price">
          Giá: <strong>{{ formatPrice(selectedVariant.price) }}</strong>
          <span v-if="selectedVariant.originalPrice > selectedVariant.price" class="original-price">
            (Giá gốc: {{ formatPrice(selectedVariant.originalPrice) }})
          </span>
        </p>
        <p class="selected-stock">
          Tồn kho: <strong>{{ selectedVariant.stock }} sản phẩm</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductVariants',
  props: {
    variants: {
      type: Array,
      default: () => []
    },
    selectedVariant: {
      type: Object,
      default: null
    }
  },
  methods: {
    async fetchVariantPrices(productId) {
      try {
        const response = await axios.get(`http://localhost:8080/chi-tiet-san-pham/hien-thi-theo-san-pham/${productId}`);
        if (response.data && Array.isArray(response.data)) {
          const updatedVariants = response.data.map(apiVariant => ({
            id: apiVariant.maChiTiet,
            colorId: apiVariant.mauSacId,
            sizeId: apiVariant.kichCoId,
            image: apiVariant.duongDanAnh,
            price: apiVariant.giaTien,
            originalPrice: apiVariant.giaTien + apiVariant.tienGiamGia,
            stock: apiVariant.soLuongTon,
            canPurchase: apiVariant.soLuongTon > 0 && apiVariant.trangThai === 1,
            isActive: apiVariant.trangThai === 1
          }));
          this.$emit('update-variants', updatedVariants);
        } else {
          console.error('Invalid data format from API:', response.data);
        }
      } catch (error) {
        console.error('Error fetching variant prices:', error);
      }
    },
    selectVariant(variant) {
      if (variant.canPurchase) {
        this.$emit('variant-selected', variant);
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    }
  },
  mounted() {
    if (this.variants.length > 0) {
      const productId = this.variants[0].sanPhamId; // Assuming all variants belong to the same product
      this.fetchVariantPrices(productId);
    }
  }
};
</script>

<style scoped>
.product-variants {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.variants-header {
  margin-bottom: 20px;
  text-align: center;
}

.variants-header h4 {
  color: #333;
  margin-bottom: 5px;
}

.variants-count {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.variants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.variant-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.variant-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.variant-card.selected {
  border-color: #007bff;
  background: #f0f8ff;
}

.variant-card.out-of-stock {
  opacity: 0.6;
  cursor: not-allowed;
}

.variant-card.inactive {
  opacity: 0.5;
}

.variant-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.variant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.variant-card:hover .variant-image img {
  transform: scale(1.05);
}

.variant-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.3));
  opacity: 0;
  transition: opacity 0.3s;
}

.variant-card:hover .variant-overlay {
  opacity: 1;
}

.variant-badges {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.discount-badge {
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.stock-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.stock-badge.out {
  background: #dc3545;
  color: white;
}

.stock-badge.low {
  background: #ffc107;
  color: #212529;
}

.variant-info {
  padding: 15px;
}

.variant-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.variant-price {
  margin-bottom: 10px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #007bff;
  margin-right: 10px;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.variant-stock {
  font-size: 12px;
  margin-bottom: 15px;
}

.stock-available {
  color: #28a745;
  font-weight: 600;
}

.stock-out {
  color: #dc3545;
  font-weight: 600;
}

.variant-actions {
  padding: 0 15px 15px;
}

.selected-variant-info {
  background: white;
  border: 2px solid #28a745;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

.selected-info h5 {
  color: #28a745;
  margin-bottom: 15px;
}

.selected-info p {
  margin-bottom: 8px;
  color: #333;
}

.selected-price {
  font-size: 16px;
}

.selected-stock {
  color: #28a745;
  font-weight: 600;
}

@media (max-width: 768px) {
  .variants-grid {
    grid-template-columns: 1fr;
  }
  
  .variant-details {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
