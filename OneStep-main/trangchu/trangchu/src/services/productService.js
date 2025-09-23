import axios from 'axios'

class ProductService {
  constructor() {
    this.baseURL = '/san-pham'
    this.detailBaseURL = '/chi-tiet-san-pham'
  }

  /**
   * Lấy danh sách tất cả sản phẩm từ API /san-pham/hien-thi
   * @returns {Promise<Array>} Danh sách sản phẩm
   */
  async getAllProducts() {
    try {
      const response = await axios.get(`${this.baseURL}/hien-thi`)
      return this.normalizeProducts(response.data)
    } catch (error) {
      console.error('Error fetching products from san-pham:', error)
      
      // Fallback to chi-tiet-san-pham API
      try {
        console.log('Fallback: Trying chi-tiet-san-pham API...')
        const fallbackResponse = await axios.get(`${this.detailBaseURL}/hien-thi`)
        return this.normalizeProducts(fallbackResponse.data)
      } catch (fallbackError) {
        console.error('Error fetching products from chi-tiet-san-pham:', fallbackError)
        throw new Error('Không thể tải danh sách sản phẩm')
      }
    }
  }

  /**
   * Lấy thông tin chi tiết sản phẩm theo ID
   * @param {string} productId - ID sản phẩm
   * @returns {Promise<Object>} Thông tin sản phẩm
   */
  async getProductById(productId) {
    try {
      const response = await axios.get(`${this.baseURL}/${productId}`)
      return this.normalizeProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      throw new Error('Không thể tải thông tin sản phẩm')
    }
  }

  /**
   * Lấy chi tiết sản phẩm theo ID sản phẩm
   * @param {string} sanPhamId - ID sản phẩm
   * @returns {Promise<Array>} Danh sách chi tiết sản phẩm
   */
  async getProductDetailsBySanPhamId(sanPhamId) {
    try {
      const response = await axios.get(`${this.detailBaseURL}/hien-thi-theo-san-pham/${sanPhamId}`)
      console.log(`Chi tiết sản phẩm cho ID ${sanPhamId}:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error fetching product details for ID ${sanPhamId}:`, error)
      throw new Error(`Không thể tải chi tiết sản phẩm ID ${sanPhamId}`)
    }
  }

  /**
   * Lấy giá sản phẩm theo ID
   * @param {string} productId - ID sản phẩm
   * @returns {Promise<Object>} Thông tin giá sản phẩm
   */
  async getProductPrice(productId) {
    try {
      const response = await axios.get(`${this.baseURL}/${productId}/gia`)
      return {
        price: response.data.giaBan || response.data.gia || 0,
        originalPrice: response.data.giaGoc || response.data.giaNiemYet || 0,
        discount: response.data.giamGia || 0
      }
    } catch (error) {
      console.error('Error fetching product price:', error)
      throw new Error('Không thể tải giá sản phẩm')
    }
  }

  /**
   * Lấy thông tin sản phẩm trong giỏ hàng với giá cập nhật từ API
   * @param {Array} cartItems - Danh sách sản phẩm trong giỏ hàng
   * @returns {Promise<Array>} Danh sách sản phẩm với giá cập nhật
   */
  async getCartItemsWithUpdatedPrices(cartItems) {
    try {
      console.log('🔄 Cập nhật giá sản phẩm trong giỏ hàng...')
      
      const updatedItems = await Promise.all(
        cartItems.map(async (item) => {
          try {
            // Thử lấy chi tiết sản phẩm theo sanPhamId trước
            if (item.sanPhamId) {
              console.log(`📡 Lấy chi tiết sản phẩm cho sanPhamId: ${item.sanPhamId}`)
              const productDetails = await this.getProductDetailsBySanPhamId(item.sanPhamId)
              
              if (productDetails && productDetails.length > 0) {
                // Lấy chi tiết đầu tiên (có thể chọn theo kích cỡ, màu sắc)
                const firstDetail = productDetails[0]
                console.log(`✅ Tìm thấy ${productDetails.length} chi tiết sản phẩm`)
                
                return {
                  ...item,
                  price: firstDetail.giaTien || item.price || 0,
                  originalPrice: (firstDetail.giaTien || 0) + (firstDetail.tienGiamGia || 0),
                  name: item.name, // Giữ tên gốc
                  image: firstDetail.duongDanAnh || item.image,
                  brand: item.brand, // Giữ thương hiệu gốc
                  stock: firstDetail.soLuongTon || item.stock,
                  // Thông tin chi tiết mới
                  chiTietSanPhamId: firstDetail.maChiTiet,
                  kichCoId: firstDetail.kichCoId,
                  mauSacId: firstDetail.mauSacId,
                  giaTien: firstDetail.giaTien,
                  tienGiamGia: firstDetail.tienGiamGia,
                  soLuongTon: firstDetail.soLuongTon,
                  trangThai: firstDetail.trangThai,
                  ngayCapNhat: firstDetail.ngayCapNhat
                }
              }
            }
            
            // Fallback: thử lấy theo ID trực tiếp
            console.log(`📡 Fallback: Lấy sản phẩm theo ID: ${item.id}`)
            const productData = await this.getProductById(item.id)
            return {
              ...item,
              price: productData.price,
              originalPrice: productData.originalPrice,
              name: productData.name,
              image: productData.image,
              brand: productData.brand,
              stock: productData.stock
            }
          } catch (error) {
            console.warn(`⚠️ Không thể cập nhật giá cho sản phẩm ${item.id}:`, error)
            return item // Trả về item gốc nếu không thể cập nhật giá
          }
        })
      )
      
      console.log('✅ Hoàn thành cập nhật giá sản phẩm trong giỏ hàng')
      return updatedItems
    } catch (error) {
      console.error('❌ Lỗi cập nhật giá sản phẩm trong giỏ hàng:', error)
      throw new Error('Không thể cập nhật giá sản phẩm trong giỏ hàng')
    }
  }

