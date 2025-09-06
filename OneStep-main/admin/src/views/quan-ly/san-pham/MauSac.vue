<template>
  <div class="container">
    <h2>Quản lý màu sắc</h2>

    <!-- Tìm kiếm -->
    <div class="filter-box">
      <label>Tìm kiếm màu sắc:</label>
      <div class="filter-row">
        <input v-model="searchQuery" type="text" placeholder="Nhập tên để tìm..." />
        <button class="button" @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
      </div>
    </div>

    <!-- Danh sách màu sắc + nút thêm mới -->
    <div class="table-container">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <h3 style="margin: 0;">Danh Sách Màu Sắc</h3>
        <button class="button" @click="openModal"><i class="fa fa-plus"></i> Thêm mới màu sắc</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(color, index) in filteredColors" :key="color.id">
            <td>{{ index + 1 }}</td>
            <td>
              <span>{{ color.ten }}</span>
              <span v-if="color.hex" style="margin-left:8px;">
                <div :style="{background: color.hex, width:'18px', height:'18px', borderRadius:'50%', display:'inline-block', border:'1px solid #ccc'}"></div>
              </span>
            </td>
            <td>
              <span :class="['status', color.trangThai === 1 ? 'active' : 'inactive']">
                {{ color.trangThai === 1 ? 'Còn hàng' : 'Hết hàng' }}
              </span>
            </td>
            <td class="actions">
              <button class="action-btn edit" title="Sửa" @click="editColor(index)"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" title="Xóa" @click="deleteColor(index)"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editIndex !== null ? 'Sửa màu sắc' : 'Thêm màu sắc' }}</h3>
        <label>Tên màu sắc *</label>
        <input v-model="newColor.ten" type="text" placeholder="Nhập tên màu sắc" />


        <label>Mã hex *</label>
        <input v-model="newColor.hex" type="text" placeholder="#000000" @input="updatePreview" />
        <div class="color-preview" :style="{ backgroundColor: newColor.hex }"></div>

        <label>Trạng thái</label>
        <select v-model="newColor.trangThai">
          <option :value="1">Còn hàng</option>
          <option :value="0">Hết hàng</option>
        </select>

        <div class="modal-actions">
          <button class="button" @click="saveColor"><i class="fa fa-check"></i> Xác nhận</button>
          <button class="button" @click="closeModal"><i class="fa fa-times"></i> Huỷ</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./MauSac.js"></script>