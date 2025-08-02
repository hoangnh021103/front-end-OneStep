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

<style scoped>
.page-container {
  padding: 24px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f4f6f8;
  color: #333;
}

.page-header {
  margin-bottom: 20px;
}
.page-title {
  font-size: 24px;
  font-weight: bold;
}
.page-subtitle {
  font-size: 14px;
  color: #666;
}

/* Section Titles */
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

/* Filter Section */
.filter-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
}
.filter-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.filter-fields input,
.filter-fields select {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 220px;
  font-size: 14px;
}
.reset-btn {
  background-color: #e67e22;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.reset-btn:hover {
  background-color: #cf711c;
}

/* List Section */
.list-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.add-btn {
  background-color: #3498db;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}
.add-btn:hover {
  background-color: #2980b9;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}
.size-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.size-table th,
.size-table td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: center;
}
.size-table th {
  background-color: #f0f2f5;
  font-weight: 600;
  color: #555;
}

/* Status Tags */
.status-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}
.status-tag.active {
  background-color: #d4edda;
  color: #2e7d32;
}
.status-tag.inactive {
  background-color: #f8d7da;
  color: #c0392b;
}

/* Action Buttons */
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 4px;
}
.action-btn.edit {
  color: #3498db;
}
.action-btn.view {
  color: #8e44ad;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 350px;
}
.modal h3 {
  margin-bottom: 12px;
}
.modal input {
  width: 100%;
  padding: 10px;
  margin: 12px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.confirm-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
.cancel-btn {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
