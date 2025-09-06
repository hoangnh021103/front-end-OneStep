<!-- ThuongHieu.vue -->
<template>
  <div class="thuong-hieu page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title">Quản lý Thương Hiệu</h2>
      <p class="page-subtitle">Tạo, chỉnh sửa và quản lý thương hiệu sản phẩm</p>
    </div>

    <!-- Bộ lọc -->
    <div class="filter-section">
      <h3 class="section-title">Bộ lọc tìm kiếm</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="Tìm theo tên thương hiệu" />
        <select v-model="status">
          <option value="">Tất cả trạng thái</option>
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>
        <button @click="resetFilters" class="reset-btn"><i class="fa fa-undo"></i> Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">Danh sách thương hiệu</h3>
        <button @click="openModal" class="add-btn"><i class="fa fa-plus"></i> Thêm mới</button>
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
                  {{ brand.trangThai === 1 ? 'Còn hàng' : 'Hết hàng' }}
                </span>
              </td>
              <td>
                <button class="action-btn edit" title="Sửa" @click="editBrand(index)"><i class="fa fa-edit"></i></button>
                <button class="action-btn delete" title="Xóa" @click="deleteBrand(index)"><i class="fa fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredBrands.length === 0" class="empty-text">Chưa có thương hiệu nào.</div>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>{{ editIndex !== null ? 'Sửa Thương Hiệu' : 'Thêm Thương Hiệu' }}</h3>

        <label for="brandNameInput">Tên thương hiệu *</label>
        <input id="brandNameInput" type="text" v-model="newBrand.ten" placeholder="Nhập tên thương hiệu" />

        <label for="brandImageInput">Hình ảnh</label>
        <input id="brandImageInput" type="text" v-model="newBrand.hinhAnh" placeholder="Nhập link ảnh logo" />

        <label for="brandStatusSelect">Trạng thái</label>
        <select id="brandStatusSelect" v-model="newBrand.trangThai">
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>

        <div class="modal-actions">
          <button @click="saveBrand" class="confirm-btn"><i class="fa fa-check"></i> {{ editIndex !== null ? 'Cập nhật' : 'Thêm' }}</button>
          <button @click="closeModal" class="cancel-btn"><i class="fa fa-times"></i> Huỷ</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./ThuongHieu.js"></script>