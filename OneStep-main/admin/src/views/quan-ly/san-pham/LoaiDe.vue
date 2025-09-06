<template>
  <div class="page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title">🥿 Quản Lý Loại Đế</h2>
      <p class="page-subtitle">Thêm, chỉnh sửa và tìm kiếm các loại đế giày</p>
    </div>

    <!-- Bộ lọc -->
    <div class="filter-section">
      <h3 class="section-title">🔍 Bộ lọc</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="🔎 Tìm theo tên" />
        <select v-model="status">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Ngừng</option>
        </select>
        <button @click="resetFilters" class="reset-btn">♻️ Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách loại đế -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">📋 Danh sách loại đế</h3>
        <button @click="showModal = true" class="add-btn">➕ Thêm mới</button>
      </div>

      <div class="table-wrapper">
        <table class="material-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên loại đế</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredSoles" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.ten }}</td>
              <td>
                <span :class="['status-tag', item.trangThai === 1 ? 'active' : 'inactive']">
                  {{ item.trangThai === 1 ? 'Hoạt động' : 'Ngừng' }}
                </span>
              </td>
              <td>
                <button @click="editSole(index)" class="action-btn edit">✏️</button>
                <button @click="deleteSole(index)" class="action-btn view">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal thêm -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>➕ Thêm Loại Đế</h3>
        <label>Tên loại đế</label>
        <input type="text" v-model="newSole.ten" placeholder="Nhập tên loại đế" />
        <div class="modal-actions">
          <button @click="saveSole" class="confirm-btn">✔️ Thêm</button>
          <button @click="showModal = false" class="cancel-btn">❌ Huỷ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./LoaiDe.js"></script>