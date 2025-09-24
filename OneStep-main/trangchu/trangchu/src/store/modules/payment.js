import paymentService from '@/services/paymentService'

const state = {
  // Danh sách thanh toán
  payments: [],
  
  // Thanh toán hiện tại
  currentPayment: null,
  
  // Danh sách phương thức thanh toán
  paymentMethods: [],
  
  // Trạng thái loading
  isLoading: false,
  isLoadingMethods: false,
  
  // Lỗi
  error: null,
  
  // Thông tin thanh toán đang được tạo
  pendingPayment: {
    donHangId: null,
    khachHangId: null,
    phuongThucId: null,
    tongTien: 0,
    moTa: '',
    maGiaoDich: ''
  }
}

const getters = {
  // Lấy danh sách thanh toán
  allPayments: (state) => state.payments,
  
  // Lấy thanh toán theo ID
  getPaymentById: (state) => (id) => {
    return state.payments.find(payment => payment.id === id)
  },
  
  // Lấy thanh toán theo đơn hàng
  getPaymentsByOrder: (state) => (donHangId) => {
    return state.payments.filter(payment => payment.donHangId === donHangId)
  },
  
  // Lấy thanh toán hiện tại
  currentPayment: (state) => state.currentPayment,
  
  // Lấy danh sách phương thức thanh toán
  paymentMethods: (state) => state.paymentMethods,
  
  // Lấy phương thức thanh toán theo ID
  getPaymentMethodById: (state) => (id) => {
    return state.paymentMethods.find(method => method.id === id)
  },
  
  // Lấy phương thức thanh toán mặc định (COD)
  defaultPaymentMethod: (state) => {
    return state.paymentMethods.find(method => method.id === 1) || state.paymentMethods[0]
  },
  
  // Trạng thái loading
  isLoading: (state) => state.isLoading,
  isLoadingMethods: (state) => state.isLoadingMethods,
  
  // Lỗi
  error: (state) => state.error,
  
  // Thanh toán đang chờ
  pendingPayment: (state) => state.pendingPayment,
  
  // Kiểm tra có thanh toán nào đang chờ không
  hasPendingPayment: (state) => {
    return state.pendingPayment.donHangId !== null
  },
  
  // Tổng số thanh toán
  totalPayments: (state) => state.payments.length,
  
  // Thanh toán thành công
  successfulPayments: (state) => {
    return state.payments.filter(payment => payment.trangThai === 1)
  },
  
  // Thanh toán thất bại
  failedPayments: (state) => {
    return state.payments.filter(payment => payment.trangThai === 2)
  }
}

const mutations = {
  // Set loading state
  SET_LOADING(state, loading) {
    state.isLoading = loading
  },
  
  SET_LOADING_METHODS(state, loading) {
    state.isLoadingMethods = loading
  },
  
  // Set error
  SET_ERROR(state, error) {
    state.error = error
  },
  
  // Set danh sách thanh toán
  SET_PAYMENTS(state, payments) {
    state.payments = payments
  },
  
  // Thêm thanh toán mới
  ADD_PAYMENT(state, payment) {
    state.payments.unshift(payment)
  },
  
  // Cập nhật thanh toán
  UPDATE_PAYMENT(state, updatedPayment) {
    const index = state.payments.findIndex(payment => payment.id === updatedPayment.id)
    if (index !== -1) {
      state.payments.splice(index, 1, updatedPayment)
    }
  },
  
  // Xóa thanh toán
  REMOVE_PAYMENT(state, paymentId) {
    state.payments = state.payments.filter(payment => payment.id !== paymentId)
  },
  
  // Set thanh toán hiện tại
  SET_CURRENT_PAYMENT(state, payment) {
    state.currentPayment = payment
  },
  
  // Set danh sách phương thức thanh toán
  SET_PAYMENT_METHODS(state, methods) {
    state.paymentMethods = methods
  },
  
  // Set thông tin thanh toán đang chờ
  SET_PENDING_PAYMENT(state, paymentData) {
    state.pendingPayment = { ...state.pendingPayment, ...paymentData }
  },
  
  // Clear thông tin thanh toán đang chờ
  CLEAR_PENDING_PAYMENT(state) {
    state.pendingPayment = {
      donHangId: null,
      khachHangId: null,
      phuongThucId: null,
      tongTien: 0,
      moTa: '',
      maGiaoDich: ''
    }
  },
  
  // Clear error
  CLEAR_ERROR(state) {
    state.error = null
  }
}

