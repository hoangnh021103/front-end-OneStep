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
        <input type="text" v-model="search" placeholder="🔎 Tìm theo tên hoặc mã" />
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
              <th>Mã</th>
              <th>Tên loại đế</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredSoles" :key="item.id">
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
        <h3>➕ Thêm Loại Đế</h3>
        <label>Tên loại đế</label>
        <input type="text" v-model="newSole" placeholder="Nhập tên loại đế" />
        <div class="modal-actions">
          <button @click="addSole" class="confirm-btn">✔️ Thêm</button>
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
      newSole: '',
      soles: [
        { id: 1, code: 'DE001', name: 'Đế cao su', status: 'active' },
        { id: 2, code: 'DE002', name: 'Đế EVA', status: 'active' },
        { id: 3, code: 'DE003', name: 'Đế PU', status: 'inactive' },
      ],
    };
  },
  computed: {
    filteredSoles() {
      return this.soles.filter(item => {
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
    addSole() {
      if (this.newSole.trim()) {
        const newCode = `DE00${this.soles.length + 1}`;
        this.soles.push({
          id: this.soles.length + 1,
          code: newCode,
          name: this.newSole.trim(),
          status: 'active',
        });
        this.newSole = '';
        this.showModal = false;
      }
    },
  },
};
</script>

<style scoped>
/* Được chia sẻ và đồng bộ với các trang quản lý khác */
.page-container {
  padding: 24px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f4f6f8;
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

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* Filter */
.filter-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.filter-fields {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.filter-fields input,
.filter-fields select {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 220px;
}
.reset-btn {
  background-color: #e67e22;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

/* Table */
.list-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
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
}
.table-wrapper {
  overflow-x: auto;
}
.material-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.material-table th,
.material-table td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: center;
}
.material-table th {
  background-color: #f0f2f5;
  font-weight: 600;
}

/* Trạng thái */
.status-tag {
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

/* Nút hành động */
.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  margin: 0 4px;
}
.edit {
  color: #2980b9;
}
.view {
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
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.cancel-btn {
  background-color: #95a5a6;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
