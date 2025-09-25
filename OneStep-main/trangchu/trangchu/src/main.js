import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/style.css'
import axios from 'axios'

// Run app on http://localhost:5174 and let dev-server proxy forward API requests.
// Use current origin as base so calls like axios.get('/san-pham/hien-thi') hit 5174.
axios.defaults.baseURL = (typeof window !== 'undefined' ? window.location.origin : '') || 'http://localhost:5174'
axios.defaults.withCredentials = false

const app = createApp(App)

// Thêm axios vào Vue instance
app.config.globalProperties.$http = axios

app.use(store)
app.use(router)

app.mount('#app')
