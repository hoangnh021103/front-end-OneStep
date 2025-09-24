<template>
  <nav class="colorlib-nav" role="navigation">
    <div class="top-menu">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 col-md-6">
            <div id="colorlib-logo">
              <router-link to="/" class="logo-container">
                <img src="/images/logo.jpg" alt="OneStep Logo" class="logo-image" />
                <div class="logo-text">
                  <span class="main-text"> Onestep Shoes</span>
                </div>
              </router-link>
            </div>
          </div>
          <div class="col-sm-6 col-md-6">
            <div class="search-cart-container">
              <div class="auth-section">
                <!-- Hiển thị khi chưa đăng nhập -->
                <template v-if="!isAuthenticated">
                  <router-link to="/login" class="auth-btn login-btn">
                    <i class="icon-user"></i>
                    <span>Đăng nhập</span>
                  </router-link>
                  <router-link to="/register" class="auth-btn register-btn">
                    <i class="icon-user-plus"></i>
                    <span>Đăng ký</span>
                  </router-link>
                </template>
                
                <!-- Hiển thị khi đã đăng nhập -->
                <template v-else>
                  <div class="user-menu">
                    <div class="user-info">
                      <i class="icon-user"></i>
                      <span class="user-name">{{ userFullName }}</span>
                    </div>
                    <div class="user-actions">
                      <button @click="handleLogout" class="logout-btn">
                        <i class="icon-log-out"></i>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </template>
              </div>
              <div class="cart-section">
                <router-link to="/orders" class="order-tracking-link">
                  <i class="icon-truck"></i> 
                  <span class="order-text">Theo dõi đơn hàng</span>
                </router-link>
                <router-link to="/cart" class="cart-link">
                  <i class="icon-shopping-cart"></i> 
                  <span class="cart-text">Giỏ hàng</span>
                  <span class="cart-count">[{{ cartItemCount }}]</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 text-left menu-1">
            <ul>
              <li :class="{ active: $route.name === 'Home' }">
                <router-link to="/">🏠 Trang chủ</router-link>
              </li>
              <li :class="{ active: $route.name === 'Products' }">
                <router-link to="/products">Tất cả sản phẩm</router-link>
              </li>
              <li :class="{ active: $route.name === 'About' }">
                <router-link to="/about">ℹ️ Về chúng tôi</router-link>
              </li>
              <li :class="{ active: $route.name === 'Contact' }">
                <router-link to="/contact">📞 Liên hệ</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppHeader',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters('cart', ['cartItemCount']),
    ...mapGetters('auth', ['isAuthenticated', 'userFullName'])
  },
  mounted() {
    // Kiểm tra đăng nhập khi component được mount
    this.checkAuth()
  },
  methods: {
    ...mapActions('auth', ['logout', 'checkAuth']),
    
    async handleLogout() {
      if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        this.logout()
        this.$router.push('/')
        alert('Đã đăng xuất thành công!')
      }
    }
  }
}
</script>

<style scoped>
.colorlib-nav {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

#colorlib-logo a {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-decoration: none;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
}

.logo-image {
  height: 60px;
  width: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.main-text {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
  line-height: 1.3;
}

.menu-1 ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}

.menu-1 li {
  margin-right: 30px;
}

.menu-1 li a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.menu-1 li a:hover,
.menu-1 li.active a {
  color: #007bff;
}

.cart-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.order-tracking-link {
  background: #28a745;
  color: white !important;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.order-tracking-link:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
  color: white !important;
}

.order-text {
  font-size: 14px;
}

.cart-link {
  background: #007bff;
  color: white !important;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.cart-link:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  color: white !important;
}

.cart-text {
  font-size: 14px;
}

.cart-count {
  background: #ff4757;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.search-cart-container {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: flex-end;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.login-btn {
  background: #f8f9fa;
  color: #495057;
  border-color: #e9ecef;
}

.login-btn:hover {
  background: #e9ecef;
  color: #495057;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.register-btn {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border-color: #007bff;
}

.register-btn:hover {
  background: linear-gradient(135deg, #0056b3, #004085);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.user-info i {
  color: #007bff;
  font-size: 16px;
}

.user-name {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.user-actions {
  display: flex;
  align-items: center;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}


@media (max-width: 768px) {
  .search-cart-container {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .auth-section {
    justify-content: center;
    order: -1;
  }
  
  .auth-btn {
    flex: 1;
    justify-content: center;
    padding: 10px 12px;
  }
  
}

@media (max-width: 480px) {
  .auth-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .auth-btn {
    font-size: 13px;
    padding: 8px 12px;
  }
  
  .user-menu {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .user-info {
    justify-content: center;
  }
  
  .logout-btn {
    justify-content: center;
    font-size: 13px;
    padding: 8px 12px;
  }
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .search-cart-container {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  
  .cart-section {
    justify-content: center;
    flex-direction: column;
    gap: 8px;
  }
  
  .order-tracking-link {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .order-text {
    display: none;
  }
  
  .cart-link {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .cart-text {
    display: none;
  }
  
  .cart-count {
    margin-left: 5px;
  }
}

@media (max-width: 576px) {
  .col-sm-6 {
    margin-bottom: 10px;
  }
  
  .search-cart-container {
    gap: 8px;
  }
  
  .logo-container {
    gap: 8px;
  }
  
  .logo-circle {
    width: 50px;
    height: 50px;
  }
  
  .logo-circle::before {
    width: 40px;
    height: 40px;
  }
  
  .circle-text {
    font-size: 7px;
    top: 6px;
  }
  
  .sneaker-icon {
    font-size: 16px;
  }
  
  .main-text {
    font-size: 16px;
  }
}
</style>
