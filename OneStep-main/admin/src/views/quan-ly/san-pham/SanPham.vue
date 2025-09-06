<template>
  <div class="container">
    <!-- Bộ lọc -->
    <div class="filter-section">
      <h2>🔍 Bộ lọc tìm kiếm</h2>
      <div class="filter-grid">
        <input v-model="search" type="text" placeholder=" Tên sản phẩm" />
        <button class="btn-reset" @click="resetFilter"> Đặt lại</button>
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
              <th>STT</th>
              <th>Tên SP</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in filteredProducts" :key="product.maSanPham">
              <td>{{ index + 1 }}</td>
              <td>{{ product.tenSanPham }}</td>
              <td>{{ product.moTa }}</td>
              <td>
                <img :src="product.duongDanAnh" alt="Ảnh SP" style="width:40px;height:40px;" v-if="product.duongDanAnh"/>
              </td>
              <td>
                <span :class="['status', product.trangThai === 1 ? 'active' : 'inactive']">
                  {{ product.trangThai === 1 ? 'Còn hàng' : 'Hết hàng' }}
                </span>
              </td>
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
<script src="./SanPham.js"></script>