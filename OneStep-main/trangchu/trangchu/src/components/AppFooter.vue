<template>
  <footer id="colorlib-footer" role="contentinfo">
    <div class="container">
      <div class="row row-pb-md">
        <div class="col footer-col colorlib-widget">
          <h4>🌟  onestep shoes</h4>
          <p>Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với thiết kế độc đáo và phong cách hiện đại. Mỗi đôi giày đều được chế tác với sự tận tâm và chú ý đến từng chi tiết.</p>
          <p>
            <ul class="colorlib-social-icons">
              <li><a href="#"><i class="icon-twitter"></i></a></li>
              <li><a href="#"><i class="icon-facebook"></i></a></li>
              <li><a href="#"><i class="icon-linkedin"></i></a></li>
              <li><a href="#"><i class="icon-dribbble"></i></a></li>
            </ul>
          </p>
        </div>
        <div class="col footer-col colorlib-widget">
          <h4>🛍️ Chăm sóc khách hàng</h4>
          <p>
            <ul class="colorlib-footer-links">
              <li><router-link to="/contact">📞 Liên hệ</router-link></li>
              <li><a href="#">🔄 Đổi trả/Hoàn tiền</a></li>
              <li><a href="#">🎁 Thẻ quà tặng</a></li>
              <li><a href="#">❤️ Danh sách yêu thích</a></li>
              <li><a href="#">⭐ Đặc biệt</a></li>
              <li><a href="#">🎯 Dịch vụ khách hàng</a></li>
              <li><a href="#">🗺️ Sơ đồ trang</a></li>
            </ul>
          </p>
        </div>
        <div class="col footer-col colorlib-widget">
          <h4>ℹ️ Thông tin</h4>
          <p>
            <ul class="colorlib-footer-links">
              <li><router-link to="/about">👥 Về chúng tôi</router-link></li>
              <li><a href="#">🚚 Thông tin giao hàng</a></li>
              <li><a href="#">🔒 Chính sách bảo mật</a></li>
              <li><a href="#">💬 Hỗ trợ</a></li>
              <li><a href="#">📦 Theo dõi đơn hàng</a></li>
            </ul>
          </p>
        </div>
        <div class="col footer-col">
          <h4>📰 Tin tức</h4>
          <ul class="colorlib-footer-links">
            <li><a href="#">📝 Blog</a></li>
            <li><a href="#">📰 Báo chí</a></li>
            <li><a href="#">🎪 Triển lãm</a></li>
          </ul>
        </div>
        <div class="col footer-col">
          <h4>📍 Thông tin liên hệ</h4>
          <ul class="colorlib-footer-links">
            <li>🏢 74 đường cầu diễn, <br> Hà Nội</li>
            <li><a href="tel://1234567920">📞 + 1235 2355 98</a></li>
            <li><a href="mailto:info@yoursite.com">✉️ info@yoursite.com</a></li>
            <li><a href="#">🌐 yoursite.com</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="copy">
      <div class="row">
        <div class="col-sm-12 text-center">
          <p>&copy; 2025 Onestep. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
#colorlib-footer {
  background: #333;
  color: #fff;
  padding: 60px 0 30px;
}

#colorlib-footer h4 {
  color: #fff;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

#colorlib-footer p {
  color: #ccc;
  line-height: 1.6;
}

.colorlib-footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.colorlib-footer-links li {
  margin-bottom: 10px;
}

.colorlib-footer-links a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.colorlib-footer-links a:hover {
  color: #007bff;
}

.colorlib-social-icons {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
}

.colorlib-social-icons li a {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: #007bff;
  color: white;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  transition: background 0.3s;
}

.colorlib-social-icons li a:hover {
  background: #0056b3;
}

.copy {
  border-top: 1px solid #555;
  padding-top: 20px;
  margin-top: 30px;
}

.copy p {
  color: #999;
  margin: 0;
}
</style>
