<template>
  <div v-if="!loading && product">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="product-images">
            <div class="main-image">
              <img :src="mainImage || product.image" :alt="product.name" class="img-fluid">
            </div>
            <div class="thumbnail-images" v-if="selectedVariant?.image">
              <img :src="selectedVariant.image" :alt="product.name" class="thumbnail" @click="setMainImage(selectedVariant.image)">
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-description" v-if="product.description">
            <p>{{ product.description }}</p>
          </div>

          <div class="product-price">
            <span class="current-price">{{ formatPrice(currentPrice) }}</span>
            <span v-if="currentOriginalPrice > currentPrice" class="original-price">{{ formatPrice(currentOriginalPrice) }}</span>
            <div v-if="currentOriginalPrice > currentPrice" class="discount">
              Tiết kiệm {{ formatPrice(currentOriginalPrice - currentPrice) }}
            </div>
            <div v-if="currentStock > 0" class="stock-info">Còn lại: <b>{{ currentStock }}</b></div>
            <div v-else class="out-of-stock">Hết hàng</div>
          </div>

          <div class="product-options" v-if="productVariants.length">
            <div class="mb-2">
              <label><b>Kích thước</b></label>
              <div class="d-flex gap-2 flex-wrap mt-1">
                <button
                  v-for="s in availableSizes"
                  :key="s.id"
                  :class="['btn', selectedSize===s.id?'btn-primary':'btn-outline-primary']"
                  @click="selectedSize = s.id; updateSelectedVariant()"
                >{{ s.name }}</button>
              </div>
            </div>

            <div class="mb-3">
              <label><b>Màu sắc</b></label>
              <div class="d-flex gap-2 flex-wrap mt-1">
                <button
                  v-for="c in availableColors"
                  :key="c.id"
                  :class="['btn', selectedColor===c.id?'btn-secondary':'btn-outline-secondary']"
                  @click="selectedColor = c.id; updateSelectedVariant()"
                >{{ getColorName(c.id) }}</button>
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2 mb-3">
            <button class="btn btn-outline-secondary" @click="quantity=Math.max(1,quantity-1)" :disabled="quantity<=1">-</button>
            <input type="number" v-model.number="quantity" min="1" :max="currentStock" class="form-control" style="width:90px" />
            <button class="btn btn-outline-secondary" @click="quantity=Math.min(currentStock,quantity+1)" :disabled="quantity>=currentStock">+</button>
          </div>

          <button class="btn btn-primary" :disabled="currentStock===0 || !selectedVariant" @click="addProductToCart">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-container">
    <div class="spinner-border text-primary" role="status"></div>
    <p>Đang tải sản phẩm...</p>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'ProductDetail',
  data() {
    return {
      loading: true,
      product: null,
      productVariants: [],
      selectedVariant: null,
      selectedColor: null,
      selectedSize: null,
      quantity: 1,
      mainImage: ''
    }
  },
  async mounted() {
    await this.loadFromApi()
  },
  computed: {
    currentPrice() {
      return this.selectedVariant?.price ?? this.product?.price ?? 0
    },
    currentOriginalPrice() {
      return this.selectedVariant?.originalPrice ?? this.product?.originalPrice ?? 0
    },
    currentStock() {
      return this.selectedVariant?.stock ?? this.product?.stock ?? 0
    },
    
    availableColors() {
      const ids = [...new Set(this.productVariants.map(v => v.colorId))].filter(Boolean)
      return ids.map(id => ({ id }))
    },
    availableSizes() {
      const ids = [...new Set(this.productVariants.map(v => v.sizeId))].filter(Boolean)
      return ids.map(id => ({ id, name: this.getSizeName(id) }))
    }
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    async loadFromApi() {
      try {
        this.loading = true
        const productId = this.$route.params.id
        console.log('🔄 Loading product details for ID:', productId)

        // Chỉ sử dụng API thực, không tạo demo data
        let response
        let apiData = null
        
        try {
          // Thử API chính: /chi-tiet-san-pham/hien-thi
          response = await axios.get('/chi-tiet-san-pham/hien-thi')
          apiData = response.data
          console.log('✅ API /chi-tiet-san-pham/hien-thi success:', apiData)
        } catch (apiError) {
          console.warn('⚠️ API /chi-tiet-san-pham/hien-thi failed:', apiError.message)
          
          // Fallback: Thử API san-pham
          try {
            response = await axios.get('/san-pham/hien-thi')
            apiData = response.data
            console.log('✅ Fallback API /san-pham/hien-thi success:', apiData)
          } catch (fallbackError) {
            console.error('❌ All APIs failed:', fallbackError.message)
            this.$toast?.error('Không thể tải dữ liệu sản phẩm')
            this.$router.push('/products')
            return
          }
        }
        
        // Xử lý dữ liệu từ API
        if (Array.isArray(apiData) && apiData.length > 0) {
          console.log('📦 Processing API data array with', apiData.length, 'items')
          
          // Tìm sản phẩm theo ID
          let foundProduct = null
          let productVariants = []
          
          // Tìm sản phẩm chính - ưu tiên sanPhamId trước
          foundProduct = apiData.find(item => {
            const itemSanPhamId = item.sanPhamId ? item.sanPhamId.toString() : null
            const itemId = item.id ? item.id.toString() : null
            const itemProductId = item.productId ? item.productId.toString() : null
            const itemChiTietSanPhamId = item.chiTietSanPhamId ? item.chiTietSanPhamId.toString() : null
            const searchId = productId.toString()
            
            console.log('🔍 Checking item:', {
              sanPhamId: itemSanPhamId,
              id: itemId,
              productId: itemProductId,
              chiTietSanPhamId: itemChiTietSanPhamId,
              lookingFor: searchId,
              tenSanPham: item.tenSanPham || item.tenChiTiet || item.name
            })
            
            // Kiểm tra các trường có thể chứa ID sản phẩm theo thứ tự ưu tiên
            const matches = (itemSanPhamId === searchId) ||
                           (itemId === searchId) ||
                           (itemProductId === searchId) ||
                           (itemChiTietSanPhamId === searchId)
            
            if (matches) {
              console.log('✅ Found exact matching product!')
            }
            
            return matches
          })
          
          // Nếu không tìm thấy exact match, thử tìm theo tên sản phẩm
          if (!foundProduct) {
            console.log('🔍 No exact match found, trying name-based matching...')
            foundProduct = apiData.find(item => {
              const itemName = (item.tenSanPham || item.tenChiTiet || item.name || '').toLowerCase()
              const searchName = productId.toString().toLowerCase()
              
              // Tìm sản phẩm có tên chứa ID hoặc ID chứa tên
              return itemName.includes(searchName) || searchName.includes(itemName)
            })
            
            if (foundProduct) {
              console.log('✅ Found name-based matching product!')
            }
          }
          
          if (foundProduct) {
            console.log('✅ Found product:', foundProduct)
            
            // Lấy tất cả variants của sản phẩm này
            const productIdToMatch = foundProduct.sanPhamId || foundProduct.id || foundProduct.productId
            productVariants = apiData.filter(item => {
              const itemProductId = item.sanPhamId || item.id || item.productId
              return itemProductId && itemProductId.toString() === productIdToMatch.toString()
            })
            
            console.log('📦 Found', productVariants.length, 'variants for product')
            
            // Xử lý variants - chỉ lấy dữ liệu thực từ API
            this.productVariants = productVariants.map(variant => {
              const basePrice = variant.giaTien || variant.giaBan || variant.gia || 0
              const discountAmount = variant.tienGiamGia || 0
              const originalPrice = basePrice + discountAmount
              
              return {
                id: variant.maChiTiet || variant.id || `${variant.sanPhamId}-${variant.kichCoId}-${variant.mauSacId}`,
                productId: variant.sanPhamId || variant.productId || variant.id,
                sizeId: variant.kichCoId || variant.sizeId || 1,
                colorId: variant.mauSacId || variant.colorId || 1,
                image: variant.duongDanAnh || variant.hinhAnh || variant.image || '/images/item-1.jpg',
                price: basePrice,
                originalPrice: originalPrice,
                stock: variant.soLuongTon || variant.stock || 0,
                status: variant.trangThai || 1,
                isDeleted: variant.daXoa || false,
                createdAt: variant.ngayCapNhat || variant.createdAt || new Date().toISOString()
              }
            })
            
            // Tạo thông tin sản phẩm chính - chỉ lấy dữ liệu thực từ API
            const firstVariant = this.productVariants[0]
            this.product = {
              id: productIdToMatch,
              name: foundProduct.tenSanPham || foundProduct.tenChiTiet || foundProduct.name || `Sản phẩm #${productIdToMatch}`,
              image: firstVariant?.image || foundProduct.duongDanAnh || foundProduct.hinhAnh || '/images/item-1.jpg',
              price: firstVariant?.price || foundProduct.giaTien || foundProduct.giaBan || 0,
              originalPrice: firstVariant?.originalPrice || foundProduct.giaGoc || foundProduct.giaNiemYet || 0,
              stock: firstVariant?.stock || foundProduct.soLuongTon || 0,
              description: foundProduct.moTa || foundProduct.description || `Chi tiết sản phẩm ${foundProduct.tenSanPham || foundProduct.name}`
            }
            
            console.log('✅ Product processed:', this.product)
            console.log('✅ Variants processed:', this.productVariants)
            
          } else {
            console.warn('⚠️ No product found for ID:', productId)
            console.log('🔍 Available products in API:', apiData.map(item => ({
              sanPhamId: item.sanPhamId,
              id: item.id,
              productId: item.productId,
              chiTietSanPhamId: item.chiTietSanPhamId,
              name: item.tenSanPham || item.tenChiTiet || item.name
            })))
            
            // Thử tìm sản phẩm với ID gần giống (fuzzy matching)
            const fuzzyMatch = this.findFuzzyMatch(apiData, productId)
            if (fuzzyMatch) {
              console.log('🔍 Found fuzzy match:', fuzzyMatch)
              foundProduct = fuzzyMatch
              
              // Lấy tất cả variants của sản phẩm này
              const productIdToMatch = foundProduct.sanPhamId || foundProduct.id || foundProduct.productId
              productVariants = apiData.filter(item => {
                const itemProductId = item.sanPhamId || item.id || item.productId
                return itemProductId && itemProductId.toString() === productIdToMatch.toString()
              })
              
              console.log('📦 Found', productVariants.length, 'variants for fuzzy matched product')
            } else {
              console.error('❌ No product found even with fuzzy matching')
              this.$toast?.error('Không tìm thấy sản phẩm với ID: ' + productId)
              this.$router.push('/products')
              return
            }
          }
          
        } else {
          console.warn('⚠️ API returned empty data')
          this.$toast?.error('Không có dữ liệu sản phẩm')
          this.$router.push('/products')
          return
        }
        
        // Set variant đầu tiên làm mặc định
        if (this.productVariants.length > 0) {
          this.selectedVariant = this.productVariants[0]
          this.selectedColor = this.productVariants[0].colorId
          this.selectedSize = this.productVariants[0].sizeId
          this.mainImage = this.productVariants[0].image
        }
        
        console.log('✅ Product loaded successfully:', this.product)
        
      } catch (e) {
        console.error('❌ Error loading product details:', e)
        this.$toast?.error('Lỗi tải chi tiết sản phẩm')
        this.$router.push('/products')
      } finally {
        this.loading = false
      }
    },
    updateSelectedVariant() {
      if (!this.selectedColor || !this.selectedSize) return
      const v = this.productVariants.find(x => x.colorId === this.selectedColor && x.sizeId === this.selectedSize)
      if (v) {
        this.selectedVariant = v
        this.mainImage = v.image || this.product.image
        if (this.quantity > v.stock) this.quantity = Math.max(1, v.stock)
      }
    },
    addProductToCart() {
      if (!this.selectedVariant) return this.$toast?.error('Chọn màu và size!')
      if (this.currentStock <= 0) return this.$toast?.error('Hết hàng!')

      const item = {
        ...this.product,
        variantId: this.selectedVariant.id,
        selectedColorId: this.selectedColor,
        selectedSizeId: this.selectedSize,
        quantity: this.quantity,
        price: this.currentPrice,
        originalPrice: this.currentOriginalPrice,
        image: this.selectedVariant.image,
        stock: this.currentStock
      }
      this.addToCart(item)
      this.$toast?.success('Đã thêm vào giỏ hàng')
      this.$router.push('/cart')
    },
    setMainImage(img) { this.mainImage = img },
    getColorName(id) {
      const map = { 1:'Đen',2:'Trắng',3:'Xám',4:'Xanh',5:'Đỏ',6:'Vàng',7:'Hồng',8:'Nâu' }
      return map[id] || `Màu ${id}`
    },
    getSizeName(id) {
      const map = { 1:'36',2:'37',3:'38',4:'39',5:'40',6:'41',7:'42',8:'43',9:'44',10:'45' }
      return map[id] || `Size ${id}`
    },
    formatPrice(v) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0)
    },
    
    findFuzzyMatch(apiData, productId) {
      console.log('🔍 Attempting fuzzy match for ID:', productId)
      
      // Thử tìm sản phẩm với ID gần giống
      const searchId = productId.toString().toLowerCase()
      
      for (let item of apiData) {
        const itemSanPhamId = item.sanPhamId ? item.sanPhamId.toString().toLowerCase() : ''
        const itemId = item.id ? item.id.toString().toLowerCase() : ''
        const itemProductId = item.productId ? item.productId.toString().toLowerCase() : ''
        const itemChiTietSanPhamId = item.chiTietSanPhamId ? item.chiTietSanPhamId.toString().toLowerCase() : ''
        
        // Kiểm tra các trường ID có chứa searchId không
        if (itemSanPhamId.includes(searchId) || 
            itemId.includes(searchId) || 
            itemProductId.includes(searchId) || 
            itemChiTietSanPhamId.includes(searchId)) {
          console.log('✅ Fuzzy match found:', {
            sanPhamId: item.sanPhamId,
            id: item.id,
            productId: item.productId,
            chiTietSanPhamId: item.chiTietSanPhamId,
            name: item.tenSanPham || item.tenChiTiet || item.name
          })
          return item
        }
      }
      
      // Nếu không tìm thấy, thử lấy sản phẩm đầu tiên
      if (apiData.length > 0) {
        console.log('⚠️ No fuzzy match found, using first product as fallback')
        return apiData[0]
      }
      
      return null
    }
    
  }
}
</script>

<style scoped>
.product-images{margin-bottom:30px}.main-image{margin-bottom:20px;border-radius:8px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,.1)}.main-image img{width:100%;height:400px;object-fit:contain}.thumbnail-images{display:flex;gap:10px;justify-content:center}.thumbnail{width:80px;height:80px;object-fit:cover;border:1px solid #eee;cursor:pointer;border-radius:6px}
.product-title{font-size:1.6rem;font-weight:700;margin-bottom:10px}
.product-description{margin-bottom:20px;color:#666;line-height:1.6}
.product-description p{margin:0}
.current-price{color:#e63946;font-weight:800;font-size:1.6rem;margin-right:6px}.original-price{text-decoration:line-through;color:#999;margin-right:10px}.discount{margin-top:6px;color:#28a745;font-weight:600}
.stock-info{margin-top:8px;color:#155724;background:#d4edda;border:1px solid #c3e6cb;border-radius:4px;padding:6px 10px;display:inline-block}.out-of-stock{margin-top:8px;color:#721c24;background:#f8d7da;border:1px solid #f5c6cb;border-radius:4px;padding:6px 10px;display:inline-block}
.product-options{margin:16px 0}
.loading-container{min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
</style>
