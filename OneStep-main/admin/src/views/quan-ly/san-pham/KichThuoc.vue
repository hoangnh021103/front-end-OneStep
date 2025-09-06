<template>
  <div class="page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title">📏 Quản Lý Kích Thước</h2>
      <p class="page-subtitle">Tạo, chỉnh sửa và tìm kiếm các kích thước sản phẩm</p>
    </div>

    <!-- Bộ lọc tìm kiếm -->
    <div class="filter-section">
      <h3 class="section-title">🔍 Bộ lọc tìm kiếm</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="🔎 Nhập tên kích thước" />
        <select v-model="status">
          <option value="">📦 Tất cả trạng thái</option>
          <option value="1">✅ Hoạt động</option>
          <option value="0">🚫 Ngừng</option>
        </select>
        <button @click="resetFilters" class="reset-btn">♻️ Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách kích thước -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">📋 Danh sách kích thước</h3>
        <button @click="openModal" class="add-btn">➕ Thêm mới</button>
      </div>

      <div class="table-wrapper">
        <table class="size-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Số size</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredSizes" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.ten }}</td>
              <td>
                <span :class="['status-tag', item.trangThai === 1 ? 'active' : 'inactive']">
                  {{ item.trangThai === 1 ? 'Hoạt động' : 'Ngừng' }}
                </span>
              </td>
              <td>
                <button @click="editSize(index)" class="action-btn edit">✏️</button>
                <button @click="deleteSize(index)" class="action-btn view">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Thêm kích thước -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>{{ editIndex !== null ? '✏️ Chỉnh Sửa Kích Thước' : '➕ Thêm Kích Thước' }}</h3>
        <label for="sizeNameInput">Tên kích thước</label>
        <input id="sizeNameInput" type="text" v-model="newSize.ten" placeholder="Nhập tên kích thước" />
        <div class="modal-actions">
          <button @click="addSize" class="confirm-btn">✔️ {{ editIndex !== null ? 'Cập nhật' : 'Thêm' }}</button>
          <button @click="closeModal" class="cancel-btn">❌ Huỷ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./KichThuoc.js"></script>