import axios from 'axios'

const state = {
  products: [],
  filteredProducts: [],
  searchQuery: ''
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_FILTERED_PRODUCTS(state, products) {
    state.filteredProducts = products
  },
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query
  }
}

const actions = {
  async fetchProducts({ commit, dispatch }) {
    console.log('🔄 Store - Bắt đầu fetch products...')
    
    try {
      const response = await axios.get('/chi-tiet-san-pham/hien-thi')
      console.log('✅ Store - Chi-tiet-san-pham API Response:', response.data)
      
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
        console.log('⚠️ Store - Chi-tiet-san-pham API trả về dữ liệu rỗng, thử fallback...')
        throw new Error('No data from chi-tiet-san-pham API')
      }
      
      const baseURL = (axios && axios.defaults && axios.defaults.baseURL) ? axios.defaults.baseURL.replace(/\/$/, '') : ''
      const buildImageUrl = (imgPath) => {
        if (!imgPath || typeof imgPath !== 'string') return '/images/item-1.jpg'
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath
        const normalized = imgPath.startsWith('/') ? imgPath : `/${imgPath}`
        return baseURL ? `${baseURL}${normalized}` : normalized
      }
      
      const mapped = apiProducts.map(p => {
        // Lấy giá từ ChiTietSanPhamResponse
        const basePrice = p.giaTien || p.giaBan || p.gia || 0
        const discountAmount = p.tienGiamGia || 0
        const originalPrice = basePrice + discountAmount
        
        const discountPercent = discountAmount > 0 ? Math.floor((discountAmount / originalPrice) * 100) : 0
        const tags = []
        if (discountPercent > 0) {
          tags.push(`-${discountPercent}%`)
        }
        
        return {
          id: p.id || p.chiTietSanPhamId || Math.random().toString(),
          code: p.maCode || p.code,
          name: p.tenSanPham || p.tenChiTiet || 'Unknown Product',
          description: p.moTa || p.description || '',
          brand: p.thuongHieuTen || (p.thuongHieu && p.thuongHieu.ten) || 'Unknown Brand',
          price: basePrice,
          originalPrice: originalPrice,
          image: buildImageUrl(p.duongDanAnh || p.image),
          rating: p.rating || 5,
          colors: Array.isArray(p.mauSacList) ? p.mauSacList : (p.colors || []),
          sizes: Array.isArray(p.kichCoList) ? p.kichCoList : (p.sizes || []),
          tags: tags,
          category: p.danhMuc || p.category || '',
          status: p.trangThai || p.status,
          materialId: p.chatLieuId,
          soleId: p.deGiayId,
          styleId: p.kieuDangId,
          stock: p.soLuongTon || p.tonKho || 0,
          // Thông tin bổ sung từ chi tiết sản phẩm
          sanPhamId: p.sanPhamId,
          chiTietSanPhamId: p.chiTietSanPhamId,
          giaTien: p.giaTien,
          tienGiamGia: p.tienGiamGia,
          soLuongTon: p.soLuongTon
        }
      })
      
      console.log('✅ Store - Processed products from chi-tiet-san-pham:', mapped.length)
      
      commit('SET_PRODUCTS', mapped)
      dispatch('filterProducts', {})
    } catch (error) {
      console.error('❌ Store - Failed to fetch products from chi-tiet-san-pham:', error)
      
      // Fallback: try to fetch from san-pham if chi-tiet-san-pham fails
      try {
        console.log('📡 Store - Fallback: Gọi API san-pham/hien-thi...')
        const fallbackResponse = await axios.get('/san-pham/hien-thi')
        console.log('✅ Store - San-pham API Response:', fallbackResponse.data)
        
        // Process fallback data
        const fallbackProducts = fallbackResponse.data.map(p => {
          const basePrice = p.giaBan || p.gia || Math.floor(Math.random() * 2000000) + 500000
          const originalPrice = p.giaGoc || p.giaNiemYet || Math.floor(basePrice * (1.2 + Math.random() * 0.3))
          const discountPercent = Math.floor(((originalPrice - basePrice) / originalPrice) * 100)
          const tags = p.tags || []
          if (discountPercent > 0) {
            tags.push(`-${discountPercent}%`)
          }
          
          return {
            id: p.productId || p.id || Math.random().toString(),
            code: p.maCode || p.code,
            name: p.tenSanPham || 'Unknown Product',
            description: p.moTa || p.description || '',
            brand: p.thuongHieuTen || (p.thuongHieu && p.thuongHieu.ten) || 'Unknown Brand',
            price: basePrice,
            originalPrice: originalPrice,
            image: p.duongDanAnh || '/images/item-1.jpg',
            rating: p.rating || 5,
            colors: Array.isArray(p.mauSacList) ? p.mauSacList : (p.colors || []),
            sizes: Array.isArray(p.kichCoList) ? p.kichCoList : (p.sizes || []),
            tags: tags,
            category: p.danhMuc || p.category || '',
            status: p.trangThai || p.status,
            stock: Math.floor(Math.random() * 50) + 1
          }
        })
        
        console.log('✅ Store - Processed products from san-pham fallback:', fallbackProducts.length)
        commit('SET_PRODUCTS', fallbackProducts)
        dispatch('filterProducts', {})
        
      } catch (fallbackError) {
        console.error('❌ Store - Both APIs failed:', fallbackError)
        
        // Tạo dữ liệu demo nếu cả 2 API đều lỗi
        console.log('📦 Store - Tạo dữ liệu demo...')
        const demoProducts = [
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
          }
        ]
        
        console.log('✅ Store - Đã tạo', demoProducts.length, 'sản phẩm demo')
        commit('SET_PRODUCTS', demoProducts)
        dispatch('filterProducts', {})
      }
    }
  },
  filterProducts({ commit, state }, filters) {
    let filtered = [...state.products]
    
    // Filter by search query
    if (state.searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    }
    
    // Filter by price range
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => 
        product.price >= min && product.price <= max
      )
    }
    
    // Filter by color
    if (filters.color && filters.color !== 'all') {
      filtered = filtered.filter(product => 
        product.colors.includes(filters.color)
      )
    }
    
    // Filter by size
    if (filters.size && filters.size !== 'all') {
      filtered = filtered.filter(product => 
        product.sizes.includes(filters.size)
      )
    }
    
    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category === filters.category
      )
    }
    
    commit('SET_FILTERED_PRODUCTS', filtered)
  },
  
  searchProducts({ commit, dispatch }, query) {
    commit('SET_SEARCH_QUERY', query)
    dispatch('filterProducts', {})
  }
}

const getters = {
  allProducts: state => state.products,
  filteredProducts: state => state.filteredProducts,
  productById: state => id => state.products.find(product => product.id === id),
  searchQuery: state => state.searchQuery
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
