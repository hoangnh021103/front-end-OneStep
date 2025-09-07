<template>
  <div class="page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title">Quản Lý Chất Liệu</h2>
      <p class="page-subtitle">Thêm, tìm kiếm và quản lý các chất liệu sản phẩm</p>
    </div>

    <!-- Bộ lọc -->
    <div class="filter-section">
      <h3 class="section-title">Bộ lọc tìm kiếm</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="Nhập tên chất liệu" />
        <select v-model="status">
          <option value="">Tất cả trạng thái</option>
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>
        <button @click="resetFilters" class="reset-btn">
          <i class="fa fa-undo"></i> Đặt lại
        </button>
      </div>
    </div>

    <!-- Danh sách chất liệu -->
    <div class="list-section">
      <div
        class="list-header"
        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;"
      >
        <h3 class="section-title" style="margin: 0;">Danh Sách Chất Liệu</h3>
        <button @click="openModal" class="add-btn">
          <i class="fa fa-plus"></i> Thêm mới
        </button>
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
                  {{ item.trangThai === 1 ? "Còn hàng" : "Hết hàng" }}
                </span>
              </td>
              <td>
                <button
                  class="action-btn edit"
                  title="Sửa"
                  @click="editMaterial(index)"
                >
                  <i class="fa fa-edit"></i>
                </button>
                <button
                  class="action-btn delete"
                  title="Xóa"
                  @click="deleteMaterial(index)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>{{ editIndex === null ? "Thêm Chất Liệu" : "Cập Nhật Chất Liệu" }}</h3>
        <label>Tên chất liệu</label>
        <input type="text" v-model="newMaterial.ten" placeholder="Nhập chất liệu" />
        <label>Trạng thái</label>
        <select v-model="newMaterial.trangThai">
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>
        <div class="modal-actions">
          <button @click="addMaterial" class="confirm-btn">
            <i class="fa fa-check"></i> Xác nhận
          </button>
          <button @click="closeModal" class="cancel-btn">
            <i class="fa fa-times"></i> Huỷ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./ChatLieu.js"></script>
