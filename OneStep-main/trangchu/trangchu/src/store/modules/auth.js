const state = {
  user: null,
  isAuthenticated: false,
  token: null
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  
  SET_TOKEN(state, token) {
    state.token = token
  },
  
  CLEAR_AUTH(state) {
    state.user = null
    state.isAuthenticated = false
    state.token = null
  }
}

const actions = {
  // Đăng ký tài khoản mới
  async register({ commit }, userData) {
    try {
      // Kiểm tra email đã tồn tại chưa
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const existingUser = existingUsers.find(user => user.email === userData.email)
      
      if (existingUser) {
        throw new Error('Email này đã được sử dụng!')
      }
      
      // Tạo user mới
      const newUser = {
        id: Date.now().toString(),
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password, // Trong thực tế nên hash password
        createdAt: new Date().toISOString(),
        isActive: true
      }
      
      // Lưu vào localStorage
      existingUsers.push(newUser)
      localStorage.setItem('users', JSON.stringify(existingUsers))
      
      // Tạo token đơn giản (trong thực tế nên dùng JWT)
      const token = btoa(JSON.stringify({ userId: newUser.id, email: newUser.email }))
      
      // Lưu thông tin đăng nhập
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      
      // Cập nhật state
      commit('SET_USER', newUser)
      commit('SET_TOKEN', token)
      
      return { success: true, message: 'Đăng ký thành công!' }
      
    } catch (error) {
      console.error('Lỗi đăng ký:', error)
      return { success: false, message: error.message }
    }
  },
  
  // Đăng nhập
  async login({ commit }, credentials) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password &&
        u.isActive === true
      )
      
      if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng!')
      }
      
      // Tạo token
      const token = btoa(JSON.stringify({ userId: user.id, email: user.email }))
      
      // Lưu thông tin đăng nhập
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      // Cập nhật state
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      
      return { success: true, message: 'Đăng nhập thành công!', user }
      
    } catch (error) {
      console.error('Lỗi đăng nhập:', error)
      return { success: false, message: error.message }
    }
  },
  
  // Đăng xuất
  logout({ commit }) {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    commit('CLEAR_AUTH')
  },
  
  // Kiểm tra đăng nhập từ localStorage
  checkAuth({ commit }) {
    const token = localStorage.getItem('authToken')
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    
    if (token && user) {
      try {
        // Kiểm tra token có hợp lệ không
        const tokenData = JSON.parse(atob(token))
        if (tokenData.userId === user.id) {
          commit('SET_USER', user)
          commit('SET_TOKEN', token)
          return true
        }
      } catch (error) {
        console.error('Token không hợp lệ:', error)
      }
    }
    
    // Nếu không hợp lệ, xóa dữ liệu cũ
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    commit('CLEAR_AUTH')
    return false
  },
  
  // Cập nhật thông tin người dùng
  async updateProfile({ commit, state }, updateData) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(u => u.id === state.user.id)
      
      if (userIndex === -1) {
        throw new Error('Không tìm thấy người dùng!')
      }
      
      // Cập nhật thông tin
      users[userIndex] = { ...users[userIndex], ...updateData }
      localStorage.setItem('users', JSON.stringify(users))
      
      // Cập nhật state
      const updatedUser = users[userIndex]
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      commit('SET_USER', updatedUser)
      
      return { success: true, message: 'Cập nhật thông tin thành công!' }
      
    } catch (error) {
      console.error('Lỗi cập nhật:', error)
      return { success: false, message: error.message }
    }
  }
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  currentUser: state => state.user,
  userId: state => state.user?.id || null,
  userFullName: state => state.user?.fullName || '',
  userEmail: state => state.user?.email || '',
  userPhone: state => state.user?.phone || ''
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
