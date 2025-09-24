import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Cart from '../views/Cart.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Checkout from '../views/Checkout.vue'
import OrderComplete from '../views/OrderComplete.vue'
import OrderTracking from '../views/OrderTracking.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/order-complete',
    name: 'OrderComplete',
    component: OrderComplete
  },
  {
    path: '/orders',
    name: 'OrderTracking',
    component: OrderTracking
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard để kiểm tra đăng nhập
router.beforeEach((to, from, next) => {
  // Lấy thông tin đăng nhập từ localStorage
  const token = localStorage.getItem('authToken')
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
  
  // Kiểm tra token có hợp lệ không
  let isAuthenticated = false
  if (token && user) {
    try {
      const tokenData = JSON.parse(atob(token))
      isAuthenticated = tokenData.userId === user.id
    } catch (error) {
      console.error('Token không hợp lệ:', error)
      // Xóa token không hợp lệ
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
    }
  }
  
  // Danh sách các route cần đăng nhập
  const protectedRoutes = ['/checkout', '/profile', '/orders']
  
  // Kiểm tra nếu route cần đăng nhập
  if (protectedRoutes.includes(to.path) && !isAuthenticated) {
    alert('Vui lòng đăng nhập để tiếp tục!')
    next('/login')
    return
  }
  
  // Nếu đã đăng nhập và truy cập trang login/register, chuyển về trang chủ
  if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

export default router
