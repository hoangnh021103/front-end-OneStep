<template>
  <div class="customer-manager">
    <header>
      <h2>Quản lý khách hàng</h2>
    </header>
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Nhập tên để tìm kiếm..." />
        <select v-model="status">
          <option value="">Chọn trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Ngừng</option>
        </select>
        <button @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
      </div>
    </section>
    <section class="customer-list-section">
      <div class="list-header">
        <span>{{ filteredCustomers.length }} khách hàng</span>
        <button class="add-btn" @click="openAddModal"><i class="fa fa-plus"></i> Thêm mới khách hàng</button>
      </div>
      <table class="customer-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên KH</th>
            <th>Trạng thái</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cus, idx) in pagedCustomers" :key="cus.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>{{ cus.hoTen }}</td>
            <td>
              <span :class="['status-badge', cus.trangThai === 1 ? 'active' : 'inactive']">
                {{ cus.trangThai === 1 ? 'Hoạt động' : 'Ngừng' }}
              </span>
            </td>
            <td>{{ formatDate(cus.ngayCapNhat) }}</td>
            <td>
              <button class="action-btn edit" title="Sửa" @click="editCustomer(idx)"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" title="Xóa" @click="deleteCustomer(idx)"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination ở giữa cuối bảng -->
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
   <!-- Modal Thêm/Sửa -->
<div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <h3>{{ editIndex !== null ? 'Sửa khách hàng' : 'Thêm khách hàng' }}</h3>
    <form @submit.prevent="saveCustomer">
      <div class="form-group">
        <label>Họ và tên</label>
        <input v-model="newCustomer.hoTen" placeholder="Họ và tên khách hàng" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="newCustomer.email" type="email" placeholder="Email khách hàng" required />
      </div>
      <div class="form-group">
        <label>Số điện thoại</label>
        <input v-model="newCustomer.soDienThoai" placeholder="Số điện thoại khách hàng" required />
      </div>
      <div class="form-group">
        <label>Ngày sinh</label>
        <input v-model="newCustomer.ngaySinh" type="date" />
      </div>
      <div class="form-group">
        <label>Giới tính</label>
        <select v-model="newCustomer.gioiTinh">
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
      </div>
      <div class="form-group">
        <label>Trạng thái</label>
        <select v-model="newCustomer.trangThai">
          <option :value="1">Hoạt động</option>
          <option :value="0">Ngừng</option>
        </select>
      </div>
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
      customers: [],
      search: "",
      genderFilter: "",
      showModal: false,
      newCustomer: {
        id: 0,
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        soDienThoai: "",
        urlAnh: "",
        ngayTao: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      },
      editIndex: null,
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredCustomers() {
      const keyword = this.search.toLowerCase();
      return this.customers.filter(
        c =>
          ((c.hoTen && c.hoTen.toLowerCase().includes(keyword)) ||
          (c.email && c.email.toLowerCase().includes(keyword)) ||
          (c.soDienThoai && c.soDienThoai.includes(keyword))) &&
          (this.genderFilter === "" || c.gioiTinh === this.genderFilter)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredCustomers.length / this.pageSize) || 1;
    },
    pagedCustomers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredCustomers.slice(start, start + this.pageSize);
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
    async fetchCustomers() {
      try {
        console.log("Đang gọi API khách hàng...");
        const res = await axios.get("http://localhost:8080/khach-hang/hien-thi");
        console.log("Response từ API:", res.data);
        
        // Xử lý dữ liệu từ API
        this.customers = Array.isArray(res.data) ? res.data : res.data.data || [];
        
        console.log("Dữ liệu khách hàng đã load:", this.customers);
        
      } catch (err) {
        console.error("Lỗi khi gọi API khách hàng:", err);
        toast.error("Không thể tải danh sách khách hàng.");
        this.customers = [];
        
        let errorMessage = "Không thể tải dữ liệu khách hàng.";
        
        if (err.code === 'ECONNREFUSED') {
          errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra xem server có đang chạy không.";
        } else if (err.response?.status === 404) {
          errorMessage = "API endpoint không tồn tại. Vui lòng kiểm tra đường dẫn API.";
        } else if (err.response?.status === 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau.";
        }
        
        toast.error(errorMessage);
      }
    },
    resetFilter() {
      this.search = "";
      this.genderFilter = "";
      this.currentPage = 1;
      this.fetchCustomers();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      this.newCustomer = {
        id: 0,
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        soDienThoai: "",
        urlAnh: "",
        ngayTao: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: ""
      };
    },
    closeModal() {
      this.showModal = false;
    },
    async saveCustomer() {
      if (!this.newCustomer.hoTen) {
        toast.error("Vui lòng nhập họ và tên khách hàng.");
        return;
      }
      if (!this.newCustomer.email) {
        toast.error("Vui lòng nhập email khách hàng.");
        return;
      }
      if (!this.newCustomer.soDienThoai) {
        toast.error("Vui lòng nhập số điện thoại khách hàng.");
        return;
      }
      
      try {
        this.newCustomer.ngayCapNhat = new Date().toISOString().split('T')[0];
        
        if (this.editIndex === null) {
          // Thêm mới khách hàng
          const response = await axios.post("http://localhost:8080/khach-hang/add", this.newCustomer);
          this.customers.push(response.data);
          toast.success("Thêm khách hàng thành công!");
        } else {
          // Cập nhật khách hàng
          const response = await axios.put(`http://localhost:8080/khach-hang/update/${this.newCustomer.id}`, this.newCustomer);
          const index = this.customers.findIndex(c => c.id === this.newCustomer.id);
          if (index !== -1) {
            this.customers.splice(index, 1, response.data);
          }
          toast.success("Cập nhật khách hàng thành công!");
        }
        this.closeModal();
      } catch (error) {
        console.error("Lỗi khi lưu khách hàng:", error);
        toast.error("Có lỗi xảy ra khi lưu thông tin khách hàng!");
      }
    },
    editCustomer(idx) {
      const customer = this.pagedCustomers[idx];
      this.editIndex = customer.id;
      this.newCustomer = { ...customer };
      this.showModal = true;
    },
    async deleteCustomer(idx) {
      const customer = this.pagedCustomers[idx];
      if (confirm(`Xác nhận xoá khách hàng "${customer.hoTen || customer.ten}"?`)) {
        try {
          await axios.delete(`http://localhost:8080/khach-hang/delete/${customer.id}`);
          // Xóa khách hàng khỏi mảng local
          const index = this.customers.findIndex(c => c.id === customer.id);
          if (index !== -1) {
            this.customers.splice(index, 1);
          }
          toast.success("Xóa khách hàng thành công!");
        } catch (error) {
          console.error("Lỗi khi xóa khách hàng:", error);
          toast.error("Có lỗi xảy ra khi xóa khách hàng!");
        }
      }
    },
    openAddModal() {
      this.openModal();
    },
    openEditModal(idx) {
      this.editCustomer(idx);
    },
    // Helper method để format ngày tháng
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    }
  },
  watch: {
    filteredCustomers() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
    pageSize() {
      this.currentPage = 1;
    }
  },
  mounted() {
    console.log("Component mounted, fetching customers...");
    this.fetchCustomers();
  }
};
</script>

