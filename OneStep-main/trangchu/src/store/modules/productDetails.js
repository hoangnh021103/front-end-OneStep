import axios from 'axios'

const state = {
  productDetails: [],
  currentProductDetails: [],
  loading: false,
  error: null
}

const mutations = {
  SET_PRODUCT_DETAILS(state, details) {
    state.productDetails = details
  },
  SET_CURRENT_PRODUCT_DETAILS(state, details) {
    state.currentProductDetails = details
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchAllProductDetails({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await axios.get('http://localhost:8080/chi-tiet-san-pham/hien-thi')
      const details = response.data.map(detail => ({
        id: detail.maChiTiet,
        productId: detail.sanPhamId,
        sizeId: detail.kichCoId,
        colorId: detail.mauSacId,
        image: detail.duongDanAnh || '/images/item-1.jpg',
        price: detail.giaTien || 0,
        originalPrice: (detail.giaTien || 0) + (detail.tienGiamGia || 0),
        discountAmount: detail.tienGiamGia || 0,
        stock: detail.soLuongTon || 0,
        status: detail.trangThai,
        isDeleted: detail.daXoa,
        createdAt: detail.ngayCapNhat,
        createdBy: detail.nguoiTao,
        updatedBy: detail.nguoiCapNhat,
        // Tính toán giảm giá phần trăm
        discountPercent: detail.tienGiamGia > 0 ? 
          Math.floor((detail.tienGiamGia / ((detail.giaTien || 0) + detail.tienGiamGia)) * 100) : 0
      }))
      
      commit('SET_PRODUCT_DETAILS', details)
      return details
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching product details:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchProductDetailsByProductId({ commit }, productId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await axios.get(`http://localhost:8080/chi-tiet-san-pham/hien-thi-theo-san-pham/${productId}`)
      
      // Xử lý response có thể là array hoặc object
      const responseData = Array.isArray(response.data) ? response.data : [response.data]
      
      const details = responseData.map(detail => ({
        id: detail.maChiTiet,
        productId: detail.sanPhamId,
        sizeId: detail.kichCoId,
        colorId: detail.mauSacId,
        image: detail.duongDanAnh || '/images/item-1.jpg',
        price: detail.giaTien || 0,
        originalPrice: (detail.giaTien || 0) + (detail.tienGiamGia || 0),
        discountAmount: detail.tienGiamGia || 0,
        stock: detail.soLuongTon || 0,
        status: detail.trangThai,
        isDeleted: detail.daXoa,
        createdAt: detail.ngayCapNhat,
        createdBy: detail.nguoiTao,
        updatedBy: detail.nguoiCapNhat,
        discountPercent: detail.tienGiamGia > 0 ? 
          Math.floor((detail.tienGiamGia / ((detail.giaTien || 0) + detail.tienGiamGia)) * 100) : 0,
        // Thêm thông tin bổ sung
        isActive: detail.trangThai === 1,
        canPurchase: detail.soLuongTon > 0 && detail.trangThai === 1 && detail.daXoa === 0
      }))
      
      commit('SET_CURRENT_PRODUCT_DETAILS', details)
      return details
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching product details by product ID:', error)
      // Trả về array rỗng thay vì throw error để không làm crash app
      return []
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchProductDetailById({ commit }, detailId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await axios.get(`http://localhost:8080/chi-tiet-san-pham/${detailId}`)
      const detail = response.data
      
      const mappedDetail = {
        id: detail.maChiTiet,
        productId: detail.sanPhamId,
        sizeId: detail.kichCoId,
        colorId: detail.mauSacId,
        image: detail.duongDanAnh || '/images/item-1.jpg',
        price: detail.giaTien || 0,
        originalPrice: (detail.giaTien || 0) + (detail.tienGiamGia || 0),
        discountAmount: detail.tienGiamGia || 0,
        stock: detail.soLuongTon || 0,
        status: detail.trangThai,
        isDeleted: detail.daXoa,
        createdAt: detail.ngayCapNhat,
        createdBy: detail.nguoiTao,
        updatedBy: detail.nguoiCapNhat,
        discountPercent: detail.tienGiamGia > 0 ? 
          Math.floor((detail.tienGiamGia / ((detail.giaTien || 0) + detail.tienGiamGia)) * 100) : 0
      }
      
      return mappedDetail
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching product detail by ID:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addProductDetail({ commit }, detailData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await axios.post('http://localhost:8080/chi-tiet-san-pham/add', detailData)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error adding product detail:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateProductDetail({ commit }, { id, detailData }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await axios.put(`http://localhost:8080/chi-tiet-san-pham/update/${id}`, detailData)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error updating product detail:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteProductDetail({ commit }, detailId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      await axios.delete(`http://localhost:8080/chi-tiet-san-pham/delete/${detailId}`)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error deleting product detail:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  allProductDetails: state => state.productDetails,
  currentProductDetails: state => state.currentProductDetails,
  productDetailsByProductId: state => productId => 
    state.productDetails.filter(detail => detail.productId === productId),
  productDetailById: state => detailId => 
    state.productDetails.find(detail => detail.id === detailId),
  isLoading: state => state.loading,
  error: state => state.error,
  
  // Getter để lấy thông tin giá và stock cho một sản phẩm cụ thể
  getProductVariantInfo: state => (productId, sizeId, colorId) => {
    return state.productDetails.find(detail => 
      detail.productId === productId && 
      detail.sizeId === sizeId && 
      detail.colorId === colorId
    )
  },
  
  // Getter để lấy tất cả variants của một sản phẩm
  getProductVariants: state => productId => {
    return state.productDetails.filter(detail => detail.productId === productId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
