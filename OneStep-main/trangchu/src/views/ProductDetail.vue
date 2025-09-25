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
          

          <div class="product-price">
            <span class="current-price">{{ formatPrice(currentPrice) }}</span>
            <span v-if="currentOriginalPrice > currentPrice" class="original-price">{{ formatPrice(currentOriginalPrice) }}</span>
            <div v-if="currentOriginalPrice > currentPrice" class="discount">
              Tiết kiệm {{ formatPrice(currentOriginalPrice - currentPrice) }}
            </div>
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
                >{{ c.name }}</button>
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
      const colorMap = new Map()
      
      console.log('🎨 Processing availableColors with variants:', this.productVariants)
      
      this.productVariants.forEach(variant => {
        // Sử dụng tên màu làm key thay vì ID để tránh duplicate
        const colorKey = variant.colorName || this.getColorName(variant.colorId)
        
        console.log('🎨 Variant color processing:', {
          colorId: variant.colorId,
          colorName: variant.colorName,
          colorKey: colorKey,
          hasColorKey: !!colorKey,
          colorMapHas: colorMap.has(colorKey)
        })
        
        if (colorKey && !colorMap.has(colorKey)) {
          colorMap.set(colorKey, {
            id: variant.colorId,
            name: colorKey
          })
          console.log('✅ Added color to map:', { id: variant.colorId, name: colorKey })
        }
      })
      
      const result = Array.from(colorMap.values())
      console.log('🎨 Final availableColors:', result)
      return result
    },
    availableSizes() {
      const uniqueSizes = []
      const sizeMap = new Map()
      
      this.productVariants.forEach(variant => {
        if (variant.sizeId && !sizeMap.has(variant.sizeId)) {
          sizeMap.set(variant.sizeId, {
            id: variant.sizeId,
            name: variant.sizeName || this.getSizeName(variant.sizeId)
          })
        }
      })
      
      return Array.from(sizeMap.values())
    }
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    async loadFromApi() {
      try {
        this.loading = true
        const productId = this.$route.params.id
        console.log('🔄 Loading product details for ID:', productId)

        // Sử dụng API /chi-tiet-san-pham/hien-thi với cấu trúc mới
        let response
        let apiData = null
        
        try {
          // Thử API chi-tiet-san-pham/hien-thi trước
          console.log('🔄 Trying API /chi-tiet-san-pham/hien-thi...')
          response = await axios.get('/chi-tiet-san-pham/hien-thi')
          apiData = response.data
          console.log('✅ API /chi-tiet-san-pham/hien-thi success:', apiData)
        } catch (apiError) {
          console.warn('⚠️ API /chi-tiet-san-pham/hien-thi failed:', apiError.message)
          
          // Fallback: Thử API san-pham/hien-thi
          try {
            console.log('🔄 Fallback: Trying API /san-pham/hien-thi...')
            response = await axios.get('/san-pham/hien-thi')
            apiData = response.data
            console.log('✅ Fallback API /san-pham/hien-thi success:', apiData)
          } catch (fallbackError) {
            console.error('❌ Both APIs failed:', fallbackError.message)
            this.$toast?.error('Không thể tải dữ liệu sản phẩm từ API')
            this.$router.push('/products')
            return
          }
        }
        
        // Xử lý dữ liệu từ API - hỗ trợ cả 2 cấu trúc
        if (Array.isArray(apiData) && apiData.length > 0) {
          console.log('📦 Processing API data array with', apiData.length, 'items')
          
          // Kiểm tra xem có phải dữ liệu từ API chi-tiet-san-pham không
          const isChiTietAPI = apiData.some(item => item.hasOwnProperty('maChiTiet'))
          
          let productVariants = []
          
          if (isChiTietAPI) {
            // Xử lý dữ liệu từ API chi-tiet-san-pham/hien-thi
            productVariants = apiData.filter(item => {
              const itemSanPhamId = item.sanPhamId ? item.sanPhamId.toString() : null
              const searchId = productId.toString()
              
              console.log('🔍 Checking chi-tiet variant:', {
                maChiTiet: item.maChiTiet,
                sanPhamId: itemSanPhamId,
                kichCoId: item.kichCoId,
                mauSacId: item.mauSacId,
                giaTien: item.giaTien,
                soLuongTon: item.soLuongTon,
                lookingFor: searchId
              })
              
              return itemSanPhamId === searchId
            })
          } else {
            // Xử lý dữ liệu từ API san-pham/hien-thi (fallback)
            productVariants = apiData.filter(item => {
              const itemSanPhamId = item.maSanPham ? item.maSanPham.toString() : null
              const searchId = productId.toString()
              
              console.log('🔍 Checking san-pham variant:', {
                maSanPham: item.maSanPham,
                tenSanPham: item.tenSanPham,
                giaBan: item.giaBan,
                soLuongTon: item.soLuongTon,
                lookingFor: searchId
              })
              
              return itemSanPhamId === searchId
            })
          }
          
          console.log('📦 Found', productVariants.length, 'variants for product ID:', productId)
          console.log('🔍 Raw variants data:', productVariants)
          
          // Validate và sửa dữ liệu màu sắc
          const validatedVariants = this.validateAndFixColorData(productVariants, isChiTietAPI ? 'chi-tiet' : 'san-pham')
          console.log('✅ Validated variants:', validatedVariants)
          
          if (validatedVariants.length === 0) {
            console.warn('⚠️ No variants found for product ID:', productId)
            console.log('🔍 Available product IDs:', [...new Set(apiData.map(item => 
              isChiTietAPI ? item.sanPhamId : item.maSanPham
            ))].filter(Boolean))
            this.$toast?.error('Không tìm thấy sản phẩm với ID: ' + productId)
            this.$router.push('/products')
            return
          }
          
          // Xử lý variants theo cấu trúc API tương ứng
          console.log('🔄 Processing variants with API type:', isChiTietAPI ? 'chi-tiet' : 'san-pham')
          this.productVariants = validatedVariants.map(variant => {
            if (isChiTietAPI) {
              // Xử lý từ API chi-tiet-san-pham/hien-thi
              const basePrice = variant.giaTien || 0
              const originalPrice = basePrice
              
              console.log('🎨 Chi-tiet variant:', {
                mauSacId: variant.mauSacId,
                kichCoId: variant.kichCoId,
                colorName: this.getColorName(variant.mauSacId),
                sizeName: this.getSizeName(variant.kichCoId),
                rawVariant: variant
              })
              
              // Xử lý màu sắc và kích cỡ với fallback
              const colorId = variant.mauSacId || 1
              const sizeId = variant.kichCoId || 1
              const colorName = this.getColorName(colorId)
              const sizeName = this.getSizeName(sizeId)
              
              console.log('🎨 Processed chi-tiet:', {
                originalMauSacId: variant.mauSacId,
                originalKichCoId: variant.kichCoId,
                finalColorId: colorId,
                finalSizeId: sizeId,
                colorName: colorName,
                sizeName: sizeName
              })
              
              return {
                id: variant.maChiTiet || `${variant.sanPhamId}-${sizeId}-${colorId}`,
                productId: variant.sanPhamId,
                sizeId: sizeId,
                colorId: colorId,
                image: variant.duongDanAnh || '/images/item-1.jpg',
                price: basePrice,
                originalPrice: originalPrice,
                stock: variant.soLuongTon || 0,
                status: 1,
                isDeleted: false,
                createdAt: new Date().toISOString(),
                // Lưu tên từ mapping cho chi-tiet API
                sizeName: sizeName,
                colorName: colorName
              }
            } else {
              // Xử lý từ API san-pham/hien-thi (fallback)
              const basePrice = variant.giaBan || 0
              const originalPrice = basePrice
              
              // Tạo unique ID cho size và color từ tên
              const sizeId = variant.tenKichThuoc ? this.generateIdFromName(variant.tenKichThuoc) : 1
              const colorId = variant.tenMauSac ? this.generateIdFromName(variant.tenMauSac) : 1
              
              console.log('🎨 San-pham variant:', {
                tenMauSac: variant.tenMauSac,
                tenKichThuoc: variant.tenKichThuoc,
                generatedColorId: colorId,
                generatedSizeId: sizeId
              })
              
              return {
                id: variant.maSanPham || `${variant.maSanPham}-${sizeId}-${colorId}`,
                productId: variant.maSanPham,
                sizeId: sizeId,
                colorId: colorId,
                image: variant.duongDanAnh || '/images/item-1.jpg',
                price: basePrice,
                originalPrice: originalPrice,
                stock: variant.soLuongTon || 0,
                status: 1,
                isDeleted: false,
                createdAt: new Date().toISOString(),
                // Lưu tên gốc để hiển thị
                sizeName: variant.tenKichThuoc,
                colorName: variant.tenMauSac
              }
            }
          })
          
          // Tạo thông tin sản phẩm chính từ variant đầu tiên
          const firstVariant = this.productVariants[0]
          const firstProductData = productVariants[0]
          
          // Lấy tên sản phẩm từ API data
          let productName = `Sản phẩm #${productId}` // Default fallback
          let productDescription = `Mô tả sản phẩm #${productId}` // Default fallback
          
          if (isChiTietAPI) {
            // Từ API chi-tiet-san-pham, có thể có tên sản phẩm
            productName = firstProductData.tenSanPham || firstProductData.tenChiTiet || productName
            productDescription = firstProductData.moTa || productDescription
          } else {
            // Từ API san-pham
            productName = firstProductData.tenSanPham || productName
            productDescription = firstProductData.moTa || productDescription
          }
          
          this.product = {
            id: productId,
            name: productName,
            image: firstVariant?.image || '/images/item-1.jpg',
            price: firstVariant?.price || 0,
            originalPrice: firstVariant?.originalPrice || 0,
            stock: firstVariant?.stock || 0,
            description: productDescription
          }
          
          console.log('✅ Product processed:', this.product)
          console.log('✅ Variants processed:', this.productVariants)
          
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
      if (this.currentStock <= 0) {
        this.$toast?.error('Sản phẩm này đã hết hàng và không thể thêm vào giỏ hàng!')
        return
      }

      // Kiểm tra stock nhỏ hơn 0 (trường hợp dữ liệu không hợp lệ)
      if (this.currentStock < 0) {
        this.$toast?.error('Sản phẩm này hiện không khả dụng!')
        return
      }

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
      const map = { 
        1:'Đen', 2:'Trắng', 3:'Xám', 4:'Xanh dương', 5:'Đỏ', 
        6:'Vàng', 7:'Hồng', 8:'Nâu', 9:'Xanh lá', 10:'Cam',
        11:'Tím', 12:'Bạc', 13:'Vàng kim', 14:'Xanh navy', 15:'Be'
      }
      return map[id] || `Màu ${id}`
    },
    getSizeName(id) {
      const map = { 1:'36',2:'37',3:'38',4:'39',5:'40',6:'41',7:'42',8:'43',9:'44',10:'45' }
      return map[id] || `Size ${id}`
    },
    formatPrice(v) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0)
    },
    
    generateIdFromName(name) {
      // Tạo ID từ tên bằng cách hash string
      if (!name) return 1
      
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        const char = name.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
      }
      return Math.abs(hash) + 1 // Đảm bảo ID > 0
    },
    
    // Method để kiểm tra và sửa dữ liệu màu sắc từ API
    validateAndFixColorData(variants, apiType) {
      console.log('🔍 Validating color data for API type:', apiType)
      
      return variants.map((variant, index) => {
        let fixedVariant = { ...variant }
        
        if (apiType === 'chi-tiet') {
          // Kiểm tra mauSacId và kichCoId
          if (!variant.mauSacId || variant.mauSacId === null || variant.mauSacId === undefined) {
            console.warn(`⚠️ Variant ${index}: mauSacId is invalid:`, variant.mauSacId)
            fixedVariant.mauSacId = 1 // Default color
          }
          
          if (!variant.kichCoId || variant.kichCoId === null || variant.kichCoId === undefined) {
            console.warn(`⚠️ Variant ${index}: kichCoId is invalid:`, variant.kichCoId)
            fixedVariant.kichCoId = 1 // Default size
          }
          
          // Kiểm tra giá trị hợp lệ
          if (variant.mauSacId < 1 || variant.mauSacId > 15) {
            console.warn(`⚠️ Variant ${index}: mauSacId out of range:`, variant.mauSacId)
            fixedVariant.mauSacId = Math.max(1, Math.min(15, variant.mauSacId))
          }
          
          if (variant.kichCoId < 1 || variant.kichCoId > 10) {
            console.warn(`⚠️ Variant ${index}: kichCoId out of range:`, variant.kichCoId)
            fixedVariant.kichCoId = Math.max(1, Math.min(10, variant.kichCoId))
          }
          
        } else if (apiType === 'san-pham') {
          // Kiểm tra tenMauSac và tenKichThuoc
          if (!variant.tenMauSac || variant.tenMauSac === null || variant.tenMauSac === undefined) {
            console.warn(`⚠️ Variant ${index}: tenMauSac is invalid:`, variant.tenMauSac)
            fixedVariant.tenMauSac = 'Đen' // Default color
          }
          
          if (!variant.tenKichThuoc || variant.tenKichThuoc === null || variant.tenKichThuoc === undefined) {
            console.warn(`⚠️ Variant ${index}: tenKichThuoc is invalid:`, variant.tenKichThuoc)
            fixedVariant.tenKichThuoc = '42' // Default size
          }
        }
        
        console.log(`✅ Variant ${index} validated:`, {
          original: variant,
          fixed: fixedVariant
        })
        
        return fixedVariant
      })
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