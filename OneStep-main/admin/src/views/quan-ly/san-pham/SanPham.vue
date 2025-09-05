<template>
  <div class="container">
    <!-- Bộ lọc -->
    <div class="filter-section">
      <h2>🔍 Bộ lọc tìm kiếm</h2>
      <div class="filter-grid">
        <input v-model="search" type="text" placeholder=" Mã / Tên sản phẩm" />
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
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Mã Code</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Trạng thái</th>
              <th>Ngày cập nhật</th>
              <th>Người tạo</th>
              <th>Người cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in filteredProducts" :key="product.maSanPham">
              <td>{{ index + 1 }}</td>
              <td>{{ product.maSanPham }}</td>
              <td>{{ product.tenSanPham }}</td>
              <td>{{ product.maCode }}</td>
              <td>{{ product.moTa }}</td>
              <td>
                <img :src="product.duongDanAnh" alt="Ảnh SP" style="width:40px;height:40px;" v-if="product.duongDanAnh"/>
              </td>
              <td>
  <span :class="['status', product.trangThai === 1 ? 'active' : 'inactive']">
    {{ product.trangThai === 1 ? 'Hoạt động' : 'Ngừng hoạt động' }}
  </span>
</td>
              
              <td>{{ product.ngayCapNhat }}</td>
              <td>{{ product.nguoiTao }}</td>
              <td>{{ product.nguoiCapNhat }}</td>
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