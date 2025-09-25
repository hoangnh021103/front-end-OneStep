<template>
  <div class="customer-manager">
    <header>
      <h2>Quản lý khách hàng</h2>
    </header>

    <!-- Bộ lọc -->
    <section class="filter-section">
      <div class="filter-row">
        <input v-model="search" placeholder="Nhập tên/email/số điện thoại để tìm kiếm..." />
        <button @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
      </div>
    </section>

    <!-- Danh sách -->
    <section class="customer-list-section">
      <div class="list-header">
        <span>{{ filteredCustomers.length }} khách hàng</span>
        <button class="add-btn" @click="openAddModal"><i class="fa fa-plus"></i> Thêm mới khách hàng</button>
      </div>

      <table class="customer-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cus, idx) in pagedCustomers" :key="cus.id">
            <td>{{ (currentPage-1)*pageSize + idx + 1 }}</td>
            <td>{{ cus.hoTen }}</td>
            <td>{{ cus.email }}</td>
            <td>{{ cus.soDienThoai }}</td>
            <td>{{ formatDate(cus.ngaySinh) }}</td>
            <td>{{ cus.gioiTinh }}</td>
            <td>
              <button class="action-btn edit" title="Sửa" @click="editCustomer(idx)"><i class="fa fa-edit"></i></button>
              <button class="action-btn delete" title="Xóa" @click="deleteCustomer(cus.id)"><i class="fa fa-trash"></i></button>
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

    <!-- Modal Thêm/Sửa -->
    <div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <!-- Header -->
    <div class="modal-header">
      <h3>{{ editIndex !== null ? 'Sửa khách hàng' : 'Thêm khách hàng' }}</h3>
      <button class="close-btn" @click="closeModal">
        <i class="fa fa-times"></i> Quay lại
      </button>
    </div>

    <!-- Form -->
    <div class="form-grid">
      <div class="form-group">
        <label>Họ và tên <span class="required">*</span></label>
        <input
          v-model="newCustomer.hoTen"
          type="text"
          placeholder="Nhập họ tên"
          :class="{ error: errors.hoTen }"
        />
        <span v-if="errors.hoTen" class="error-message">{{ errors.hoTen }}</span>
      </div>

      <div class="form-group">
        <label>Email <span class="required">*</span></label>
        <input
          v-model="newCustomer.email"
          type="email"
          placeholder="Nhập email"
          :class="{ error: errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label>Số điện thoại <span class="required">*</span></label>
        <input
          v-model="newCustomer.soDienThoai"
          type="text"
          placeholder="Nhập số điện thoại"
          :class="{ error: errors.soDienThoai }"
        />
        <span v-if="errors.soDienThoai" class="error-message">{{ errors.soDienThoai }}</span>
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
        </select>
      </div>
    </div>

    <!-- Actions -->
    <div class="modal-actions">
      <button class="btn-primary" @click="saveCustomer" :disabled="isSubmitting">
        <i class="fa fa-check"></i>
        {{ isSubmitting ? 'Đang lưu...' : 'Lưu' }}
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
      customers: [],
      search: "",
      showModal: false,
      editIndex: null,
      isSubmitting: false,
      newCustomer: {
        id: 0,
        hoTen: "",
        ngaySinh: "",
        gioiTinh: "",
        email: "",
        soDienThoai: "",
        ngayCapNhat: ""
      },
      errors: {
        hoTen: "",
        email: "",
        soDienThoai: ""
      },
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredCustomers() {
      const keyword = this.search.toLowerCase();
      return this.customers.filter(c =>
        (c.hoTen && c.hoTen.toLowerCase().includes(keyword)) ||
        (c.email && c.email.toLowerCase().includes(keyword)) ||
        (c.soDienThoai && String(c.soDienThoai).includes(keyword))
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
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + 4);
      if (end - start < 4) start = Math.max(1, end - 4);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  },
  methods: {
    async fetchCustomers() {
      try {
        const res = await axios.get("http://localhost:8080/khach-hang/hien-thi");
        this.customers = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        toast.error("Không thể tải dữ liệu khách hàng.");
      }
    },
    resetFilter() {
      this.search = "";
      this.fetchCustomers();
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    validateForm() {
      this.errors = { hoTen: "", email: "", soDienThoai: "" };
      let valid = true;
      if (!this.newCustomer.hoTen.trim()) {
        this.errors.hoTen = "Tên khách hàng là bắt buộc.";
        valid = false;
      }
      if (!this.newCustomer.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newCustomer.email)) {
        this.errors.email = "Email không hợp lệ.";
        valid = false;
      }
      if (!this.newCustomer.soDienThoai.trim()) {
        this.errors.soDienThoai = "Số điện thoại là bắt buộc.";
        valid = false;
      }
      return valid;
    },
    async saveCustomer() {
      if (!this.validateForm()) return;
      try {
        this.isSubmitting = true;
        if (this.editIndex !== null) {
          await axios.put(`http://localhost:8080/khach-hang/update/${this.newCustomer.id}`, this.newCustomer);
          this.customers[this.editIndex] = { ...this.newCustomer };
          toast.success("Cập nhật khách hàng thành công!");
        } else {
          const res = await axios.post("http://localhost:8080/khach-hang/add", this.newCustomer);
          this.customers.push(res.data);
          toast.success("Thêm khách hàng thành công!");
        }
        this.closeModal();
      } catch (err) {
        toast.error("Lỗi khi lưu khách hàng!");
      } finally {
        this.isSubmitting = false;
      }
    },
    editCustomer(index) {
      this.editIndex = index;
      this.newCustomer = { ...this.customers[index] };
      this.showModal = true;
    },
    openAddModal() {
      this.editIndex = null;
      this.newCustomer = {
        id: 0, hoTen: "", ngaySinh: "", gioiTinh: "", email: "", soDienThoai: "", ngayCapNhat: ""
      };
      this.showModal = true;
    },
    async deleteCustomer(id) {
      if (confirm("Xác nhận xóa khách hàng này?")) {
        try {
          await axios.delete(`http://localhost:8080/khach-hang/delete/${id}`);
          this.customers = this.customers.filter(c => c.id !== id);
          toast.success("Xóa khách hàng thành công!");
        } catch (err) {
          toast.error("Lỗi khi xóa khách hàng!");
        }
      }
    },
    closeModal() {
      this.showModal = false;
      this.errors = { hoTen: "", email: "", soDienThoai: "" };
    },
    changePage(p) {
      if (p >= 1 && p <= this.totalPages) this.currentPage = p;
    }
  },
  mounted() {
    this.fetchCustomers();
  }
};
</script>

<style scoped>
/* Giữ nguyên style của modal hóa đơn cho đồng bộ */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; padding: 40px 20px;
}
.form-card {
  background: #fff; border-radius: 12px; padding: 32px; max-width: 600px; width: 100%;
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
