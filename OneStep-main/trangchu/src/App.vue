<template>
  <div id="app">
    <div class="colorlib-loader" v-if="loading"></div>
    
    <div id="page">
      <!-- Navigation -->
      <AppHeader />
      
      <!-- Sale Banner -->
      <SaleBanner />
      
      <!-- Main Content -->
      <router-view />
      
      <!-- Footer -->
      <AppFooter />
    </div>

    <!-- Back to Top Button -->
    <div class="gototop js-top">
      <a href="#" class="js-gotop" @click.prevent="scrollToTop">
        <i class="ion-ios-arrow-up"></i>
      </a>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import SaleBanner from './components/SaleBanner.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    SaleBanner
  },
  data() {
    return {
      loading: false
    }
  },
  async mounted() {
    // Kiểm tra đăng nhập khi app khởi động
    await this.checkAuth()
  },
  methods: {
    ...mapActions('auth', ['checkAuth']),
    
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Montserrat', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.colorlib-loader {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: url('./assets/images/loader.gif') center no-repeat #fff;
}
</style>
