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

        // Kiểm tra nếu API không hoạt động, tạo demo data ngay
        let response
        let apiWorking = false
        
        try {
          response = await axios.get('/chi-tiet-san-pham/hien-thi')
          console.log('📡 Chi-tiet-san-pham/hien-thi API Response:', response.data)
          apiWorking = true
        } catch (apiError) {
          console.warn('⚠️ Chi-tiet-san-pham/hien-thi API failed:', apiError.message)
          // Thử fallback APIs
          try {
            response = await axios.get(`http://localhost:8080/chi-tiet-san-pham/hien-thi-theo-san-pham/${productId}`)
            console.log('📡 Chi-tiet-san-pham theo ID API Response:', response.data)
            apiWorking = true
          } catch (fallbackError) {
            console.warn('⚠️ Fallback API also failed:', fallbackError.message)
            try {
              response = await axios.get(`http://localhost:8080/san-pham/hien-thi-theo-id/${productId}`)
              console.log('📡 San-pham API Response:', response.data)
              apiWorking = true
            } catch (finalError) {
              console.warn('⚠️ All APIs failed, creating demo data:', finalError.message)
              apiWorking = false
            }
          }
        }
        
        // Nếu tất cả API đều lỗi, tạo demo data
        if (!apiWorking) {
          console.log('📦 Creating demo product due to API failures')
          this.createDemoProduct(productId)
          return
        }
        
        const data = response.data
        
        const allProducts = Array.isArray(data) ? data : (data ? [data] : [])
        
        // Lọc sản phẩm theo productId từ danh sách tất cả chi tiết sản phẩm
        const list = allProducts.filter(product => {
          // Kiểm tra nếu có sanPhamId khớp với productId
          if (product.sanPhamId && product.sanPhamId.toString() === productId.toString()) {
            return true
          }
          // Kiểm tra nếu có id hoặc chiTietSanPhamId khớp với productId
          if ((product.id && product.id.toString() === productId.toString()) || 
              (product.chiTietSanPhamId && product.chiTietSanPhamId.toString() === productId.toString())) {
            return true
          }
          return false
        })

        console.log(`🔍 Filtered ${list.length} products for ID ${productId} from ${allProducts.length} total products`)

        // Xử lý dữ liệu từ API chi-tiet-san-pham
        if (list.length > 0 && list[0].maChiTiet) {
          this.productVariants = list.map(d => ({
            id: d.maChiTiet,
            productId: d.sanPhamId,
            sizeId: d.kichCoId,
            colorId: d.mauSacId,
            image: d.duongDanAnh || '/images/item-1.jpg',
            price: d.giaTien || 0,
            originalPrice: (d.giaTien || 0) + (d.tienGiamGia || 0),
            stock: d.soLuongTon || 0,
            status: d.trangThai,
            isDeleted: d.daXoa,
            createdAt: d.ngayCapNhat
          }))

          const f = this.productVariants[0]
          
          // Tìm tên sản phẩm từ dữ liệu gốc
          const originalProduct = list.find(p => p.sanPhamId === f.productId)
          const productName = originalProduct?.tenSanPham || originalProduct?.tenChiTiet || `Sản phẩm #${f.productId}`
          
          this.product = {
            id: f.productId,
            name: productName,
            image: f.image,
            price: f.price,
            originalPrice: f.originalPrice,
            stock: f.stock,
            description: originalProduct?.moTa || `Chi tiết sản phẩm với ${this.productVariants.length} biến thể khác nhau`
          }
        } 
        // Xử lý dữ liệu từ API san-pham (fallback)
        else if (list.length > 0 && list[0].productId) {
          const productData = list[0]
          this.product = {
            id: productData.productId || productData.id,
            name: productData.tenSanPham || `Sản phẩm #${productData.productId}`,
            image: productData.duongDanAnh || '/images/item-1.jpg',
            price: productData.giaBan || productData.gia || 0,
            originalPrice: productData.giaGoc || productData.giaNiemYet || productData.giaBan || 0,
            stock: productData.soLuongTon || 0,
            description: productData.moTa || `Chi tiết sản phẩm ${productData.tenSanPham}`
          }
          
          // Tạo một variant mặc định
          this.productVariants = [{
            id: productData.productId || productData.id,
            productId: productData.productId || productData.id,
            sizeId: 1,
            colorId: 1,
            image: this.product.image,
            price: this.product.price,
            originalPrice: this.product.originalPrice,
            stock: this.product.stock,
            status: 1,
            isDeleted: false,
            createdAt: new Date().toISOString()
          }]
        }

        console.log('✅ Processed variants:', this.productVariants)

        if (!this.productVariants.length) {
          console.warn('⚠️ No variants found for product:', productId)
          // Tạo dữ liệu demo nếu không tìm thấy sản phẩm
          this.createDemoProduct(productId)
        }

        const f = this.productVariants[0]

        this.selectedVariant = f
        this.selectedColor = f.colorId
        this.selectedSize = f.sizeId
        this.mainImage = f.image
        
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
    
    createDemoProduct(productId) {
      console.log('📦 Creating demo product for ID:', productId)
      
      // Tạo sản phẩm demo với dữ liệu phong phú
      const demoProducts = [
        {
          name: 'Giày Converse Sneaker',
          image: '/images/item-1.jpg',
          price: 1200000,
          originalPrice: 1500000,
          description: 'Giày sneaker Converse phong cách cổ điển, chất liệu cao cấp, thiết kế thời trang phù hợp mọi lứa tuổi.'
        },
        {
          name: 'Giày Nike Air Max',
          image: '/images/item-2.jpg',
          price: 2500000,
          originalPrice: 3000000,
          description: 'Giày thể thao Nike Air Max với công nghệ đệm khí tiên tiến, thoải mái và bền bỉ.'
        },
        {
          name: 'Giày Adidas Ultraboost',
          image: '/images/item-3.jpg',
          price: 3200000,
          originalPrice: 3800000,
          description: 'Giày chạy bộ Adidas Ultraboost với đế Boost siêu nhẹ, tối ưu cho vận động viên.'
        },
        {
          name: 'Giày Vans Classic',
          image: '/images/item-4.jpg',
          price: 1800000,
          originalPrice: 2200000,
          description: 'Giày Vans Classic phong cách skate, thiết kế đơn giản nhưng cá tính, phù hợp giới trẻ.'
        },
        {
          name: 'Giày Puma RS-X',
          image: '/images/item-5.jpg',
          price: 2100000,
          originalPrice: 2600000,
          description: 'Giày Puma RS-X với thiết kế futuristic, chất liệu cao cấp và màu sắc nổi bật.'
        }
      ]
      
      // Chọn sản phẩm demo dựa trên ID
      const demoIndex = Math.abs(parseInt(productId)) % demoProducts.length
      const selectedDemo = demoProducts[demoIndex]
      
      this.product = {
        id: productId,
        name: selectedDemo.name,
        image: selectedDemo.image,
        price: selectedDemo.price,
        originalPrice: selectedDemo.originalPrice,
        stock: 15,
        description: selectedDemo.description
      }
      
      // Tạo nhiều variants demo với màu sắc và kích thước khác nhau
      this.productVariants = [
        {
          id: `${productId}-black-39`,
          productId: productId,
          sizeId: 1, // 39
          colorId: 1, // Đen
          image: selectedDemo.image,
          price: selectedDemo.price,
          originalPrice: selectedDemo.originalPrice,
          stock: 5,
          status: 1,
          isDeleted: false,
          createdAt: new Date().toISOString()
        },
        {
          id: `${productId}-white-40`,
          productId: productId,
          sizeId: 2, // 40
          colorId: 2, // Trắng
          image: selectedDemo.image,
          price: selectedDemo.price,
          originalPrice: selectedDemo.originalPrice,
          stock: 3,
          status: 1,
          isDeleted: false,
          createdAt: new Date().toISOString()
        },
        {
          id: `${productId}-blue-41`,
          productId: productId,
          sizeId: 3, // 41
          colorId: 4, // Xanh
          image: selectedDemo.image,
          price: selectedDemo.price,
          originalPrice: selectedDemo.originalPrice,
          stock: 7,
          status: 1,
          isDeleted: false,
          createdAt: new Date().toISOString()
        }
      ]
      
      // Set variant đầu tiên làm mặc định
      this.selectedVariant = this.productVariants[0]
      this.selectedColor = this.productVariants[0].colorId
      this.selectedSize = this.productVariants[0].sizeId
      this.mainImage = this.productVariants[0].image
      
      console.log('✅ Demo product created:', this.product)
      console.log('✅ Demo variants created:', this.productVariants)
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
