<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>🔐 Đăng ký tài khoản</h2>
        <p>Tạo tài khoản để mua sắm dễ dàng hơn</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="fullName">Họ và tên *</label>
          <input 
            type="text" 
            id="fullName" 
            v-model="form.fullName" 
            required
            placeholder="Nhập họ và tên"
          >
        </div>
        
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
          <label for="phone">Số điện thoại *</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="form.phone" 
            required
            placeholder="Nhập số điện thoại"
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
            minlength="6"
          >
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu *</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="form.confirmPassword" 
            required
            placeholder="Xác nhận mật khẩu"
          >
        </div>
        
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.agreeTerms" required>
            <span class="checkmark"></span>
            Tôi đồng ý với <a href="#" class="terms-link">Điều khoản sử dụng</a>
          </label>
        </div>
        
        <button type="submit" class="auth-btn" :disabled="isLoading">
          <span v-if="isLoading">⏳ Đang xử lý...</span>
          <span v-else>✅ Đăng ký ngay</span>
        </button>
        
        <div class="auth-footer">
          <p>Đã có tài khoản? <router-link to="/login" class="auth-link">Đăng nhập ngay</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      isLoading: false,
      form: {
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
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
    ...mapActions('auth', ['register']),
    
    async handleRegister() {
      // Validation cơ bản
      if (!this.form.fullName || !this.form.email || !this.form.phone || !this.form.password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
      }
      
      // Kiểm tra mật khẩu khớp
      if (this.form.password !== this.form.confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
      }
      
      // Kiểm tra độ dài mật khẩu
      if (this.form.password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
      }
      
      // Kiểm tra email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.form.email)) {
        alert('Email không hợp lệ!');
        return;
      }
      
      // Kiểm tra số điện thoại
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(this.form.phone)) {
        alert('Số điện thoại không hợp lệ!');
        return;
      }
      
      // Kiểm tra điều khoản
      if (!this.form.agreeTerms) {
        alert('Vui lòng đồng ý với điều khoản sử dụng!');
        return;
      }
      
      this.isLoading = true;
      
      try {
        const result = await this.register({
          fullName: this.form.fullName,
          email: this.form.email,
          phone: this.form.phone,
          password: this.form.password
        });
        
        if (result.success) {
          alert('Đăng ký thành công! Bạn đã được đăng nhập tự động.');
          this.$router.push('/');
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Lỗi đăng ký:', error);
        alert('Có lỗi xảy ra khi đăng ký!');
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
  max-width: 450px;
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

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 12px;
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

.terms-link {
  color: #007bff;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.auth-btn {
  background: linear-gradient(135deg, #007bff, #0056b3);
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
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
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

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .auth-header h2 {
    font-size: 24px;
  }
}
</style>