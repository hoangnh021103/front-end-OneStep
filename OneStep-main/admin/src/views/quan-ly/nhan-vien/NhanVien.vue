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
          <option value="Khác">Khác</option>
        </select>
        <button @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
      </div>
    </section>

    <!-- Danh sách -->
    <section class="employee-list-section">
      <div class="list-header">
        <span>Danh sách nhân viên</span>
        <button class="add-btn" @click="openAddModal"><i class="fa fa-plus"></i> Thêm mới nhân viên</button>
      </div>

      <table class="employee-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="employees.length === 0">
            <td colspan="11" class="no-data">
              <div class="empty-state">
                <div class="empty-icon"><i class="fa fa-users"></i></div>
                <div class="empty-text">Chưa có nhân viên nào</div>
                <div class="empty-subtext">Nhấn "Thêm mới nhân viên" để bắt đầu</div>
              </div>
            </td>
          </tr>
          <tr v-for="(emp, idx) in pagedEmployees" :key="emp.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>{{ emp.hoTen }}</td>
            <td>{{ formatDate(emp.ngaySinh) }}</td>
            <td>{{ emp.gioiTinh }}</td>
            <td>{{ emp.email }}</td>
            <td>{{ emp.soDienThoai }}</td>
            <td>{{ emp.diaChi }}</td>
            <td>{{ getRoleName(emp.vaiTroId) }}</td>
            <td>{{ formatDate(emp.ngayTao) }}</td>
            <td>{{ formatDate(emp.ngayCapNhat) }}</td>
            <td class="actions">
              <button class="action-btn edit" title="Sửa" @click="openEditModal(emp)"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" title="Xóa" @click="deleteEmployee(emp.id)"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Phân trang -->
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
          <input v-model="modalData.hoTen" placeholder="Họ và tên" required />
          <input v-model="modalData.ngaySinh" type="date" placeholder="Ngày sinh" />
          <select v-model="modalData.gioiTinh">
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <input v-model="modalData.email" type="email" placeholder="Email" required />
          <input v-model="modalData.soDienThoai" placeholder="Số điện thoại" required />
          <input v-model="modalData.diaChi" placeholder="Địa chỉ" />

          <!-- Vai trò -->
          <select v-model="modalData.vaiTroId" required>
            <option :value="0">-- Chọn vai trò --</option>
            <option v-for="role in roleList" :key="role.id" :value="role.id">
              {{ role.tenVaiTro }}
            </option>
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
import axios from "axios";
import { toast } from 'vue3-toastify';

export default {
  data() {
    return {
      employees: [],
      roleList: [],   // 🆕 Danh sách vai trò
      search: "",
      genderFilter: "",
      showModal: false,
      editEmployee: null,
      modalData: {
        id: 0,
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        vaiTroId: 0,
        ngayTao: "",
        ngayCapNhat: ""
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    filteredEmployees() {
      const keyword = this.search.toLowerCase();
      return this.employees.filter(
        emp =>
          ((emp.hoTen && emp.hoTen.toLowerCase().includes(keyword)) ||
            (emp.email && emp.email.toLowerCase().includes(keyword)) ||
            (emp.soDienThoai && emp.soDienThoai.includes(keyword))) &&
          (this.genderFilter === "" || emp.gioiTinh === this.genderFilter)
      );
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
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + 4);
      if (end - start < 4) start = Math.max(1, end - 4);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    }
  },
  methods: {
    async fetchEmployees() {
      try {
        const res = await axios.get("http://localhost:8080/nhan-vien/hien-thi");
        this.employees = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error("Lỗi khi tải nhân viên:", err);
        toast.error("Không thể tải danh sách nhân viên.");
        this.employees = [];
      }
    },
    async fetchRoles() {
      try {
        const res = await axios.get("http://localhost:8080/vai-tro/hien-thi");
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        this.roleList = list.map(r => ({
          id: r.id || r.maVaiTro,
          tenVaiTro: r.tenVaiTro || r.name
        }));
      } catch (err) {
        console.error("Lỗi khi tải vai trò:", err);
        toast.error("Không thể tải danh sách vai trò.");
        this.roleList = [];
      }
    },
    resetFilter() {
      this.search = "";
      this.genderFilter = "";
      this.currentPage = 1;
      this.fetchEmployees();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openAddModal() {
      this.showModal = true;
      this.editEmployee = null;
      this.modalData = {
        id: 0,
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        vaiTroId: 0,
        ngayTao: "",
        ngayCapNhat: ""
      };
    },
    openEditModal(employee) {
      this.showModal = true;
      this.editEmployee = employee;
      this.modalData = { ...employee };
    },
    closeModal() {
      this.showModal = false;
      this.editEmployee = null;
    },
    async saveEmployee() {
      if (!this.modalData.hoTen || !this.modalData.email || !this.modalData.soDienThoai || !this.modalData.vaiTroId) {
        toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc.");
        return;
      }
      try {
        this.modalData.ngayCapNhat = new Date().toISOString().split('T')[0];
        if (this.editEmployee) {
          const res = await axios.put(
            `http://localhost:8080/nhan-vien/update/${this.modalData.id}`,
            this.modalData
          );
          const index = this.employees.findIndex(emp => emp.id === this.modalData.id);
          if (index !== -1) this.employees.splice(index, 1, res.data || this.modalData);
          toast.success("Cập nhật nhân viên thành công!");
        } else {
          const res = await axios.post("http://localhost:8080/nhan-vien/add", this.modalData);
          this.employees.push(res.data || this.modalData);
          toast.success("Thêm nhân viên thành công!");
        }
        this.closeModal();
      } catch (err) {
        console.error("Lỗi khi lưu nhân viên:", err);
        toast.error("Không thể lưu nhân viên.");
      }
    },
    async deleteEmployee(id) {
      const employee = this.employees.find(emp => emp.id === id);
      if (!employee) return;
      if (confirm(`Xác nhận xoá nhân viên "${employee.hoTen}"?`)) {
        try {
          await axios.delete(`http://localhost:8080/nhan-vien/delete/${id}`);
          const index = this.employees.findIndex(emp => emp.id === id);
          if (index !== -1) this.employees.splice(index, 1);
          toast.success("Xóa nhân viên thành công!");
        } catch (err) {
          console.error("Lỗi khi xóa nhân viên:", err);
          toast.error("Không thể xóa nhân viên.");
        }
      }
    },
    getRoleName(roleId) {
      const role = this.roleList.find(r => r.id === roleId);
      return role ? role.tenVaiTro : "Không xác định";
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
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
  mounted() {
    Promise.all([this.fetchEmployees(), this.fetchRoles()]);
  }
};
</script>
