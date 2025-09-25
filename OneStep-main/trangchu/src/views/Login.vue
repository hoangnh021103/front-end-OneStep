<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>🔑 Đăng nhập</h2>
        <p>Chào mừng bạn quay trở lại!</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email *</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required
            placeholder="Nhập email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Mật khẩu *</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required
            placeholder="Nhập mật khẩu"
          >
        </div>
        
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.rememberMe">
            <span class="checkmark"></span>
            Ghi nhớ đăng nhập
          </label>
          <a href="#" class="forgot-link">Quên mật khẩu?</a>
        </div>
        
        <button type="submit" class="auth-btn" :disabled="isLoading">
          <span v-if="isLoading">⏳ Đang đăng nhập...</span>
          <span v-else>🚀 Đăng nhập</span>
        </button>
        
        <!-- Demo Accounts for Testing -->
        <div class="demo-accounts">
          <h4>🧪 Tài khoản demo để test:</h4>
          <div class="demo-buttons">
            <button type="button" @click="fillDemoAccount('hieunguyen.ff.k5@gmail.com')" class="demo-btn">
              👤 User 1 (hieunguyen.ff.k5@gmail.com)
            </button>
            <button type="button" @click="fillDemoAccount('test@gmail.com')" class="demo-btn">
              👤 User 2 (test@gmail.com)
            </button>
            <button type="button" @click="fillDemoAccount('demo@gmail.com')" class="demo-btn">
              👤 User 3 (demo@gmail.com)
            </button>
          </div>
        </div>
        
        <div class="auth-footer">
          <p>Chưa có tài khoản? <router-link to="/register" class="auth-link">Đăng ký ngay</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      isLoading: false,
      form: {
        email: '',
        password: '',
        rememberMe: false
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  mounted() {
    // Kiểm tra nếu đã đăng nhập thì chuyển về trang chủ
    if (this.isAuthenticated) {
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    
    fillDemoAccount(email) {
      this.form.email = email
      this.form.password = 'demo123' // Mật khẩu demo
    },
    
    async handleLogin() {
      // Validation cơ bản
      if (!this.form.email || !this.form.password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
      }
      
      this.isLoading = true;
      
      try {
        const result = await this.login({
          email: this.form.email,
          password: this.form.password,
          rememberMe: this.form.rememberMe
        });
        
        if (result.success) {
          alert('Đăng nhập thành công!');
          this.$router.push('/');
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        alert('Có lỗi xảy ra khi đăng nhập!');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 700;
}

.auth-header p {
  color: #666;
  font-size: 16px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: auto;
}

.forgot-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.forgot-link:hover {
  text-decoration: underline;
}

.auth-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.auth-footer p {
  color: #666;
  margin: 0;
}

.auth-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

/* Demo accounts styles */
.demo-accounts {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.demo-accounts h4 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.demo-btn:hover {
  background-color: #e9ecef;
  border-color: #007bff;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .auth-header h2 {
    font-size: 24px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>