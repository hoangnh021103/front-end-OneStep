<template>
  <div id="app" style="display: flex;">
    <aside class="sidebar">
      <div class="logo">OneStep</div>
      <nav>
        <ul>
          <li
          :class="{active: currentTab === 'statistic'}"
  @click="currentTab = 'statistic'; showProductMenu = false"
>Thống Kê</li>
<li
  :class="{active: currentTab === 'sale'}"
  @click="currentTab = 'sale'; showProductMenu = false"
>Bán Hàng</li>
<li
  :class="{active: currentTab === 'invoice'}"
  @click="currentTab = 'invoice'; showProductMenu = false"
>Quản lý Hóa đơn</li>
          <li
            @click="toggleProductMenu"
            :class="{active: currentTab === 'product'}"
          >
            <span>
              Quản lý sản phẩm
              <span v-if="showProductMenu">▲</span>
              <span v-else>▼</span>
            </span>
          </li>
          <ul v-if="showProductMenu" class="submenu">
            <li @click="selectProductSub('sanpham')" :class="{active: productSubTab === 'sanpham'}">Sản phẩm</li>
            <li @click="selectProductSub('mausac')" :class="{active: productSubTab === 'mausac'}">Màu sắc</li>
            <li @click="selectProductSub('chatlieu')" :class="{active: productSubTab === 'chatlieu'}">Chất liệu</li>
            <li @click="selectProductSub('loaide')" :class="{active: productSubTab === 'loaide'}">Loại đế</li>
            <li @click="selectProductSub('danhmuc')" :class="{active: productSubTab === 'danhmuc'}">Danh mục</li>
            <li @click="selectProductSub('kichthuoc')" :class="{active: productSubTab === 'kichthuoc'}">Kích thước</li>
            <li @click="selectProductSub('thuonghieu')" :class="{active: productSubTab === 'thuonghieu'}">Thương hiệu</li>
          </ul>
          <li
            :class="{active: currentTab === 'customer'}"
            @click="currentTab = 'customer'; showProductMenu = false"
          >Quản lý khách hàng</li>
          <li
            :class="{active: currentTab === 'employee'}"
            @click="currentTab = 'employee'; showProductMenu = false"
          >Quản lý nhân viên</li>
          <li
            :class="{active: currentTab === 'discount'}"
            @click="currentTab = 'discount'; showProductMenu = false"
          >Quản lý đợt giảm giá</li>
          <li
            :class="{active: currentTab === 'voucher'}"
            @click="currentTab = 'voucher'; showProductMenu = false"
          >Quản lý phiếu giảm giá</li>
        </ul>
      </nav>
    </aside>
    <main style="flex:1;">
      <div v-if="currentTab === 'statistic' || currentTab === 'sale' || currentTab === 'invoice' || currentTab === 'discount' || currentTab === 'voucher'" class="blank-form"></div>
      <CustomerManager v-if="currentTab === 'customer'" />
      <CheckoutForm v-if="currentTab === 'employee'" :cart="cart" />
      <div v-if="currentTab === 'product'">
        <div v-if="productSubTab === 'sanpham'">Hiển thị Sản phẩm</div>
        <div v-else-if="productSubTab === 'mausac'">Hiển thị Màu sắc</div>
        <div v-else-if="productSubTab === 'chatlieu'">Hiển thị Chất liệu</div>
        <div v-else-if="productSubTab === 'loaide'">Hiển thị Loại đế</div>
        <div v-else-if="productSubTab === 'danhmuc'">Hiển thị Danh mục</div>
        <div v-else-if="productSubTab === 'kichthuoc'">Hiển thị Kích thước</div>
        <div v-else-if="productSubTab === 'thuonghieu'">Hiển thị Thương hiệu</div>
      </div>
    </main>
  </div>
</template>

<script>
import CheckoutForm from './components/CheckoutForm.vue'
import CustomerManager from './components/CustomerManager.vue'

export default {
  name: 'App',
  components: {
    CheckoutForm,
    CustomerManager
  },
  data() {
    return {
      currentTab: 'employee',
      showProductMenu: false,
      productSubTab: 'sanpham',
      cart: [
        { id: 1, name: 'Giày Sneaker A', quantity: 2, price: 500000 },
        { id: 2, name: 'Giày Sneaker B', quantity: 1, price: 700000 }
      ]
    }
  },
  methods: {
    toggleProductMenu() {
      this.showProductMenu = !this.showProductMenu;
      if (this.showProductMenu) {
        this.currentTab = 'product';
      }
    },
    selectProductSub(tab) {
      this.productSubTab = tab;
      this.currentTab = 'product';
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f7f8fa;
}
#app {
  min-height: 100vh;
}
.sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 24px 0 0 0;
}
.logo {
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 24px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul > li {
  padding: 12px 32px;
  cursor: pointer;
  color: #222;
  font-weight: 500;
  border-left: 4px solid transparent;
  transition: background 0.2s, border 0.2s;
}
.sidebar ul > li.active, .sidebar ul > li:hover {
  background: #f0f4ff;
  border-left: 4px solid #2563eb;
  color: #2563eb;
}
.submenu {
  list-style: none;
  padding-left: 32px;
  background: #f8fafc;
}
.submenu li {
  padding: 8px 0 8px 8px;
  cursor: pointer;
  color: #222;
  font-size: 1rem;
  border-left: 2px solid transparent;
  transition: background 0.2s, border 0.2s;
}
.submenu li.active, .submenu li:hover {
  background: #e0e7ff;
  border-left: 2px solid #2563eb;
  color: #2563eb;
}
main {
  padding: 0 32px 32px 32px;
  width: 100%;
}
.blank-form {
  background: #fff;
  border-radius: 12px;
  min-height: 400px;
  margin-top: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
</style>