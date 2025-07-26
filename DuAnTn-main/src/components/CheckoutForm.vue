<template>
  <div class="employee-manager">
    
    <main class="main-content">
      <header class="main-header">
        <div class="title-block">
          <h2>Quản Lý nhân viên</h2>
          <span class="subtitle">Quản lý nhân viên</span>
        </div>
        <div class="user-info">
          <span>Dường Phúc Hình</span>
          <img class="avatar" src="https://i.pravatar.cc/40" alt="avatar" />
        </div>
      </header>
      <section class="filter-section">
        <div class="filter-row">
          <input v-model="search" placeholder="Tìm kiếm nhân viên" />
          <select v-model="status">
            <option value="">Chọn trạng thái</option>
            <option value="active">Đang làm việc</option>
            <option value="inactive">Nghỉ việc</option>
          </select>
          <button @click="resetFilter">Đặt lại bộ lọc</button>
        </div>
      </section>
      <section class="employee-list-section">
        <div class="list-header">
          <span>Danh sách nhân viên</span>
          <button class="add-btn" @click="showAddModal = true">Thêm mới nhân viên</button>
        </div>
        <table class="employee-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã Nhân Viên</th>
              <th>Tên Nhân viên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày tham gia</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(emp, idx) in filteredEmployees" :key="emp.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ emp.code }}</td>
              <td>{{ emp.name }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.phone }}</td>
              <td>{{ emp.joinDate }}</td>
              <td>
                <span :class="['status-badge', emp.status === 'active' ? 'active' : 'inactive']">
                  {{ emp.status === 'active' ? 'Đang làm việc' : 'Nghỉ việc' }}
                </span>
              </td>
              <td>
                <button @click="editEmployee(emp)">✏️</button>
                <button @click="deleteEmployee(emp)">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <!-- Modal thêm/sửa nhân viên (demo, chưa làm form chi tiết) -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Thêm/Sửa nhân viên</h3>
          <button @click="showAddModal = false">Đóng</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'EmployeeManager',
  data() {
    return {
      search: '',
      status: '',
      showAddModal: false,
      showProductMenu: false,
      employees: [
        { id: 1, code: 'NV005', name: 'Hoàng Văn Em', email: 'em.hv@gmail.com', phone: '0956789012', joinDate: '21/09/2023', status: 'active' },
        { id: 2, code: 'NV004', name: 'Phạm Thị Dung', email: 'dung.pt@gmail.com', phone: '0945678901', joinDate: '21/09/2022', status: 'active' },
        { id: 3, code: 'NV003', name: 'Lê Minh Cường', email: 'cuong.lm@gmail.com', phone: '0934567890', joinDate: '21/09/2022', status: 'active' },
        { id: 4, code: 'NV002', name: 'Trần Thị Bình', email: 'binh.tt@gmail.com', phone: '0923456789', joinDate: '21/09/2021', status: 'inactive' },
        { id: 5, code: 'NV001', name: 'Nguyễn Văn A', email: 'a.nv@gmail.com', phone: '0912345678', joinDate: '21/09/2020', status: 'inactive' },
        { id: 6, code: 'NV006', name: 'Nguyễn Văn B', email: 'b.nv@gmail.com', phone: '0901234567', joinDate: '21/09/2019', status: 'active' },
      ]
    }
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter(emp => {
        const matchSearch = this.search === '' || emp.name.toLowerCase().includes(this.search.toLowerCase()) || emp.code.toLowerCase().includes(this.search.toLowerCase());
        const matchStatus = this.status === '' || (this.status === 'active' ? emp.status === 'active' : emp.status === 'inactive');
        return matchSearch && matchStatus;
      });
    }
  },
  methods: {
    resetFilter() {
      this.search = '';
      this.status = '';
    },
    editEmployee(emp) {
      this.showAddModal = true;
    },
    deleteEmployee(emp) {
      this.employees = this.employees.filter(e => e.id !== emp.id);
    },
    toggleProductMenu() {
      this.showProductMenu = !this.showProductMenu;
    }
  }
}
</script>

<style scoped>
.employee-manager {
  display: flex;
  min-height: 100vh;
  background: #f7f8fa;
}
.sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 24px 0 0 0;
}
.logo {
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 32px;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
}
.sidebar nav ul > li {
  padding: 12px 32px;
  cursor: pointer;
  color: #222;
  font-weight: 500;
  border-left: 4px solid transparent;
  transition: background 0.2s, border 0.2s;
}
.sidebar nav ul > li.active, .sidebar nav ul > li:hover {
  background: #f0f4ff;
  border-left: 4px solid #2563eb;
  color: #2563eb;
}
.sidebar nav ul > li.open > span {
  color: #2563eb;
}
.submenu {
  margin-top: 6px;
  margin-left: 12px;
  font-size: 0.97rem;
  color: #555;
}
.submenu li {
  padding: 4px 0 4px 16px;
}
.main-content {
  flex: 1;
  padding: 0 32px 32px 32px;
}
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0 16px 0;
}
.title-block h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}
.subtitle {
  color: #888;
  font-size: 1.1rem;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
.filter-section {
  background: #fff;
  border-radius: 8px;
  padding: 18px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.filter-row {
  display: flex;
  gap: 18px;
  align-items: center;
}
.filter-row input, .filter-row select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.filter-row button {
  background: #444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  cursor: pointer;
  font-weight: 500;
}
.employee-list-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.add-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #1d4ed8;
}
.employee-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}
.employee-table th, .employee-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #f2f2f2;
  text-align: left;
}
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.98rem;
}
.status-badge.active {
  background: #e6f7e6;
  color: #22c55e;
}
.status-badge.inactive {
  background: #fbeaea;
  color: #e53935;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  min-width: 350px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  text-align: center;
}
</style> 