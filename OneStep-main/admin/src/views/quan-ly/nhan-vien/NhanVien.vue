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
        <button @click="resetFilter">Đặt lại bộ lọc</button>
      </div>
    </section>
    <section class="employee-list-section">
      <div class="list-header">
        <span>Danh sách nhân viên</span>
        <button class="add-btn" @click="openAddModal">Thêm mới nhân viên</button>
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
              <button @click="openEditModal(emp)">✏️</button>
              <button @click="deleteEmployee(emp)">🗑</button>
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
            <button type="submit">Lưu</button>
            <button type="button" @click="closeModal">Hủy</button>
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

<style>
/* CSS đã được di chuyển đến src/scss/pages/nhan-vien.scss */
</style>
