<template>
  <div class="employee-manager">
    <header>
      <h2>Quản lý nhân viên</h2>
      
    </header>
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Tìm kiếm mã / tên nhân viên..." />
        <select v-model="status">
          <option value="">Chọn trạng thái</option>
          <option value="active">Đang làm việc</option>
          <option value="inactive">Nghỉ việc</option>
        </select>
        <button @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
      </div>
    </section>
    <section class="employee-list-section">
      <div class="list-header">
        <span>Danh sách nhân viên</span>
        <button class="add-btn" @click="openAddModal"><i class="fa fa-plus"></i> Thêm mới nhân viên</button>
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
          <tr v-if="pagedEmployees.length === 0">
            <td colspan="8" class="no-data">
              <div class="empty-state">
                <div class="empty-icon"><i class="fa fa-users"></i></div>
                <div class="empty-text">Chưa có nhân viên nào</div>
                <div class="empty-subtext">Nhấn "Thêm mới nhân viên" để bắt đầu</div>
              </div>
            </td>
          </tr>
          <tr v-for="(emp, idx) in pagedEmployees" :key="emp.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
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
              <button class="action-btn edit" title="Sửa" @click="openEditModal(emp)"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" title="Xóa" @click="deleteEmployee(emp)"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-center">
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="changePage(currentPage-1)">‹</button>
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="{active: currentPage === page}"
            @click="changePage(page)"
          >{{ page }}</button>
          <button :disabled="currentPage === totalPages" @click="changePage(currentPage+1)">›</button>
          <select v-model.number="pageSize">
            <option v-for="size in [5,10,20]" :key="size" :value="size">{{size}} / page</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Modal Thêm/Sửa -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ editEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên' }}</h3>
        <form @submit.prevent="saveEmployee">
          <input v-model="modalData.code" placeholder="Mã nhân viên" required />
          <input v-model="modalData.name" placeholder="Tên nhân viên" required />
          <input v-model="modalData.email" placeholder="Email" required />
          <input v-model="modalData.phone" placeholder="Số điện thoại" required />
          <input v-model="modalData.joinDate" placeholder="Ngày tham gia" required />
          <select v-model="modalData.status">
            <option value="active">Đang làm việc</option>
            <option value="inactive">Nghỉ việc</option>
          </select>
          <div class="modal-actions">
            <button type="submit"><i class="fa fa-check"></i> Lưu</button>
            <button type="button" @click="closeModal"><i class="fa fa-times"></i> Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeManager',
  data() {
    return {
      search: '',
      status: '',
      showModal: false,
      editEmployee: null,
      modalData: {
        code: '',
        name: '',
        email: '',
        phone: '',
        joinDate: '',
        status: 'active'
      },
      currentPage: 1,
      pageSize: 5,
      employees: []
    }
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter(emp => {
        const matchSearch = this.search === '' || emp.name.toLowerCase().includes(this.search.toLowerCase()) || emp.code.toLowerCase().includes(this.search.toLowerCase());
        const matchStatus = this.status === '' || emp.status === this.status;
        return matchSearch && matchStatus;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.pageSize) || 1;
    },
    pagedEmployees() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredEmployees.slice(start, start + this.pageSize);
    },
    visiblePages() {
      let pages = [];
      let start = Math.max(1, this.currentPage - 1);
      let end = Math.min(this.totalPages, start + 1);
      if (end - start < 1) start = Math.max(1, end - 1);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    }
  },
  watch: {
    filteredEmployees() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
    pageSize() {
      this.currentPage = 1;
    }
  },
  methods: {
    resetFilter() {
      this.search = '';
      this.status = '';
    },
    openAddModal() {
      this.editEmployee = null;
      this.modalData = {
        code: '',
        name: '',
        email: '',
        phone: '',
        joinDate: '',
        status: 'active'
      };
      this.showModal = true;
    },
    openEditModal(emp) {
      this.editEmployee = emp;
      this.modalData = { ...emp };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveEmployee() {
      if (this.editEmployee) {
        Object.assign(this.editEmployee, this.modalData);
      } else {
        const newId = this.employees.length ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;
        this.employees.push({ ...this.modalData, id: newId });
      }
      this.closeModal();
    },
    deleteEmployee(emp) {
      if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        this.employees = this.employees.filter(e => e.id !== emp.id);
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
    
  }
}
</script>

<style scoped>
/* Empty state styles */
.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
}
</style>
