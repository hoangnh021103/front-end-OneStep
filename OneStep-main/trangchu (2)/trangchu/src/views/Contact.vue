<template>
  <div>
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <div class="container">
        <div class="row">
          <div class="col">
            <p class="bread">
              <span><router-link to="/">Trang chủ</router-link></span> / 
              <span>Liên hệ</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="colorlib-contact">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>📞 Liên hệ với chúng tôi</h2>
            <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
          </div>
        </div>
        
        <div class="row">
          <!-- Contact Form -->
          <div class="col-md-8">
            <div class="contact-form">
              <h3>Gửi tin nhắn cho chúng tôi</h3>
              <form @submit.prevent="submitForm">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="name">Họ và tên *</label>
                      <input 
                        type="text" 
                        id="name" 
                        v-model="form.name"
                        class="form-control" 
                        required
                        :class="{ 'is-invalid': errors.name }"
                      >
                      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="email">Email *</label>
                      <input 
                        type="email" 
                        id="email" 
                        v-model="form.email"
                        class="form-control" 
                        required
                        :class="{ 'is-invalid': errors.email }"
                      >
                      <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="phone">Số điện thoại</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        v-model="form.phone"
                        class="form-control"
                        :class="{ 'is-invalid': errors.phone }"
                      >
                      <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="subject">Chủ đề *</label>
                      <select 
                        id="subject" 
                        v-model="form.subject"
                        class="form-control" 
                        required
                        :class="{ 'is-invalid': errors.subject }"
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="general">Thông tin chung</option>
                        <option value="order">Đơn hàng</option>
                        <option value="return">Đổi trả</option>
                        <option value="complaint">Khiếu nại</option>
                        <option value="suggestion">Góp ý</option>
                      </select>
                      <div v-if="errors.subject" class="invalid-feedback">{{ errors.subject }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="message">Nội dung tin nhắn *</label>
                  <textarea 
                    id="message" 
                    v-model="form.message"
                    class="form-control" 
                    rows="6" 
                    required
                    :class="{ 'is-invalid': errors.message }"
                    placeholder="Hãy chia sẻ với chúng tôi về vấn đề hoặc câu hỏi của bạn..."
                  ></textarea>
                  <div v-if="errors.message" class="invalid-feedback">{{ errors.message }}</div>
                </div>
                
                <div class="form-group">
                  <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div class="col-md-4">
            <div class="contact-info">
              <h3>Thông tin liên hệ</h3>
              
              <div class="contact-item">
                <div class="contact-icon">
                  <i class="icon-location"></i>
                </div>
                <div class="contact-details">
                  <h4>Địa chỉ</h4>
                  <p>74 đường cầu diễn<br>Hà Nội, Việt Nam</p>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">
                  <i class="icon-phone"></i>
                </div>
                <div class="contact-details">
                  <h4>Điện thoại</h4>
                  <p><a href="tel:+1235235598">+1235 2355 98</a></p>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">
                  <i class="icon-mail"></i>
                </div>
                <div class="contact-details">
                  <h4>Email</h4>
                  <p><a href="mailto:info@yoursite.com">info@yoursite.com</a></p>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">
                  <i class="icon-clock"></i>
                </div>
                <div class="contact-details">
                  <h4>Giờ làm việc</h4>
                  <p>Thứ 2 - Thứ 6: 8:00 - 18:00<br>Thứ 7: 8:00 - 12:00</p>
                </div>
              </div>
              
              <div class="social-links">
                <h4>Theo dõi chúng tôi</h4>
                <div class="social-icons">
                  <a href="#" class="social-icon"><i class="icon-facebook"></i></a>
                  <a href="#" class="social-icon"><i class="icon-twitter"></i></a>
                  <a href="#" class="social-icon"><i class="icon-instagram"></i></a>
                  <a href="#" class="social-icon"><i class="icon-youtube"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Section -->
    <div class="colorlib-map">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.123456789!2d105.123456789!3d21.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA3JzI0LjQiTiAxMDXCsDA3JzI0LjQiRQ!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                width="100%" 
                height="400" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="colorlib-faq">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>❓ Câu hỏi thường gặp</h2>
            <p>Những câu hỏi phổ biến từ khách hàng</p>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="accordion" id="faqAccordion">
              <div class="accordion-item" v-for="(faq, index) in faqs" :key="index">
                <h2 class="accordion-header">
                  <button 
                    class="accordion-button" 
                    type="button" 
                    :class="{ collapsed: activeFaq !== index }"
                    @click="toggleFaq(index)"
                  >
                    {{ faq.question }}
                  </button>
                </h2>
                <div 
                  class="accordion-collapse collapse" 
                  :class="{ show: activeFaq === index }"
                >
                  <div class="accordion-body">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      errors: {},
      isSubmitting: false,
      activeFaq: 0,
      faqs: [
        {
          question: 'Làm thế nào để đặt hàng?',
          answer: 'Bạn có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán. Hoặc gọi điện trực tiếp cho chúng tôi qua hotline.'
        },
        {
          question: 'Thời gian giao hàng là bao lâu?',
          answer: 'Đối với đơn hàng trong nội thành Hà Nội: 1-2 ngày làm việc. Đối với các tỉnh thành khác: 3-5 ngày làm việc. Miễn phí vận chuyển cho đơn hàng từ 2 triệu đồng.'
        },
        {
          question: 'Chính sách đổi trả như thế nào?',
          answer: 'Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên vẹn, chưa sử dụng và có hóa đơn mua hàng.'
        },
        {
          question: 'Có hỗ trợ thanh toán online không?',
          answer: 'Có, chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử và COD (thanh toán khi nhận hàng).'
        },
        {
          question: 'Làm sao để kiểm tra tình trạng đơn hàng?',
          answer: 'Bạn có thể kiểm tra tình trạng đơn hàng bằng cách nhập mã đơn hàng vào mục "Theo dõi đơn hàng" trên website hoặc liên hệ trực tiếp với chúng tôi.'
        }
      ]
    }
  },
  methods: {
    submitForm() {
      this.validateForm()
      
      if (Object.keys(this.errors).length === 0) {
        this.isSubmitting = true
        
        // Simulate form submission
        setTimeout(() => {
          this.isSubmitting = false
          alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.')
          this.resetForm()
        }, 2000)
      }
    },
    
    validateForm() {
      this.errors = {}
      
      if (!this.form.name.trim()) {
        this.errors.name = 'Vui lòng nhập họ và tên'
      }
      
      if (!this.form.email.trim()) {
        this.errors.email = 'Vui lòng nhập email'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Email không hợp lệ'
      }
      
      if (this.form.phone && !this.isValidPhone(this.form.phone)) {
        this.errors.phone = 'Số điện thoại không hợp lệ'
      }
      
      if (!this.form.subject) {
        this.errors.subject = 'Vui lòng chọn chủ đề'
      }
      
      if (!this.form.message.trim()) {
        this.errors.message = 'Vui lòng nhập nội dung tin nhắn'
      }
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    isValidPhone(phone) {
      const phoneRegex = /^[0-9]{10,11}$/
      return phoneRegex.test(phone.replace(/\s/g, ''))
    },
    
    resetForm() {
      this.form = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
      this.errors = {}
    },
    
    toggleFaq(index) {
      this.activeFaq = this.activeFaq === index ? -1 : index
    }
  }
}
</script>

