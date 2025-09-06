<template>
  <div class="page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title">🧵 Quản Lý Chất Liệu</h2>
      <p class="page-subtitle">Thêm, tìm kiếm và quản lý các chất liệu sản phẩm</p>
    </div>

    <!-- Bộ lọc -->
    <div class="filter-section">
      <h3 class="section-title">🔍 Bộ lọc tìm kiếm</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="🔎 Nhập tên chất liệu" />
        <select v-model="status">
          <option value="">📦 Tất cả trạng thái</option>
          <option :value="1">✅ Còn hàng</option>
          <option :value="0">🚫 Hết hàng</option>
        </select>
        <button @click="resetFilters" class="reset-btn">Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách chất liệu -->
    <div class="list-section">
      <div class="list-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 class="section-title" style="margin: 0;">📋 Danh Sách Chất Liệu</h3>
        <button @click="showModal = true" class="add-btn">➕ Thêm mới</button>
      </div>

      <div class="table-wrapper">
       <table>
  <thead>
    <tr>
      <th>STT</th>
      <th>Tên chất liệu</th>
      <th>Trạng thái</th>
      <th>Hành động</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in filteredMaterials" :key="item.id">
      <td>{{ index + 1 }}</td>
      <td>{{ item.ten }}</td>
      <td>
        <span :class="['status-tag', item.trangThai === 1 ? 'active' : 'inactive']">
          {{ item.trangThai === 1 ? 'Còn hàng' : 'Hết hàng' }}
        </span>
      </td>
      <td>
        <button @click="editMaterial(index)">✏️</button>
        <button @click="deleteMaterial(index)">🗑️</button>
      </td>
    </tr>
  </tbody>
</table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>➕ Thêm Chất Liệu</h3>
        <label>Tên chất liệu</label>
        <input type="text" v-model="newMaterial.ten" placeholder="Nhập chất liệu mới" />
        <label>Trạng thái</label>
        <select v-model="newMaterial.trangThai">
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>
        <div class="modal-actions">
          <button @click="addMaterial" class="confirm-btn">✔️ Xác nhận</button>
          <button @click="showModal = false" class="cancel-btn">❌ Huỷ</button>
           </div>
      </div>
    </div>
  </div>
</template>
<script src="./ChatLieu.js"></script>