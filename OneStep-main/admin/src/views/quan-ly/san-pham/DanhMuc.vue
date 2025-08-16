<template>
  <div class="page-container">
    <!-- Tiêu đề -->
    <div class="page-header">
      <h2 class="page-title">📁 Quản Lý Danh Mục</h2>
      <p class="page-subtitle">Thêm, chỉnh sửa và tìm kiếm các danh mục sản phẩm</p>
    </div>

    <!-- Bộ lọc -->
    <div class="filter-section">
      <h3 class="section-title">🔍 Bộ lọc</h3>
      <div class="filter-fields">
        <input type="text" v-model="search" placeholder="🔎 Tìm theo tên hoặc mã" />
        <select v-model="status">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Ngừng</option>
        </select>
        <button @click="resetFilters" class="reset-btn">♻️ Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách danh mục -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">📋 Danh sách danh mục</h3>
        <button @click="showModal = true" class="add-btn">➕ Thêm mới</button>
      </div>

      <div class="table-wrapper">
        <table class="material-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã</th>
              <th>Tên danh mục</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredCategories" :key="item.id">
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

    <!-- Modal thêm -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>➕ Thêm Danh Mục</h3>
        <label>Tên danh mục</label>
        <input type="text" v-model="newCategory" placeholder="Nhập tên danh mục" />
        <div class="modal-actions">
          <button @click="addCategory" class="confirm-btn">✔️ Thêm</button>
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
      newCategory: '',
      categories: [
        { id: 1, code: 'DM001', name: 'Giày sneaker', status: 'active' },
        { id: 2, code: 'DM002', name: 'Giày thể thao', status: 'active' },
        { id: 3, code: 'DM003', name: 'Giày lười', status: 'inactive' },
      ],
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(this.search.toLowerCase()) || item.code.toLowerCase().includes(this.search.toLowerCase());
        const matchStatus = this.status === '' || item.status === this.status;
        return matchSearch && matchStatus;
      });
    },
  },
  methods: {
    resetFilters() {
      this.search = '';
      this.status = '';
    },
    addCategory() {
      if (this.newCategory.trim()) {
        const newCode = `DM00${this.categories.length + 1}`;
        this.categories.push({
          id: this.categories.length + 1,
          code: newCode,
          name: this.newCategory.trim(),
          status: 'active',
        });
        this.newCategory = '';
        this.showModal = false;
      }
    },
  },
};
</script>

<style>
/* CSS đã được di chuyển sang file src/scss/pages/danh-muc.scss */
</style>
