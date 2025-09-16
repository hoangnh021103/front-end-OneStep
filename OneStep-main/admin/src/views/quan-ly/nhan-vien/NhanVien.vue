<template>
  <div class="employee-manager">
    <header>
      <h2>Quản lý nhân viên</h2>
    </header>

    <!-- Bộ lọc -->
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Tìm kiếm họ tên, email hoặc số điện thoại..." />
        <select v-model="genderFilter">
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <button @click="resetFilters"><i class="fa fa-undo"></i> Đặt lại</button>
      </div>
    </section>

    <!-- Danh sách -->
    <section class="employee-list-section">
      <div class="list-header">
        <span>{{ filteredEmployees.length }} nhân viên</span>
        <button class="add-btn" @click="openAddModal"><i class="fa fa-plus"></i> Thêm nhân viên</button>
      </div>

      <table class="employee-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Giới tính</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(emp, idx) in pagedEmployees" :key="emp.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>{{ emp.hoTen }}</td>
            <td>{{ emp.email }}</td>
            <td>{{ emp.soDienThoai }}</td>
            <td>{{ emp.gioiTinh }}</td>
            <td>{{ getRoleName(emp.vaiTro) }}</td>
            <td>{{ formatDate(emp.ngayTao) }}</td>
            <td>
              <button class="action-btn edit" @click="editEmployee(idx)" title="Sửa"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" @click="deleteEmployee(emp.id)" title="Xóa"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
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

    <!-- Modal thêm/sửa -->
   <div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <!-- Header -->
    <div class="modal-header">
      <h2>{{ editIndex !== null ? 'Sửa nhân viên' : 'Thêm nhân viên' }}</h2>
      <button class="btn-back" @click="closeModal">
        <i class="fa fa-arrow-left"></i> Quay lại
      </button>
    </div>

    <!-- Body -->
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group">
          <label>Họ tên *</label>
          <input
            v-model="newEmployee.hoTen"
            type="text"
            placeholder="Nhập họ tên"
            :class="{error: errors.hoTen}"
          />
          <span v-if="errors.hoTen" class="error-message">{{ errors.hoTen }}</span>
        </div>

        <div class="form-group">
          <label>Email *</label>
          <input
            v-model="newEmployee.email"
            type="email"
            placeholder="Nhập email"
            :class="{error: errors.email}"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>Số điện thoại *</label>
          <input
            v-model="newEmployee.soDienThoai"
            type="text"
            placeholder="Nhập số điện thoại"
            :class="{error: errors.soDienThoai}"
          />
          <span v-if="errors.soDienThoai" class="error-message">{{ errors.soDienThoai }}</span>
        </div>

        <div class="form-group">
          <label>Giới tính</label>
          <select v-model="newEmployee.gioiTinh">
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>

        <div class="form-group">
          <label>Vai trò *</label>
          <select v-model="newEmployee.vaiTroId" :class="{error: errors.vaiTro}">
            <option value="">Chọn vai trò</option>
            <option v-for="role in roleList" :key="role.id" :value="role.id">{{ role.tenVaiTro }}</option>
          </select>
          <span v-if="errors.vaiTro" class="error-message">{{ errors.vaiTro }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="modal-actions">
      <button class="btn-primary" @click="saveEmployee" :disabled="isSubmitting">
        <i class="fa fa-check"></i> {{ isSubmitting ? 'Đang lưu...' : 'Lưu' }}
      </button>
      <button class="btn-secondary" @click="closeModal" :disabled="isSubmitting">
        <i class="fa fa-times"></i> Hủy
      </button>
    </div>
  </div>
</div>

  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  data() {
    return {
      employees: [],
      roleList: [],
      search: "",
      genderFilter: "",
      showModal: false,
      editIndex: null,
      isSubmitting: false,
      newEmployee: {
        id: 0,
        hoTen: "",
        email: "",
        soDienThoai: "",
        gioiTinh: "",
        vaiTroId: null,
        vaiTro: null,
        ngayTao: ""
      },
      errors: { hoTen: "", email: "", soDienThoai: "", vaiTro: "" },
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredEmployees() {
      const kw = this.search.toLowerCase();
      return this.employees.filter(e =>
        ((e.hoTen && e.hoTen.toLowerCase().includes(kw)) ||
         (e.email && e.email.toLowerCase().includes(kw)) ||
         (e.soDienThoai && String(e.soDienThoai).includes(kw))) &&
        (!this.genderFilter || e.gioiTinh === this.genderFilter)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.pageSize) || 1;
    },
    pagedEmployees() {
      const start = (this.currentPage-1) * this.pageSize;
      return this.filteredEmployees.slice(start, start + this.pageSize);
    },
    visiblePages() {
      let start = Math.max(1, this.currentPage-2);
      let end = Math.min(this.totalPages, start+4);
      if (end - start < 4) start = Math.max(1, end-4);
      return Array.from({length: end-start+1}, (_,i)=> start+i);
    }
  },
  methods: {
    async fetchEmployees() {
      try {
        const res = await axios.get("http://localhost:8080/nhan-vien/hien-thi");
        this.employees = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch {
        toast.error("Không thể tải danh sách nhân viên.");
      }
    },
    async fetchRoles() {
      try {
        const res = await axios.get("http://localhost:8080/vai-tro/hien-thi");
        this.roleList = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch {
        toast.error("Không thể tải danh sách vai trò.");
      }
    },
    resetFilters() {
      this.search = "";
      this.genderFilter = "";
      this.fetchEmployees();
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    getRoleName(role) {
      return role?.tenVaiTro || "Không xác định";
    },
    validateForm() {
      this.errors = { hoTen: "", email: "", soDienThoai: "", vaiTro: "" };
      let valid = true;
      if (!this.newEmployee.hoTen.trim()) { this.errors.hoTen = "Tên nhân viên là bắt buộc."; valid = false; }
      if (!this.newEmployee.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newEmployee.email)) {
        this.errors.email = "Email không hợp lệ."; valid = false;
      }
      if (!this.newEmployee.soDienThoai.trim()) { this.errors.soDienThoai = "SĐT là bắt buộc."; valid = false; }
      if (!this.newEmployee.vaiTroId) { this.errors.vaiTro = "Vai trò là bắt buộc."; valid = false; }
      return valid;
    },
    async saveEmployee() {
      if (!this.validateForm()) return;
      try {
        this.isSubmitting = true;
        const selectedRole = this.roleList.find(r => r.id == this.newEmployee.vaiTroId);
        const dataToSend = { ...this.newEmployee, vaiTro: selectedRole };

        if (this.editIndex !== null) {
          await axios.put(`http://localhost:8080/nhan-vien/update/${this.newEmployee.id}`, dataToSend);
          this.employees[this.editIndex] = { ...dataToSend };
          toast.success("Cập nhật nhân viên thành công!");
        } else {
          const res = await axios.post("http://localhost:8080/nhan-vien/add", dataToSend);
          this.employees.push(res.data);
          toast.success("Thêm nhân viên thành công!");
        }
        this.closeModal();
      } catch {
        toast.error("Lỗi khi lưu nhân viên!");
      } finally { this.isSubmitting = false; }
    },
    editEmployee(index) {
      this.editIndex = index;
      const emp = this.employees[index];
      this.newEmployee = {
        ...emp,
        vaiTroId: emp.vaiTro?.id || null
      };
      this.showModal = true;
    },
    openAddModal() {
      this.editIndex = null;
      this.newEmployee = { id:0, hoTen:"", email:"", soDienThoai:"", gioiTinh:"", vaiTroId:null, vaiTro:null, ngayTao:"" };
      this.showModal = true;
    },
    async deleteEmployee(id) {
      if (confirm("Bạn chắc chắn muốn xóa nhân viên này?")) {
        try {
          await axios.delete(`http://localhost:8080/nhan-vien/delete/${id}`);
          this.employees = this.employees.filter(e=> e.id !== id);
          toast.success("Xóa nhân viên thành công!");
        } catch {
          toast.error("Lỗi khi xóa nhân viên!");
        }
      }
    },
    closeModal() {
      this.showModal = false;
      this.errors = { hoTen: "", email: "", soDienThoai: "", vaiTro: "" };
    },
    changePage(p) { if (p>=1 && p<=this.totalPages) this.currentPage = p; }
  },
  mounted() {
    this.fetchEmployees();
    this.fetchRoles();
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; padding: 40px 20px;
}
.form-card {
  background: #fff; border-radius: 12px; padding: 32px; max-width: 650px; width: 100%;
}
.form-grid {
  display: grid; grid-template-columns: repeat(2,1fr); gap: 24px;
}
.form-group { display: flex; flex-direction: column; }
.form-group label { font-weight: 600; margin-bottom: 6px; }
.form-group input, .form-group select {
  padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px;
}
.error { border-color: #e63946 !important; }
.error-message { color: #e63946; font-size: 13px; margin-top: 4px; }
.actions { margin-top: 24px; display: flex; justify-content: flex-end; gap: 12px; }
.btn-primary { background: #4f46e5; color: #fff; padding: 10px 20px; border-radius: 6px; }
.btn-secondary { background: #f3f4f6; border: 1px solid #d1d5db; padding: 10px 20px; border-radius: 6px; }
</style>
