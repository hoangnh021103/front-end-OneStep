import { createStore } from 'vuex'
import products from './modules/products'
import cart from './modules/cart'
import filters from './modules/filters'

export default createStore({
  modules: {
    products,
    cart,
    filters
  }
})
