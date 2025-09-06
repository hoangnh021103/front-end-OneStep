<template>
  <div class="page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title"> Quản Lý Kích Thước</h2>
    </div>

    <!-- Bộ lọc tìm kiếm -->
    <div class="filter-section">
      <h3 class="section-title">Bộ lọc tìm kiếm</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="Nhập tên kích thước" />
        <select v-model="status">
          <option value="">Tất cả trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Ngừng</option>
        </select>
        <button @click="resetFilters" class="reset-btn"><i class="fa fa-undo"></i> Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách kích thước -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">Danh sách kích thước</h3>
        <button @click="openModal" class="add-btn"><i class="fa fa-plus"></i> Thêm mới</button>
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
                <button class="action-btn edit" title="Sửa" @click="editSize(index)"><i class="fa fa-edit"></i></button>
                <button class="action-btn delete" title="Xóa" @click="deleteSize(index)"><i class="fa fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Thêm kích thước -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>{{ editIndex !== null ? 'Chỉnh Sửa Kích Thước' : 'Thêm Kích Thước' }}</h3>
        <label for="sizeNameInput">Tên kích thước</label>
        <input id="sizeNameInput" type="text" v-model="newSize.ten" placeholder="Nhập tên kích thước" />
        <div class="modal-actions">
          <button @click="addSize" class="confirm-btn"><i class="fa fa-check"></i> {{ editIndex !== null ? 'Cập nhật' : 'Thêm' }}</button>
          <button @click="closeModal" class="cancel-btn"><i class="fa fa-times"></i> Huỷ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./KichThuoc.js"></script>