  /**
   * Chuẩn hóa dữ liệu sản phẩm từ API
   * @param {Array} products - Danh sách sản phẩm thô từ API
   * @returns {Array} Danh sách sản phẩm đã chuẩn hóa
   */
  normalizeProducts(products) {
    const body = products
    const firstArray = (obj) => {
      if (!obj || typeof obj !== 'object') return []
      for (const key of ['data', 'content', 'items', 'result', 'rows', 'list']) {
        if (Array.isArray(obj[key])) return obj[key]
      }
      const anyArray = Object.values(obj).find(v => Array.isArray(v))
      return Array.isArray(anyArray) ? anyArray : []
    }
    
    const apiProducts = Array.isArray(body) ? body : firstArray(body)
    const baseURL = axios.defaults?.baseURL?.replace(/\/$/, '') || ''
    
    const buildImageUrl = (imgPath) => {
      if (!imgPath || typeof imgPath !== 'string') return '/images/item-1.jpg'
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath
      const normalized = imgPath.startsWith('/') ? imgPath : `/${imgPath}`
      return baseURL ? `${baseURL}${normalized}` : normalized
    }

    return apiProducts.map(p => this.normalizeProduct(p, buildImageUrl))
  }

  /**
   * Chuẩn hóa dữ liệu một sản phẩm từ API
   * @param {Object} product - Sản phẩm thô từ API
   * @param {Function} buildImageUrl - Hàm xây dựng URL hình ảnh
   * @returns {Object} Sản phẩm đã chuẩn hóa
   */
  normalizeProduct(product, buildImageUrl = null) {
    if (!buildImageUrl) {
      const baseURL = axios.defaults?.baseURL?.replace(/\/$/, '') || ''
      buildImageUrl = (imgPath) => {
        if (!imgPath || typeof imgPath !== 'string') return '/images/item-1.jpg'
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath
        const normalized = imgPath.startsWith('/') ? imgPath : `/${imgPath}`
        return baseURL ? `${baseURL}${normalized}` : normalized
      }
    }

    // Kiểm tra xem có phải dữ liệu từ API /san-pham/hien-thi không
    const isSanPhamAPI = product.hasOwnProperty('maSanPham') && product.hasOwnProperty('tenSanPham')
    
    if (isSanPhamAPI) {
      // Xử lý dữ liệu từ API /san-pham/hien-thi
      const basePrice = product.giaBan || 0
      const originalPrice = product.giaBan || 0
      const discountPercent = 0
      const tags = []
      
      // Tạo mảng màu sắc và kích thước từ dữ liệu API
      const colors = product.tenMauSac ? [product.tenMauSac] : []
      const sizes = product.tenKichThuoc ? [product.tenKichThuoc] : []
      
      return {
        id: product.maSanPham || product.id || Math.random().toString(),
        code: product.maCode || '',
        name: product.tenSanPham || 'Unknown Product',
        description: product.moTa || '',
        brand: '', // Có thể lấy từ API khác nếu cần
        price: basePrice,
        originalPrice: originalPrice,
        image: buildImageUrl(product.duongDanAnh),
        rating: 5, // Mặc định rating
        colors: colors,
        sizes: sizes,
        tags: tags,
        category: '', // Có thể lấy từ API khác nếu cần
        status: 'active', // Mặc định status
        stock: product.soLuongTon || 0,
        // Thông tin bổ sung từ API mới
        maSanPham: product.maSanPham,
        maCode: product.maCode,
        tenSanPham: product.tenSanPham,
        moTa: product.moTa,
        deGiayId: product.deGiayId,
        duongDanAnh: product.duongDanAnh,
        giaBan: product.giaBan,
        soLuongTon: product.soLuongTon,
        tenKichThuoc: product.tenKichThuoc,
        tenMauSac: product.tenMauSac
      }
    } else {
      // Xử lý dữ liệu từ API chi-tiet-san-pham (fallback)
      const basePrice = product.giaTien || product.giaBan || product.gia || 0
      const discountAmount = product.tienGiamGia || 0
      const originalPrice = basePrice + discountAmount
      
      const discountPercent = discountAmount > 0 ? Math.floor((discountAmount / originalPrice) * 100) : 0
      const tags = []
      if (discountPercent > 0) {
        tags.push(`-${discountPercent}%`)
      }

      return {
        id: product.id || product.chiTietSanPhamId || Math.random().toString(),
        code: product.maCode || product.code,
        name: product.tenSanPham || product.tenChiTiet || 'Unknown Product',
        description: product.moTa || product.description || '',
        brand: product.thuongHieuTen || (product.thuongHieu && product.thuongHieu.ten) || '',
        price: basePrice,
        originalPrice: originalPrice,
        image: buildImageUrl(product.duongDanAnh || product.image),
        rating: product.rating || 5,
        colors: Array.isArray(product.mauSacList) ? product.mauSacList : (product.colors || []),
        sizes: Array.isArray(product.kichCoList) ? product.kichCoList : (product.sizes || []),
        tags: tags,
        category: product.danhMuc || product.category || '',
        status: product.trangThai || product.status,
        materialId: product.chatLieuId,
        soleId: product.deGiayId,
        styleId: product.kieuDangId,
        stock: product.soLuongTon || product.tonKho || 0,
        // Thông tin bổ sung từ chi tiết sản phẩm
        sanPhamId: product.sanPhamId,
        chiTietSanPhamId: product.chiTietSanPhamId,
        giaTien: product.giaTien,
        tienGiamGia: product.tienGiamGia,
        soLuongTon: product.soLuongTon
      }
    }
  }
}

export default new ProductService()
