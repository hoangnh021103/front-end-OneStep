<template>
  <div class="employee-manager">
    <header>
      <h2>Quản lý nhân viên</h2>
      
    </header>
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
              <button class="action-btn edit" title="Sửa" @click="editColor(index)"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" title="Xóa" @click="deleteColor(index)"><i class="fa fa-trash"></i></button>
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
          <input v-model="modalData.hoTen" placeholder="Họ và tên" required />
          <input v-model="modalData.ngaySinh" type="date" placeholder="Ngày sinh" />
          <select v-model="modalData.gioiTinh">
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          <input v-model="modalData.email" type="email" placeholder="Email" required />
          <input v-model="modalData.soDienThoai" placeholder="Số điện thoại" required />
          
          <input v-model="modalData.diaChi" placeholder="Địa chỉ" />
          <input v-model="modalData.urlAnh" placeholder="URL ảnh (tùy chọn)" />
          <select v-model="modalData.vaiTroId">
            <option value="0">Chọn vai trò</option>
            <option value="1">Quản lý</option>
            <option value="2">Nhân viên</option>
            <option value="3">Thực tập sinh</option>
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
import { nhanVienApi } from '@/api/nhanVienApi';
import { toast } from 'vue3-toastify';

export default {
  data() {
    return {
      employees: [],
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
        urlAnh: "",
        vaiTroId: 0,
        ngayTao: "",
        ngayCapNhat: ""
      },
      currentPage: 1,
      pageSize: 10,
      roles: {
        1: "Quản lý",
        2: "Nhân viên", 
        3: "Thực tập sinh"
      }
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
        console.log("Đang gọi API nhân viên...");
        const data = await nhanVienApi.layDanhSachNhanVien();
        console.log("Response từ API:", data);
        
        // Xử lý dữ liệu từ API
        this.employees = Array.isArray(data) ? data : data.data || [];
        
        console.log("Dữ liệu nhân viên đã load:", this.employees);
        
      } catch (err) {
        console.error("Lỗi khi gọi API nhân viên:", err);
        toast.error("Không thể tải danh sách nhân viên.");
        this.employees = [];
        
        let errorMessage = "Không thể tải dữ liệu nhân viên.";
        
        if (err.code === 'ECONNREFUSED') {
          errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra xem server có đang chạy không.";
        } else if (err.response?.status === 404) {
          errorMessage = "API endpoint không tồn tại. Vui lòng kiểm tra đường dẫn API.";
        } else if (err.response?.status === 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau.";
        }
        
        alert(errorMessage);
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
        urlAnh: "",
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
      // Validation
      if (!this.modalData.hoTen) {
        toast.error("Vui lòng nhập họ và tên nhân viên.");
        return;
      }
      if (!this.modalData.email) {
        toast.error("Vui lòng nhập email nhân viên.");
        return;
      }
      if (!this.modalData.soDienThoai) {
        toast.error("Vui lòng nhập số điện thoại nhân viên.");
        return;
      }
      if (!this.modalData.vaiTroId || this.modalData.vaiTroId === 0) {
        toast.error("Vui lòng chọn vai trò cho nhân viên.");
        return;
      }
      
      try {
        // Cập nhật ngày
        this.modalData.ngayCapNhat = new Date().toISOString().split('T')[0];
        
        if (this.editEmployee) {
          // Cập nhật nhân viên
          const response = await nhanVienApi.capNhatNhanVien(this.modalData.id, this.modalData);
          // Cập nhật mảng local
          const index = this.employees.findIndex(emp => emp.id === this.modalData.id);
          if (index !== -1) {
            this.employees.splice(index, 1, response.data || this.modalData);
          }
          toast.success('Cập nhật nhân viên thành công!');
        } else {
          // Thêm nhân viên mới
          const response = await nhanVienApi.themNhanVien(this.modalData);
          // Thêm vào mảng local
          this.employees.push(response.data || this.modalData);
          toast.success('Thêm nhân viên thành công!');
        }
        this.closeModal();
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Không xác định';
        console.error('Lỗi khi lưu nhân viên:', msg, err);
        toast.error(`Không thể lưu nhân viên: ${msg}`);
      }
    },
    
    async deleteEmployee(id) {
      const employee = this.employees.find(emp => emp.id === id);
      if (!employee) return;
      
      if (confirm(`Xác nhận xoá nhân viên "${employee.hoTen}"?`)) {
        try {
          await nhanVienApi.xoaNhanVien(id);
          // Xóa nhân viên khỏi mảng local
          const index = this.employees.findIndex(emp => emp.id === id);
          if (index !== -1) {
            this.employees.splice(index, 1);
          }
          toast.success('Xóa nhân viên thành công!');
        } catch (err) {
          console.error('Lỗi khi xóa nhân viên:', err);
          toast.error('Không thể xóa nhân viên. Vui lòng thử lại sau.');
        }
      }
    },
    
    getRoleName(roleId) {
      return this.roles[roleId] || "Không xác định";
    },
    
    // Helper method để format ngày tháng
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
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
    console.log("Component mounted, fetching employees...");
    this.fetchEmployees();
  }
};
</script>