<style scoped>
.breadcrumbs {
  background: #f8f9fa;
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;
}

.bread {
  margin: 0;
  color: #666;
}

.bread a {
  color: #007bff;
  text-decoration: none;
}

.colorlib-contact {
  padding: 80px 0;
}

.contact-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.contact-form h3 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 4px;
  padding: 12px 15px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
}

.contact-info {
  background: #f8f9fa;
  padding: 40px 30px;
  border-radius: 8px;
  height: fit-content;
}

.contact-info h3 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
}

.contact-icon {
  width: 50px;
  height: 50px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.contact-icon i {
  color: white;
  font-size: 1.2rem;
}

.contact-details h4 {
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.contact-details p {
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.contact-details a {
  color: #007bff;
  text-decoration: none;
}

.contact-details a:hover {
  text-decoration: underline;
}

.social-links {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e9ecef;
}

.social-links h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icon {
  width: 40px;
  height: 40px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: background 0.3s;
}

.social-icon:hover {
  background: #0056b3;
  color: white;
}

.colorlib-map {
  margin: 0;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.colorlib-faq {
  background: #f8f9fa;
  padding: 80px 0;
}

.accordion-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 15px;
  background: white;
}

.accordion-button {
  background: white;
  border: none;
  padding: 20px;
  font-weight: 600;
  color: #333;
  text-align: left;
  border-radius: 8px;
}

.accordion-button:not(.collapsed) {
  background: #007bff;
  color: white;
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
  border: none;
}

.accordion-body {
  padding: 20px;
  color: #666;
  line-height: 1.6;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 768px) {
  .contact-form,
  .contact-info {
    padding: 30px 20px;
  }
  
  .contact-item {
    flex-direction: column;
    text-align: center;
  }
  
  .contact-icon {
    margin: 0 auto 15px;
  }
  
  .social-icons {
    justify-content: center;
  }
}
</style>
