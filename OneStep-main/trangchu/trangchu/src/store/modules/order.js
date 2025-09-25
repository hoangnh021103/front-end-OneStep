const state = {
  // Thông tin đơn hàng hiện tại
  currentOrder: {
    orderNumber: '',
    orderDate: '',
    orderTotal: 0,
    paymentMethod: '',
    customerInfo: {},
    items: [],
    shippingFee: 0,
    finalTotal: 0
  },
  
  // Lịch sử đơn hàng
  orderHistory: [],
  
  // Trạng thái loading
  isLoading: false,
  
  // Lỗi
  error: null
}

const mutations = {
  // Set loading state
  SET_LOADING(state, loading) {
    state.isLoading = loading
  },
  
  // Set error
  SET_ERROR(state, error) {
    state.error = error
  },
  
  // Clear error
  CLEAR_ERROR(state) {
    state.error = null
  },
  
  // Set current order
  SET_CURRENT_ORDER(state, orderData) {
    state.currentOrder = {
      ...state.currentOrder,
      ...orderData,
      orderDate: orderData.orderDate || new Date().toISOString(),
      orderNumber: orderData.orderNumber || 'GD' + Date.now().toString().slice(-8)
    }
  },
  
  // Clear current order
  CLEAR_CURRENT_ORDER(state) {
    state.currentOrder = {
      orderNumber: '',
      orderDate: '',
      orderTotal: 0,
      paymentMethod: '',
      customerInfo: {},
      items: [],
      shippingFee: 0,
      finalTotal: 0
    }
  },
  
  // Add order to history
  ADD_TO_HISTORY(state, order) {
    state.orderHistory.unshift(order)
  },
  
  // Update order in history
  UPDATE_ORDER_IN_HISTORY(state, { orderNumber, updates }) {
    const index = state.orderHistory.findIndex(order => order.orderNumber === orderNumber)
    if (index !== -1) {
      state.orderHistory[index] = { ...state.orderHistory[index], ...updates }
    }
  }
}

const actions = {
  // Set current order data
  setCurrentOrder({ commit }, orderData) {
    commit('SET_CURRENT_ORDER', orderData)
  },
  
  // Clear current order
  clearCurrentOrder({ commit }) {
    commit('CLEAR_CURRENT_ORDER')
  },
  
  // Complete order
  completeOrder({ commit, state }) {
    // Add current order to history
    commit('ADD_TO_HISTORY', { ...state.currentOrder })
    
    // Clear current order
    commit('CLEAR_CURRENT_ORDER')
  },
  
  // Update order status
  updateOrderStatus({ commit }, { orderNumber, status }) {
    commit('UPDATE_ORDER_IN_HISTORY', { 
      orderNumber, 
      updates: { status, updatedAt: new Date().toISOString() }
    })
  }
}

const getters = {
  // Get current order
  currentOrder: state => state.currentOrder,
  
  // Get order history
  orderHistory: state => state.orderHistory,
  
  // Get order by number
  getOrderByNumber: state => orderNumber => {
    return state.orderHistory.find(order => order.orderNumber === orderNumber)
  },
  
  // Get recent orders
  recentOrders: state => state.orderHistory.slice(0, 5),
  
  // Loading state
  isLoading: state => state.isLoading,
  
  // Error state
  error: state => state.error,
  
  // Total orders count
  totalOrders: state => state.orderHistory.length
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}