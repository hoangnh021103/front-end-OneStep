# SneakerShop Vue.js Project

## Cấu Trúc Component Đã Tách

Dự án đã được tách thành các component riêng biệt để dễ quản lý và bảo trì:

### 📁 Components Structure

```
src/
├── components/
│   ├── Header.vue              # Header với navigation và search
│   ├── HeroSlider.vue          # Slider chính của trang
│   ├── ProductCard.vue         # Card hiển thị sản phẩm
│   ├── FlashDealCard.vue       # Card cho flash deals
│   ├── ProductDetailModal.vue  # Modal chi tiết sản phẩm
│   └── Footer.vue              # Footer với thông tin liên hệ
├── App.vue                     # Component chính
└── assets/
    └── style.css               # CSS chung
```

### 🧩 Components Chi Tiết

#### 1. **Header.vue**
- **Chức năng**: Navigation, search, giỏ hàng, đăng nhập
- **Props**: `cartItemsCount` (số lượng item trong giỏ)
- **Events**: `toggle-cart`, `toggle-login`

#### 2. **HeroSlider.vue**
- **Chức năng**: Slider chính với hình ảnh và CTA
- **Props**: `slides` (array các slide)
- **Events**: `cta-click`

#### 3. **ProductCard.vue**
- **Chức năng**: Hiển thị thông tin sản phẩm
- **Props**: `product` (object sản phẩm)
- **Events**: `show-product-detail`

#### 4. **FlashDealCard.vue**
- **Chức năng**: Hiển thị flash deals với giá cũ/mới
- **Props**: `deal` (object flash deal)
- **Events**: `show-product-detail`

#### 5. **ProductDetailModal.vue**
- **Chức năng**: Modal chi tiết sản phẩm với quantity selector
- **Props**: `show`, `product`
- **Events**: `close`, `add-to-cart`, `buy-now`

#### 6. **Footer.vue**
- **Chức năng**: Footer với links, support, newsletter
- **Props**: `quickLinks`, `customerSupport`, `socialLinks`
- **Events**: `subscribe-newsletter`

### 🎯 Lợi Ích Của Việc Tách Component

1. **Dễ Bảo Trì**: Mỗi component có trách nhiệm riêng biệt
2. **Tái Sử Dụng**: Components có thể được sử dụng ở nhiều nơi
3. **Dễ Test**: Có thể test từng component riêng lẻ
4. **Code Sạch**: App.vue ngắn gọn và dễ đọc hơn
5. **Team Work**: Nhiều developer có thể làm việc trên các component khác nhau

### 🚀 Cách Sử Dụng

1. **Import Components**:
```javascript
import Header from './components/Header.vue'
import ProductCard from './components/ProductCard.vue'
// ... other imports
```

2. **Register Components**:
```javascript
components: {
  Header,
  ProductCard,
  // ... other components
}
```

3. **Sử Dụng Trong Template**:
```vue
<Header 
  :cartItemsCount="cartItems.length"
  @toggle-cart="handleCartToggle"
/>
```

### 📱 Responsive Design

Tất cả components đều có responsive design cho:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

### 🎨 Styling

- Sử dụng CSS scoped cho mỗi component
- CSS chung trong `assets/style.css`
- Tailwind CSS classes cho styling nhanh

### 🔧 Tính Năng Chính

- ✅ Hero Slider với autoplay
- ✅ Product cards với hover effects
- ✅ Flash deals với giá cũ/mới
- ✅ Product detail modal
- ✅ Quantity selector
- ✅ Add to cart functionality
- ✅ Newsletter subscription
- ✅ Responsive design
- ✅ Search functionality
- ✅ Cart management

### 📝 Ghi Chú

- Tất cả components đều emit events để parent component xử lý
- Data được quản lý tập trung trong App.vue
- CSS được tách riêng cho từng component để tránh conflict
#   D u A n T n  
 