const actions = {
  // Tạo thanh toán mới
  async createPayment({ commit, state }, { hoaDonId, khachHangId, paymentData }) {
    try {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      // Validate dữ liệu
      const validation = paymentService.validatePaymentData(paymentData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }
      
      // Tạo mã giao dịch nếu chưa có
      if (!paymentData.maGiaoDich) {
        paymentData.maGiaoDich = paymentService.generateTransactionCode()
      }
      
      const newPayment = await paymentService.createPayment(hoaDonId, khachHangId, paymentData)
      
      commit('ADD_PAYMENT', newPayment)
      commit('SET_CURRENT_PAYMENT', newPayment)
      commit('CLEAR_PENDING_PAYMENT')
      
      return newPayment
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Lấy thông tin thanh toán theo ID
  async fetchPaymentById({ commit }, paymentId) {
    try {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      const payment = await paymentService.getPaymentById(paymentId)
      commit('SET_CURRENT_PAYMENT', payment)
      
      return payment
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Lấy danh sách thanh toán theo đơn hàng
  async fetchPaymentsByOrder({ commit }, donHangId) {
    try {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      const payments = await paymentService.getPaymentsByOrder(donHangId)
      commit('SET_PAYMENTS', payments)
      
      return payments
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Cập nhật thanh toán
  async updatePayment({ commit }, { paymentId, updateData }) {
    try {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      const updatedPayment = await paymentService.updatePayment(paymentId, updateData)
      commit('UPDATE_PAYMENT', updatedPayment)
      
      if (state.currentPayment && state.currentPayment.id === paymentId) {
        commit('SET_CURRENT_PAYMENT', updatedPayment)
      }
      
      return updatedPayment
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Hủy thanh toán
  async cancelPayment({ commit }, paymentId) {
    try {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      await paymentService.cancelPayment(paymentId)
      commit('REMOVE_PAYMENT', paymentId)
      
      if (state.currentPayment && state.currentPayment.id === paymentId) {
        commit('SET_CURRENT_PAYMENT', null)
      }
      
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Lấy danh sách phương thức thanh toán
  async fetchPaymentMethods({ commit }) {
    try {
      commit('SET_LOADING_METHODS', true)
      commit('CLEAR_ERROR')
      
      const methods = await paymentService.getPaymentMethods()
      commit('SET_PAYMENT_METHODS', methods)
      
      return methods
    } catch (error) {
      commit('SET_ERROR', error.message)
      // Fallback về phương thức mặc định
      const defaultMethods = paymentService.getDefaultPaymentMethods()
      commit('SET_PAYMENT_METHODS', defaultMethods)
      return defaultMethods
    } finally {
      commit('SET_LOADING_METHODS', false)
    }
  },
  
  // Set thông tin thanh toán đang chờ
  setPendingPayment({ commit }, paymentData) {
    commit('SET_PENDING_PAYMENT', paymentData)
  },
  
  // Clear thông tin thanh toán đang chờ
  clearPendingPayment({ commit }) {
    commit('CLEAR_PENDING_PAYMENT')
  },
  
  // Clear error
  clearError({ commit }) {
    commit('CLEAR_ERROR')
  },
  
  // Clear current payment
  clearCurrentPayment({ commit }) {
    commit('SET_CURRENT_PAYMENT', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}