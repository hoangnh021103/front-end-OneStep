import { createStore } from 'vuex'
import products from './modules/products'
import cart from './modules/cart'
import filters from './modules/filters'
import productDetails from './modules/productDetails'
import auth from './modules/auth'
import payment from './modules/payment'
import order from './modules/order'
import orders from './modules/orders'

export default createStore({
  modules: {
    products,
    cart,
    filters,
    productDetails,
    auth,
    payment,
    order,
    orders
  }
})
