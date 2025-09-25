import axios from 'axios'

const state = {
  products: [],
  filteredProducts: []
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_FILTERED_PRODUCTS(state, products) {
    state.filteredProducts = products
  },
}

const actions = {
  async fetchProducts({ commit, dispatch }) {
    console.log('🔄 Store - Bắt đầu fetch products từ API /san-pham/hien-thi...')
    
    try {
      const response = await axios.get('/san-pham/hien-thi')
      console.log('✅ Store - San-pham API Response:', response.data)
      
      // Normalize common Spring payload shapes
      const body = response && response.data
      const firstArray = (obj) => {
        if (!obj || typeof obj !== 'object') return []
        for (const key of ['data', 'content', 'items', 'result', 'rows', 'list']) {
          if (Array.isArray(obj[key])) return obj[key]
        }
        const anyArray = Object.values(obj).find(v => Array.isArray(v))
        return Array.isArray(anyArray) ? anyArray : []
      }
      const apiProducts = Array.isArray(body) ? body : firstArray(body)
      
      if (apiProducts.length === 0) {
        console.log('⚠️ Store - San-pham API trả về dữ liệu rỗng')
        commit('SET_PRODUCTS', [])
        dispatch('filterProducts', {})
        return
      }
      
      const baseURL = (axios && axios.defaults && axios.defaults.baseURL) ? axios.defaults.baseURL.replace(/\/$/, '') : ''
      const buildImageUrl = (imgPath) => {
        if (!imgPath || typeof imgPath !== 'string') return '/images/item-1.jpg'
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath
        const normalized = imgPath.startsWith('/') ? imgPath : `/${imgPath}`
        return baseURL ? `${baseURL}${normalized}` : normalized
      }
      
      const mapped = apiProducts.map(p => {
        // Xử lý dữ liệu theo cấu trúc API mới
        const basePrice = p.giaBan || 0
        const originalPrice = p.giaBan || 0 // Có thể thêm logic tính giá gốc nếu cần
        const discountPercent = 0 // Có thể tính từ dữ liệu khác nếu có
        const tags = []
        
        // Tạo mảng màu sắc và kích thước từ dữ liệu API
        const colors = p.tenMauSac ? [p.tenMauSac] : []
        const sizes = p.tenKichThuoc ? [p.tenKichThuoc] : []
        
        return {
          // Sử dụng maSanPham làm ID chính
          id: p.maSanPham || p.id || Math.random().toString(),
          code: p.maCode || '',
          name: p.tenSanPham || 'Unknown Product',
          description: p.moTa || '',
          brand: '', // Có thể lấy từ API khác nếu cần
          price: basePrice,
          originalPrice: originalPrice,
          image: buildImageUrl(p.duongDanAnh),
          rating: 5, // Mặc định rating
          colors: colors,
          sizes: sizes,
          tags: tags,
          category: '', // Có thể lấy từ API khác nếu cần
          status: 'active', // Mặc định status
          stock: p.soLuongTon || 0,
          // Thông tin bổ sung từ API mới
          maSanPham: p.maSanPham,
          maCode: p.maCode,
          tenSanPham: p.tenSanPham,
          moTa: p.moTa,
          deGiayId: p.deGiayId,
          duongDanAnh: p.duongDanAnh,
          giaBan: p.giaBan,
          soLuongTon: p.soLuongTon,
          tenKichThuoc: p.tenKichThuoc,
          tenMauSac: p.tenMauSac
        }
      })
      
      console.log('✅ Store - Processed products from san-pham:', mapped.length)
      
      commit('SET_PRODUCTS', mapped)
      dispatch('filterProducts', {})
    } catch (error) {
      console.error('❌ Store - Failed to fetch products from san-pham:', error)
      
      // Fallback: thử API chi-tiet-san-pham nếu san-pham fails
      try {
        console.log('📡 Store - Fallback: Gọi API chi-tiet-san-pham/hien-thi...')
        const fallbackResponse = await axios.get('/chi-tiet-san-pham/hien-thi')
        console.log('✅ Store - Chi-tiet-san-pham API Response:', fallbackResponse.data)
        
        // Process fallback data từ chi-tiet-san-pham
        const fallbackBody = fallbackResponse && fallbackResponse.data
        const firstArray = (obj) => {
          if (!obj || typeof obj !== 'object') return []
          for (const key of ['data', 'content', 'items', 'result', 'rows', 'list']) {
            if (Array.isArray(obj[key])) return obj[key]
          }
          const anyArray = Object.values(obj).find(v => Array.isArray(v))
          return Array.isArray(anyArray) ? anyArray : []
        }
        const fallbackProducts = Array.isArray(fallbackBody) ? fallbackBody : firstArray(fallbackBody)
        
        const baseURL = (axios && axios.defaults && axios.defaults.baseURL) ? axios.defaults.baseURL.replace(/\/$/, '') : ''
        const buildImageUrl = (imgPath) => {
          if (!imgPath || typeof imgPath !== 'string') return '/images/item-1.jpg'
          if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath
          const normalized = imgPath.startsWith('/') ? imgPath : `/${imgPath}`
          return baseURL ? `${baseURL}${normalized}` : normalized
        }
        
        const mappedFallback = fallbackProducts.map(p => {
          const basePrice = p.giaTien || p.giaBan || p.gia || 0
          const discountAmount = p.tienGiamGia || 0
          const originalPrice = basePrice + discountAmount
          
          const discountPercent = discountAmount > 0 ? Math.floor((discountAmount / originalPrice) * 100) : 0
          const tags = []
          if (discountPercent > 0) {
            tags.push(`-${discountPercent}%`)
          }
          
          return {
            id: p.sanPhamId || p.id || p.chiTietSanPhamId || Math.random().toString(),
            code: p.maCode || p.code,
            name: p.tenSanPham || p.tenChiTiet || 'Unknown Product',
            description: p.moTa || p.description || '',
            brand: p.thuongHieuTen || (p.thuongHieu && p.thuongHieu.ten) || '',
            price: basePrice,
            originalPrice: originalPrice,
            image: buildImageUrl(p.duongDanAnh || p.image),
            rating: p.rating || 5,
            colors: Array.isArray(p.mauSacList) ? p.mauSacList : (p.colors || []),
            sizes: Array.isArray(p.kichCoList) ? p.kichCoList : (p.sizes || []),
            tags: tags,
            category: p.danhMuc || p.category || '',
            status: p.trangThai || p.status,
            stock: p.soLuongTon || p.tonKho || 0,
            // Thông tin bổ sung
            sanPhamId: p.sanPhamId,
            chiTietSanPhamId: p.chiTietSanPhamId,
            productId: p.productId || p.id,
            giaTien: p.giaTien,
            tienGiamGia: p.tienGiamGia,
            soLuongTon: p.soLuongTon
          }
        })
        
        console.log('✅ Store - Processed products from chi-tiet-san-pham fallback:', mappedFallback.length)
        commit('SET_PRODUCTS', mappedFallback)
        dispatch('filterProducts', {})
        
      } catch (fallbackError) {
        console.error('❌ Store - Both APIs failed:', fallbackError)
        
        // Không tạo demo data, chỉ hiển thị thông báo lỗi
        console.log('⚠️ Store - Không thể tải dữ liệu sản phẩm từ API')
        commit('SET_PRODUCTS', [])
        dispatch('filterProducts', {})
      }
    }
  },
  filterProducts({ commit, state }, filters = {}) {
    let filtered = [...state.products]

    // Lọc sản phẩm có stock > 0 trước tiên
    filtered = filtered.filter(product => product.stock > 0)
    console.log(`📦 Stock filter: ${filtered.length} products available`)

    console.log('🔍 Filtering products with:', filters)
    
    // Filter by price range
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => {
        const price = product.price || 0
        return price >= min && price <= max
      })
      console.log(`💰 Price filter (${min}-${max}): ${filtered.length} products`)
    }
    
    // Filter by color
    if (filters.color && filters.color !== 'all') {
      filtered = filtered.filter(product => {
        const colors = product.colors || []
        return colors.includes(filters.color)
      })
      console.log(`🎨 Color filter (${filters.color}): ${filtered.length} products`)
    }
    
    // Filter by size
    if (filters.size && filters.size !== 'all') {
      filtered = filtered.filter(product => {
        const sizes = product.sizes || []
        return sizes.includes(filters.size)
      })
      console.log(`📏 Size filter (${filters.size}): ${filtered.length} products`)
    }
    
    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category === filters.category
      )
      console.log(`📂 Category filter (${filters.category}): ${filtered.length} products`)
    }
    
    console.log(`✅ Final filtered products: ${filtered.length}`)
    commit('SET_FILTERED_PRODUCTS', filtered)
  },
  
  sortProducts({ commit, state }, sortBy = 'name') {
    let sorted = [...state.filteredProducts]
    
    console.log('🔄 Sorting products by:', sortBy)
    
    switch (sortBy) {
      case 'name':
        sorted = sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'price-low':
        sorted = sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-high':
        sorted = sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'rating':
        sorted = sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        sorted = sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      default:
        console.warn('Unknown sort option:', sortBy)
    }
    
    console.log(`✅ Sorted ${sorted.length} products by ${sortBy}`)
    commit('SET_FILTERED_PRODUCTS', sorted)
  }
}

const getters = {
  allProducts: state => state.products,
  filteredProducts: state => state.filteredProducts,
  productById: state => id => state.products.find(product => product.id === id),
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
