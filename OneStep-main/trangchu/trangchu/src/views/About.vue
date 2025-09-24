<template>
  <div>
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <div class="container">
        <div class="row">
          <div class="col">
            <p class="bread">
              <span><router-link to="/">Trang chủ</router-link></span> / 
              <span>Về chúng tôi</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="colorlib-about">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>🌟 onestep shoes </h2>
            <p>Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với thiết kế độc đáo</p>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="about-img">
              <img src="images/about.jpg" class="img-fluid" alt="Về chúng tôi">
            </div>
          </div>
          <div class="col-md-6">
            <div class="about-content">
              <h3>Câu chuyện của chúng tôi</h3>
              <p>Giày Dép Premium được thành lập với tầm nhìn tạo ra những sản phẩm giày dép chất lượng cao, phù hợp với mọi phong cách và nhu cầu của khách hàng. Chúng tôi tin rằng mỗi đôi giày không chỉ là một sản phẩm mà còn là một phần của cá tính và phong cách sống.</p>
              
              <p>Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi đã xây dựng được mối quan hệ đối tác bền vững với các thương hiệu nổi tiếng thế giới như Nike, Adidas, Converse, Vans và nhiều thương hiệu khác.</p>
              
              <h4>Cam kết của chúng tôi</h4>
              <ul class="commitment-list">
                <li>✅ Chất lượng sản phẩm đảm bảo 100% chính hãng</li>
                <li>✅ Giá cả cạnh tranh và minh bạch</li>
                <li>✅ Dịch vụ khách hàng tận tâm 24/7</li>
                <li>✅ Giao hàng nhanh chóng và an toàn</li>
                <li>✅ Chính sách đổi trả linh hoạt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="colorlib-team">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>👥 Đội ngũ của chúng tôi</h2>
            <p>Những con người tài năng đằng sau thương hiệu</p>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-4 text-center">
            <div class="team-member">
              <div class="team-img">
                <img src="images/person1.jpg" class="img-fluid" alt="Nguyễn Văn A">
              </div>
              <div class="team-info">
                <h4>Nguyễn Văn A</h4>
                <p class="position">Giám đốc điều hành</p>
                <p class="description">Với 15 năm kinh nghiệm trong ngành thời trang, anh A đã dẫn dắt công ty phát triển mạnh mẽ.</p>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 text-center">
            <div class="team-member">
              <div class="team-img">
                <img src="images/person2.jpg" class="img-fluid" alt="Trần Thị B">
              </div>
              <div class="team-info">
                <h4>Trần Thị B</h4>
                <p class="position">Giám đốc Marketing</p>
                <p class="description">Chuyên gia marketing với tầm nhìn sáng tạo, chị B đã xây dựng thương hiệu thành công.</p>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 text-center">
            <div class="team-member">
              <div class="team-img">
                <img src="images/person3.jpg" class="img-fluid" alt="Lê Văn C">
              </div>
              <div class="team-info">
                <h4>Lê Văn C</h4>
                <p class="position">Trưởng phòng Kinh doanh</p>
                <p class="description">Với kinh nghiệm quản lý chuỗi cung ứng, anh C đảm bảo sản phẩm luôn có sẵn cho khách hàng.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Values Section -->
    <div class="colorlib-values">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>💎 Giá trị cốt lõi</h2>
            <p>Những nguyên tắc định hướng hoạt động của chúng tôi</p>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-3 text-center">
            <div class="value-item">
              <div class="value-icon">
                <i class="icon-star"></i>
              </div>
              <h4>Chất lượng</h4>
              <p>Chúng tôi cam kết mang đến những sản phẩm chất lượng cao nhất, đảm bảo sự hài lòng của khách hàng.</p>
            </div>
          </div>
          
          <div class="col-md-3 text-center">
            <div class="value-item">
              <div class="value-icon">
                <i class="icon-heart"></i>
              </div>
              <h4>Đam mê</h4>
              <p>Chúng tôi yêu thích những gì mình làm và luôn cố gắng mang đến trải nghiệm tốt nhất cho khách hàng.</p>
            </div>
          </div>
          
          <div class="col-md-3 text-center">
            <div class="value-item">
              <div class="value-icon">
                <i class="icon-users"></i>
              </div>
              <h4>Khách hàng</h4>
              <p>Khách hàng là trung tâm của mọi hoạt động, chúng tôi luôn lắng nghe và phục vụ tận tình.</p>
            </div>
          </div>
          
          <div class="col-md-3 text-center">
            <div class="value-item">
              <div class="value-icon">
                <i class="icon-lightbulb"></i>
              </div>
              <h4>Đổi mới</h4>
              <p>Chúng tôi không ngừng cải tiến và đổi mới để mang đến những sản phẩm và dịch vụ tốt hơn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="colorlib-stats">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center colorlib-heading">
            <h2>📊 Thành tựu của chúng tôi</h2>
            <p>Những con số ấn tượng trong hành trình phát triển</p>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-3 text-center">
            <div class="stat-item">
              <div class="stat-number">10,000+</div>
              <div class="stat-label">Khách hàng hài lòng</div>
            </div>
          </div>
          
          <div class="col-md-3 text-center">
            <div class="stat-item">
              <div class="stat-number">50,000+</div>
              <div class="stat-label">Sản phẩm đã bán</div>
            </div>
          </div>
          
          <div class="col-md-3 text-center">
            <div class="stat-item">
              <div class="stat-number">15+</div>
              <div class="stat-label">Thương hiệu đối tác</div>
            </div>
          </div>
          
          <div class="col-md-3 text-center">
            <div class="stat-item">
              <div class="stat-number">10+</div>
              <div class="stat-label">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
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

.colorlib-about {
  padding: 80px 0;
}

.about-img img {
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.about-content h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.about-content h4 {
  color: #007bff;
  margin: 30px 0 15px;
  font-size: 1.3rem;
}

.about-content p {
  color: #666;
  line-height: 1.8;
  margin-bottom: 20px;
}

.commitment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.commitment-list li {
  padding: 8px 0;
  color: #666;
  font-size: 1.1rem;
}

.colorlib-team {
  background: #f8f9fa;
  padding: 80px 0;
}

.team-member {
  background: white;
  border-radius: 8px;
  padding: 30px 20px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.team-member:hover {
  transform: translateY(-5px);
}

.team-img {
  margin-bottom: 20px;
}

.team-img img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #007bff;
}

.team-info h4 {
  color: #333;
  margin-bottom: 5px;
  font-size: 1.3rem;
}

.position {
  color: #007bff;
  font-weight: 600;
  margin-bottom: 15px;
}

.description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

.colorlib-values {
  padding: 80px 0;
}

.value-item {
  padding: 30px 20px;
  margin-bottom: 30px;
}

.value-icon {
  width: 80px;
  height: 80px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.value-icon i {
  font-size: 2rem;
  color: white;
}

.value-item h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.value-item p {
  color: #666;
  line-height: 1.6;
}

.colorlib-stats {
  background: #007bff;
  color: white;
  padding: 80px 0;
}

.stat-item {
  padding: 20px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: white;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .about-content {
    margin-top: 30px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .team-img img {
    width: 100px;
    height: 100px;
  }
}
</style>
