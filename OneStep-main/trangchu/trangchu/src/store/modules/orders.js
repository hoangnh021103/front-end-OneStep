import orderService from '../../services/orderService'

const state = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
}

const getters = {
  orders: state => state.orders,
  currentOrder: state => state.currentOrder,
  loading: state => state.loading,
  error: state => state.error,
  
  // Get orders by status
  ordersByStatus: state => status => {
    if (status === 'all') return state.orders
    return state.orders.filter(order => order.status === status)
  },
  
  // Get order by ID
  orderById: state => id => {
    return state.orders.find(order => order.id === id)
  },
  
  // Get recent orders (last 5)
  recentOrders: state => {
    return state.orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  },
  
  // Get orders count by status
  ordersCount: state => {
    const counts = {
      all: state.orders.length,
      pending: 0,
      confirmed: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0
    }
    
    state.orders.forEach(order => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++
      }
    })
    
    return counts
  }
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_ERROR(state, error) {
    state.error = error
  },
  
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  
  ADD_ORDER(state, order) {
    state.orders.unshift(order)
  },
  
  UPDATE_ORDER(state, updatedOrder) {
    const index = state.orders.findIndex(order => order.id === updatedOrder.id)
    if (index !== -1) {
      state.orders.splice(index, 1, updatedOrder)
    }
  },
  
  REMOVE_ORDER(state, orderId) {
    state.orders = state.orders.filter(order => order.id !== orderId)
  },
  
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },
  
  CLEAR_ORDERS(state) {
    state.orders = []
    state.currentOrder = null
  }
}

const actions = {
  // Load all orders for current user
  async loadOrders({ commit, rootGetters }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const userId = rootGetters['auth/userId']
      console.log('🔄 Loading orders for user:', userId)
      
      // Gọi API để lấy đơn hàng
      const orders = await orderService.getUserOrders(userId)
      console.log('✅ Orders loaded from API:', orders.length, 'orders')
      
      commit('SET_ORDERS', orders)
      
      return orders
    } catch (error) {
      commit('SET_ERROR', error?.message || 'Unknown error occurred')
      console.error('❌ Error loading orders:', error)
      
      // Fallback: Load from localStorage nếu API fail
      try {
        const localOrders = orderService.getOrdersFromLocalStorage()
        commit('SET_ORDERS', localOrders)
        console.log('📱 Fallback: Loaded orders from localStorage:', localOrders.length)
        return localOrders
      } catch (localError) {
        console.error('❌ Error loading from localStorage:', localError)
        commit('SET_ORDERS', [])
        return []
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Search order by ID
  async searchOrderById({ commit }, orderId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const order = await orderService.getOrderById(orderId)
      if (order) {
        commit('SET_CURRENT_ORDER', order)
        // If order not in list, add it
        const existingOrder = state.orders.find(o => o.id === order.id)
        if (!existingOrder) {
          commit('ADD_ORDER', order)
        }
      }
      
      return order
    } catch (error) {
      commit('SET_ERROR', error?.message || 'Unknown error occurred')
      console.error('Error searching order:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Get order details
  async getOrderDetails({ commit }, orderId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const order = await orderService.getOrderById(orderId)
      commit('SET_CURRENT_ORDER', order)
      
      return order
    } catch (error) {
      commit('SET_ERROR', error?.message || 'Unknown error occurred')
      console.error('Error getting order details:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Cancel order
  async cancelOrder({ commit }, orderId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const updatedOrder = await orderService.cancelOrder(orderId)
      commit('UPDATE_ORDER', updatedOrder)
      
      return updatedOrder
    } catch (error) {
      commit('SET_ERROR', error?.message || 'Unknown error occurred')
      console.error('Error cancelling order:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Create new order (from checkout)
  async createOrder({ commit }, orderData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const newOrder = await orderService.createOrder(orderData)
      commit('ADD_ORDER', newOrder)
      commit('SET_CURRENT_ORDER', newOrder)
      
      return newOrder
    } catch (error) {
      commit('SET_ERROR', error?.message || 'Unknown error occurred')
      console.error('Error creating order:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Create order from checkout data
  async createOrderFromCheckout({ commit }, checkoutData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const newOrder = await orderService.createOrderFromCheckout(checkoutData)
      commit('ADD_ORDER', newOrder)
      commit('SET_CURRENT_ORDER', newOrder)
      
      console.log('✅ New order created from checkout:', newOrder.id)
      return newOrder
    } catch (error) {
      commit('SET_ERROR', error?.message || 'Unknown error occurred')
      console.error('Error creating order from checkout:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Update order status (for admin or system updates)
  async updateOrderStatus({ commit }, { orderId, status }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const updatedOrder = await orderService.updateOrderStatus(orderId, status)
      commit('UPDATE_ORDER', updatedOrder)
      
      return updatedOrder
    } catch (error) {
      commit('SET_ERROR', error?.message || 'Unknown error occurred')
      console.error('Error updating order status:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Clear orders (on logout)
  clearOrders({ commit }) {
    commit('CLEAR_ORDERS')
  },
  
  // Refresh orders (reload from server)
  async refreshOrders({ dispatch }) {
    await dispatch('loadOrders')
  },

  // Cancel order action (for UI)
  async cancelOrderAction({ commit, state }, orderId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      // Call service to cancel order
      const result = await orderService.cancelOrder(orderId)
      
      // Update order status in store
      const order = state.orders.find(o => o.id === orderId)
      if (order) {
        const updatedOrder = { ...order, status: 'cancelled', updatedAt: new Date().toISOString() }
        commit('UPDATE_ORDER', updatedOrder)
      }
      
      console.log('✅ Order cancelled successfully:', orderId)
      return result
    } catch (error) {
      commit('SET_ERROR', error?.message || 'Unknown error occurred')
      console.error('❌ Error cancelling order:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
