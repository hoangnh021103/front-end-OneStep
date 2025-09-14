<template>
  <nav class="colorlib-nav" role="navigation">
    <div class="top-menu">
      <div class="container">
        <div class="row">
          <div class="col-sm-7 col-md-9">
            <div id="colorlib-logo">
              <router-link to="/">✨ Giày Dép Premium</router-link>
            </div>
          </div>
          <div class="col-sm-5 col-md-3">
            <form @submit.prevent="handleSearch" class="search-wrap">
              <div class="form-group">
                <input 
                  type="search" 
                  class="form-control search" 
                  placeholder="🔍 Tìm kiếm sản phẩm..."
                  v-model="searchQuery"
                >
                <button class="btn btn-primary submit-search text-center" type="submit">
                  <i class="icon-search"></i>
                </button>
              </div>
            </form>
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
              <li class="cart">
                <router-link to="/cart">
                  <i class="icon-shopping-cart"></i> 
                  🛒 Giỏ hàng 
                  <span id="cart-item-count">[{{ cartItemCount }}]</span>
                </router-link>
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
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters('cart', ['cartItemCount'])
  },
  methods: {
    ...mapActions('products', ['searchProducts']),
    
    handleSearch() {
      this.searchProducts(this.searchQuery)
      if (this.$route.name !== 'Products') {
        this.$router.push('/products')
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

.cart a {
  background: #007bff;
  color: white !important;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s;
}

.cart a:hover {
  background: #0056b3;
}

.search-wrap {
  position: relative;
}

.search-wrap .form-control {
  padding-right: 50px;
}

.submit-search {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: #007bff;
  color: white;
  padding: 8px 12px;
  border-radius: 3px;
}
</style>
