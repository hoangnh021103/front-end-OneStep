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

<style scoped>
/* Toàn cục */
.container {
  padding: 24px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9fafe;
  color: #333;
}

/* Bộ lọc */
.filter-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 30px;
}
.filter-section h2 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #2c3e50;
}
.filter-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.filter-grid input,
.filter-grid select {
  padding: 10px 14px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  background-color: #fff;
  font-size: 14px;
  min-width: 180px;
  transition: border 0.2s ease;
}
.filter-grid input:focus,
.filter-grid select:focus {
  outline: none;
  border-color: #3498db;
}
.btn-reset {
  padding: 10px 16px;
  background-color: #e67e22;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}
.btn-reset:hover {
  background-color: #cf711c;
}

/* Danh sách sản phẩm */
.product-section .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.product-section h2 {
  font-size: 20px;
  color: #2c3e50;
}
.btn-add {
  padding: 10px 18px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}
.btn-add:hover {
  background-color: #27ae60;
}

/* Bảng sản phẩm */
.table-wrapper {
  overflow-x: auto;
  background-color: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}
thead {
  background-color: #f1f3f5;
}
th,
td {
  padding: 12px 14px;
  text-align: center;
  border-bottom: 1px solid #e1e8ed;
}
th {
  font-weight: 600;
  color: #555;
}
td {
  font-size: 14px;
}
.status.active {
  color: #27ae60;
  font-weight: bold;
}
.action-cell {
  display: flex;
  justify-content: center;
  gap: 6px;
}
.action-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
.action-btn.edit {
  background-color: #2980b9;
}
.action-btn.view {
  background-color: #8e44ad;
}
.action-btn:hover {
  opacity: 0.85;
}
</style>
