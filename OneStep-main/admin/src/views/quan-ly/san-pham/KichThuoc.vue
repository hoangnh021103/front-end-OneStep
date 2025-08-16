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
        <input type="text" v-model="search" placeholder="🔎 Nhập mã hoặc tên kích thước" />
        <select v-model="status">
          <option value="">📦 Tất cả trạng thái</option>
          <option value="active">✅ Hoạt động</option>
          <option value="inactive">🚫 Ngừng</option>
        </select>
        <button @click="resetFilters" class="reset-btn">♻️ Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách kích thước -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">📋 Danh sách kích thước</h3>
        <button @click="showModal = true" class="add-btn">➕ Thêm mới</button>
      </div>

      <div class="table-wrapper">
        <table class="size-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã</th>
              <th>Tên size</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredSizes" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.code }}</td>
              <td>{{ item.name }}</td>
              <td>
                <span :class="['status-tag', item.status === 'active' ? 'active' : 'inactive']">
                  {{ item.status === 'active' ? 'Hoạt động' : 'Ngừng' }}
                </span>
              </td>
              <td>
                <button class="action-btn edit">✏️</button>
                <button class="action-btn view">🔍</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Thêm kích thước -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>➕ Thêm Kích Thước</h3>
        <label for="sizeInput">Tên kích thước</label>
        <input id="sizeInput" type="text" v-model="newSize" placeholder="Nhập kích thước mới" />
        <div class="modal-actions">
          <button @click="addSize" class="confirm-btn">✔️ Xác nhận</button>
          <button @click="showModal = false" class="cancel-btn">❌ Huỷ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      status: '',
      showModal: false,
      newSize: '',
      sizes: [
        { id: 1, code: 'SIZE_6945', name: '45', status: 'active' },
        { id: 2, code: 'KC005', name: '43', status: 'active' },
        { id: 3, code: 'KC004', name: '42', status: 'active' },
        { id: 4, code: 'KC003', name: '41', status: 'inactive' },
      ],
    };
  },
  computed: {
    filteredSizes() {
      return this.sizes.filter(item => {
        const matchesSearch =
          item.name.toLowerCase().includes(this.search.toLowerCase()) ||
          item.code.toLowerCase().includes(this.search.toLowerCase());
        const matchesStatus = this.status === '' || item.status === this.status;
        return matchesSearch && matchesStatus;
      });
    },
  },
  methods: {
    resetFilters() {
      this.search = '';
      this.status = '';
    },
    addSize() {
      if (this.newSize.trim()) {
        const newCode = `KC00${this.sizes.length + 1}`;
        this.sizes.push({
          id: this.sizes.length + 1,
          code: newCode,
          name: this.newSize.trim(),
          status: 'active',
        });
        this.newSize = '';
        this.showModal = false;
      }
    },
  },
};
</script>

<style>
/* CSS đã được di chuyển đến src/scss/pages/kich-thuoc.scss */
</style>
