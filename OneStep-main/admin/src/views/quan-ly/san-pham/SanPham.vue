<template>
  <div class="container">
    <!-- Bộ lọc -->
    <div class="filter-section">
      <h2>🔍 Bộ lọc tìm kiếm</h2>
      <div class="filter-grid">
        <input type="text" placeholder="🔎 Mã / Tên sản phẩm" />
        <select><option>📦 Trạng thái</option></select>
        <select><option>📁 Danh mục</option></select>
        <select><option>🧵 Chất liệu</option></select>
        <select><option>🏷️ Thương hiệu</option></select>
        <select><option>👟 Loại đế</option></select>
        <button class="btn-reset">♻️ Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="product-section">
      <div class="header">
        <h2>📋 Danh sách sản phẩm</h2>
        <button class="btn-add">+ Thêm sản phẩm</button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Thương hiệu</th>
              <th>Loại đế</th>
              <th>Danh mục</th>
              <th>Chất liệu</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product.id">
              <td>{{ index + 1 }}</td>
              <td>{{ product.code }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.brand }}</td>
              <td>{{ product.sole }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.material }}</td>
              <td>{{ product.quantity }}</td>
              <td><span class="status active">Hoạt động</span></td>
              <td class="action-cell">
                <button class="action-btn edit">✏️</button>
                <button class="action-btn view">🔍</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [
        {
          id: 1,
          code: "SP005",
          name: "Vans Old Skool",
          brand: "Vans",
          sole: "Đế cao su",
          category: "Giày sneaker",
          material: "Vải canvas",
          quantity: 4,
        },
        {
          id: 2,
          code: "SP006",
          name: "Nike Air Max",
          brand: "Nike",
          sole: "Đế khí",
          category: "Giày thể thao",
          material: "Vải mesh",
          quantity: 3,
        },
        {
          id: 3,
          code: "SP007",
          name: "Adidas Superstar",
          brand: "Adidas",
          sole: "Đế cao su",
          category: "Giày casual",
          material: "Da tổng hợp",
          quantity: 5,
        },
      ],
    };
  },
};
</script>

<style>
/* CSS đã được di chuyển đến src/scss/pages/san-pham.scss */
</style>
