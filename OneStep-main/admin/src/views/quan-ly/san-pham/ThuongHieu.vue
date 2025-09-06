<template>
  <div class="thuong-hieu">
    <h2>Quản lý Thương Hiệu</h2>
    <div class="filter-section">
      <h3>🔍 Bộ lọc</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="🔎 Tìm theo tên thương hiệu" />
        <select v-model="status">
          <option value="">Tất cả trạng thái</option>
          <option :value="1">Hoạt động</option>
          <option :value="0">Ngừng hoạt động</option>
        </select>
        <button @click="resetFilters" class="reset-btn">♻️ Đặt lại</button>
      </div>
    </div>
    <div class="list-section">
      <div class="list-header">
        <h3>📋 Danh sách thương hiệu</h3>
        <button @click="openModal" class="add-btn">➕ Thêm mới</button>
      </div>
    </div>
    <div class="brand-table-wrapper">
      <table class="brand-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Logo</th>
            <th>Tên thương hiệu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(brand, index) in filteredBrands" :key="brand.id">
            <td>{{ index + 1 }}</td>
            <td>
              <img :src="brand.hinhAnh" :alt="brand.ten" class="brand-logo" v-if="brand.hinhAnh"/>
              <span v-else class="no-logo">Không có ảnh</span>
            </td>
            <td>{{ brand.ten }}</td>
            <td>
              <span :class="['status-tag', brand.trangThai === 1 ? 'active' : 'inactive']">
                {{ brand.trangThai === 1 ? 'Hoạt động' : 'Ngừng hoạt động' }}
              </span>
            </td>
            <td>
              <button @click="editBrand(index)" class="action-btn edit">✏️</button>
              <button @click="deleteBrand(index)" class="action-btn delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredBrands.length === 0" class="empty-text">Chưa có thương hiệu nào.</div>
    </div>

    <!-- Modal thêm/sửa -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>{{ editIndex !== null ? 'Sửa thương hiệu' : 'Thêm thương hiệu' }}</h3>
        <label>Tên thương hiệu</label>
        <input type="text" v-model="newBrand.ten" placeholder="Nhập tên thương hiệu" />
        <label>Hình ảnh</label>
        <input type="text" v-model="newBrand.hinhAnh" placeholder="Nhập link ảnh logo" />
        <label>Trạng thái</label>
        <select v-model="newBrand.trangThai">
          <option :value="1">Hoạt động</option>
          <option :value="0">Ngừng hoạt động</option>
        </select>
        <div class="modal-actions">
          <button @click="saveBrand" class="confirm-btn">✔️ Lưu</button>
          <button @click="closeModal" class="cancel-btn">❌ Huỷ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./ThuongHieu.js"></script>

<style>
/* CSS đã được chuyển sang src/scss/pages/thuong-hieu.scss */
</style>
