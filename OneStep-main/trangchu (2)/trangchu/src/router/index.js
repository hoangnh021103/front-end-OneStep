import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Cart from '../views/Cart.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Checkout from '../views/Checkout.vue'
import OrderComplete from '../views/OrderComplete.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
