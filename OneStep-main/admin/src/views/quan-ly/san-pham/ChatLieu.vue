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
        <input type="text" v-model="search" placeholder="🔎 Nhập tên hoặc mã chất liệu" />
        <select v-model="status">
          <option value="">📦 Tất cả trạng thái</option>
          <option value="active">✅ Hoạt động</option>
          <option value="inactive">🚫 Ngừng</option>
        </select>
        <button @click="resetFilters" class="reset-btn">♻️ Đặt lại</button>
      </div>
    </div>

    <!-- Danh sách chất liệu -->
    <div class="list-section">
      <div class="list-header">
        <h3 class="section-title">📋 Danh sách chất liệu</h3>
        <button @click="showModal = true" class="add-btn">➕ Thêm mới</button>
      </div>

      <div class="table-wrapper">
        <table class="material-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã</th>
              <th>Tên chất liệu</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredMaterials" :key="item.id">
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

    <!-- Modal -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>➕ Thêm Chất Liệu</h3>
        <label>Tên chất liệu</label>
        <input type="text" v-model="newMaterial" placeholder="Nhập chất liệu mới" />
        <div class="modal-actions">
          <button @click="addMaterial" class="confirm-btn">✔️ Xác nhận</button>
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
      newMaterial: '',
      materials: [
        { id: 1, code: 'CL001', name: 'Vải Canvas', status: 'active' },
        { id: 2, code: 'CL002', name: 'Da tổng hợp', status: 'active' },
        { id: 3, code: 'CL003', name: 'Nhựa TPU', status: 'inactive' },
      ],
    };
  },
  computed: {
    filteredMaterials() {
      return this.materials.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(this.search.toLowerCase()) || item.code.toLowerCase().includes(this.search.toLowerCase());
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
    addMaterial() {
      if (this.newMaterial.trim()) {
        const newCode = `CL00${this.materials.length + 1}`;
        this.materials.push({
          id: this.materials.length + 1,
          code: newCode,
          name: this.newMaterial.trim(),
          status: 'active',
        });
        this.newMaterial = '';
        this.showModal = false;
      }
    },
  },
};
</script>

<style>
/* CSS đã được di chuyển sang file src/scss/pages/chat-lieu.scss */
</style>
