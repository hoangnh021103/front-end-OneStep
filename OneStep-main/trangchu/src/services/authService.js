// Simple Authentication Service for Demo
// Trong thực tế, cần implement JWT authentication với backend

const API_BASE_URL = 'http://localhost:8080'

class AuthService {
  constructor() {
    // Kiểm tra và khôi phục session từ localStorage
    this.currentUser = this.loadUserFromStorage()
  }

  // Tạo ID duy nhất từ email (để demo)
  generateUserIdFromEmail(email) {
    // Tạo hash đơn giản từ email để có ID duy nhất
    let hash = 0
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    // Đảm bảo ID luôn dương và > 1
    return Math.abs(hash % 999999) + 2
  }

  // Load user từ localStorage
  loadUserFromStorage() {
    try {
      const userStr = localStorage.getItem('currentUser')
      const userId = localStorage.getItem('userId')
      const authToken = localStorage.getItem('authToken')
      
      if (userStr) {
        const user = JSON.parse(userStr)
        return {
          ...user,
          id: user.id || userId, // KHÔNG fallback về 1
          token: user.token || authToken
        }
      }
      
      // Default user nếu chưa có
      return null
    } catch (error) {
      console.error('Error loading user from storage:', error)
      return null
    }
  }

  // Đăng nhập
  async login(email, password) {
    try {
      // Demo: Tạo user giả để test
      // Trong thực tế, gọi API backend để authenticate
      
      // QUAN TRỌNG: Tạo ID duy nhất cho mỗi user dựa trên email
      // để tránh tất cả user có cùng ID = 1
      const userId = this.generateUserIdFromEmail(email)
      
      const demoUser = {
        id: userId, // ID duy nhất cho mỗi email
        email: email,
        name: email.split('@')[0],
        role: 'customer',
        token: 'demo-token-' + Date.now()
      }
      
      // Lưu vào localStorage với nhiều key để tương thích
      localStorage.setItem('currentUser', JSON.stringify(demoUser))
      localStorage.setItem('userId', demoUser.id.toString())
      localStorage.setItem('authToken', demoUser.token)
      localStorage.setItem('userEmail', demoUser.email)
      localStorage.setItem('email', demoUser.email)
      localStorage.setItem('userName', demoUser.name)
      localStorage.setItem('name', demoUser.name)
      
      this.currentUser = demoUser
      console.log('✅ Đăng nhập thành công:', demoUser)
      
      return {
        success: true,
        user: demoUser
      }
    } catch (error) {
      console.error('❌ Lỗi đăng nhập:', error)
      return {
        success: false,
        message: error.message || 'Đăng nhập thất bại'
      }
    }
  }

  // Đăng ký
  async register(userData) {
    try {
      // Demo: Tạo user mới
      // Trong thực tế, gọi API backend để tạo tài khoản
      const newUser = {
        id: Date.now(), // Tạo ID ngẫu nhiên cho demo
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        phone: userData.phone,
        role: 'customer',
        token: 'demo-token-' + Date.now()
      }
      
      // Auto login sau khi đăng ký
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      localStorage.setItem('userId', newUser.id.toString())
      localStorage.setItem('authToken', newUser.token)
      localStorage.setItem('userEmail', newUser.email)
      
      this.currentUser = newUser
      console.log('✅ Đăng ký thành công:', newUser)
      
      return {
        success: true,
        user: newUser
      }
    } catch (error) {
      console.error('❌ Lỗi đăng ký:', error)
      return {
        success: false,
        message: error.message || 'Đăng ký thất bại'
      }
    }
  }

  // Đăng xuất
  logout() {
    // Xóa thông tin user khỏi localStorage
    localStorage.removeItem('currentUser')
    localStorage.removeItem('userId')
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    
    this.currentUser = null
    console.log('👋 Đã đăng xuất')
    
    return {
      success: true
    }
  }

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated() {
    return this.currentUser !== null && this.currentUser.token !== undefined
  }

  // Lấy thông tin user hiện tại
  getCurrentUser() {
    return this.currentUser
  }

  // Lấy userId hiện tại
  getUserId() {
    // QUAN TRỌNG: KHÔNG fallback về ID mặc định
    // Chỉ trả về ID nếu thực sự có user đã đăng nhập
    const id = this.currentUser?.id || localStorage.getItem('userId')
    return id ? parseInt(id) : null
  }

  // Lấy token
  getAuthToken() {
    return this.currentUser?.token || localStorage.getItem('authToken') || ''
  }

  // Cập nhật thông tin user
  updateUser(userData) {
    if (this.currentUser) {
      this.currentUser = {
        ...this.currentUser,
        ...userData
      }
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      console.log('✅ Cập nhật thông tin user:', this.currentUser)
      return {
        success: true,
        user: this.currentUser
      }
    }
    return {
      success: false,
      message: 'Chưa đăng nhập'
    }
  }

  // Headers cho API calls
  getAuthHeaders() {
    const token = this.getAuthToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }
}

export default new AuthService()
