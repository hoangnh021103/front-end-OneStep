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
      ready_to_ship: 0,
      shipping: 0,
      delivered: 0,
      completed: 0,
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
  // Load all orders for current user (CHỈ ĐƠN HÀNG ONLINE)
  async loadOrders({ commit, rootGetters }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const userId = rootGetters['auth/userId'] || localStorage.getItem('userId')
      
      // QUAN TRỌNG: Nếu không có userId, không tải đơn hàng
      if (!userId) {
        console.log('❌ Không có userId - không tải đơn hàng')
        commit('SET_ORDERS', [])
        return []
      }
      
      console.log('🔄 Loading ONLINE orders for user:', userId)
      
      // Gọi API để lấy đơn hàng ONLINE (loaiDon = 1)
      const orders = await orderService.getUserOrders(userId)
      console.log('✅ ONLINE Orders loaded from API:', orders.length, 'orders')
      
      // Lọc thêm lần nữa để đảm bảo chỉ có đơn online
      const onlineOrders = orders.filter(order => {
        const isOnline = order.loaiDon === 1 || order.orderType === 'ONLINE' || order.loaiDon === undefined
        return isOnline
      })
      
      console.log(`📊 Sau khi lọc: ${onlineOrders.length} đơn hàng ONLINE`)
      commit('SET_ORDERS', onlineOrders)
      
      return onlineOrders
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

  // Silent load without toggling loading flag and only commit if data changed
  async loadOrdersSilent({ commit, rootGetters, state }) {
    try {
      const userId = rootGetters['auth/userId'] || localStorage.getItem('userId')
      if (!userId) return []
      const orders = await orderService.getUserOrders(userId)
      const onlineOrders = orders.filter(order => {
        const isOnline = order.loaiDon === 1 || order.orderType === 'ONLINE' || order.loaiDon === undefined
        return isOnline
      })
      // Compare shallow: length, and for each id+status+totalAmount
      const a = state.orders
      const b = onlineOrders
      let changed = a.length !== b.length
      if (!changed) {
        const mapA = new Map(a.map(o => [o.id, { s: o.status, t: o.totalAmount, u: o.updatedAt }]))
        for (const o of b) {
          const m = mapA.get(o.id)
          if (!m || m.s !== o.status || m.t !== o.totalAmount || m.u !== o.updatedAt) {
            changed = true
            break
          }
        }
      }
      if (changed) {
        commit('SET_ORDERS', onlineOrders)
      }
      return onlineOrders
    } catch (error) {
      // silent: do not override existing data
      console.warn('loadOrdersSilent error:', error?.message || error)
      return state.orders
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
      
      const newOrder = orderService.createOrderFromCheckout(checkoutData)
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

  // Silent refresh for polling
  async refreshOrdersSilent({ dispatch }) {
    await dispatch('loadOrdersSilent')
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

  // Helper to map legacy statuses if needed
  normalizeStatuses({ commit, state }) {
    const normalized = state.orders.map(o => {
      let status = o.status
      // Map older labels to new ones if present
      if (status === 'processing') status = 'pending'
      if (status === 'readyToShip') status = 'ready_to_ship'
      if (status === 'done') status = 'completed'
      return { ...o, status }
    })
    commit('SET_ORDERS', normalized)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
