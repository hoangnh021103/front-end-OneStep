<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <!-- Main content -->
    <div class="content">
      <!-- Header -->
      <header class="header">
        <div></div>
      </header>
      <div class="page-title">
        <h2>Quản lý hóa đơn</h2>
      </div>
      <!-- Filter -->
      <div class="filter-box">
        <div class="filter-title">Bộ lọc tìm kiếm</div>
        <div class="filter-controls">
          <input v-model="search" placeholder="Nhập tên khách hàng, sđt, mã đơn..." />
          <input type="date" v-model="fromDate" />
          <input type="date" v-model="toDate" />
          <button @click="resetFilter"><i class="fa fa-undo"></i> Đặt lại bộ lọc</button>
        </div>
      </div>
      <!-- Tabs -->
      <div class="tab-section">
        <span :class="['tab', {active: tab==='all'}]" @click="tab='all'">Tất cả <span class="tab-badge">{{ filteredInvoices.length }}</span></span>
        <span :class="['tab', {active: tab==='pending'}]" @click="tab='pending'">Chờ xác nhận <span class="tab-badge">{{ countByStatus('pending') }}</span></span>
        <span :class="['tab', {active: tab==='confirmed'}]" @click="tab='confirmed'">Đã xác nhận <span class="tab-badge">{{ countByStatus('confirmed') }}</span></span>
        <span :class="['tab', {active: tab==='shipping'}]" @click="tab='shipping'">Chờ giao <span class="tab-badge">{{ countByStatus('shipping') }}</span></span>
        <span :class="['tab', {active: tab==='delivering'}]" @click="tab='delivering'">Đang giao <span class="tab-badge">{{ countByStatus('delivering') }}</span></span>
        <span :class="['tab', {active: tab==='done'}]" @click="tab='done'">Hoàn thành <span class="tab-badge">{{ countByStatus('done') }}</span></span>
        <span :class="['tab', {active: tab==='cancel'}]" @click="tab='cancel'">Đã hủy <span class="tab-badge">{{ countByStatus('cancel') }}</span></span>
      </div>
      <!-- Table -->
      <div class="table-section">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã Đơn</th>
              <th>Tên Khách Hàng</th>
              <th>SĐT Khách Hàng</th>
              <th>Loại Đơn</th>
              <th>Email</th>
              <th>Tổng Tiền</th>
              <th>Ngày Tạo</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tabInvoices.length === 0">
              <td colspan="10" class="no-data">
                <div class="empty-state">
                  <div class="empty-icon"><i class="fa fa-file-invoice"></i></div>
                  <div class="empty-text">Chưa có hóa đơn nào</div>
                  <div class="empty-subtext">Dữ liệu hóa đơn sẽ hiển thị ở đây</div>
                </div>
              </td>
            </tr>
            <tr v-for="(inv, idx) in tabInvoices" :key="inv.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ inv.maDon }}</td>
              <td>{{ inv.hoTen }}</td>
              <td>{{ inv.soDienThoai }}</td>
              <td>
                <span class="type-badge">{{ formatType(inv.loaiDon) }}</span>
              </td>
              <td>{{ inv.email }}</td>
              <td>{{ inv.tongTien }}</td>
              <td>{{ formatDate(inv.ngayXacNhan) }}</td>
              <td>
                <span :class="['status-badge', inv.statusClass]">{{ inv.statusLabel }}</span>
              </td>
              <td>
                <button class="action-btn edit-btn" title="Chỉnh sửa" @click="editInvoice(idx)"><i class="fa fa-edit"></i></button>
                <button class="action-btn delete-btn" title="Xóa" @click="deleteInvoice(inv.id)"><i class="fa fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Modal for Editing Invoice -->
      <div v-if="showModal" class="modal-overlay">
        <div class="form-card">
          <div class="header">
            <h2>Chỉnh sửa hóa đơn</h2>
            <button class="btn-back" @click="closeModal">
              <i class="fa fa-arrow-left"></i> Quay lại
            </button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mã Đơn *</label>
              <input
                v-model="newInvoice.maDon"
                type="text"
                placeholder="Nhập mã đơn"
                :class="{ 'error': errors.maDon }"
              />
              <span class="error-message" v-if="errors.maDon">{{ errors.maDon }}</span>
            </div>
            <div class="form-group">
              <label>Tên Khách Hàng *</label>
              <input
                v-model="newInvoice.hoTen"
                type="text"
                placeholder="Nhập tên khách hàng"
                :class="{ 'error': errors.hoTen }"
              />
              <span class="error-message" v-if="errors.hoTen">{{ errors.hoTen }}</span>
            </div>
            <div class="form-group">
              <label>SĐT Khách Hàng *</label>
              <input
                v-model="newInvoice.soDienThoai"
                type="text"
                placeholder="Nhập số điện thoại"
                :class="{ 'error': errors.soDienThoai }"
              />
              <span class="error-message" v-if="errors.soDienThoai">{{ errors.soDienThoai }}</span>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input
                v-model="newInvoice.email"
                type="text"
                placeholder="Nhập email"
                :class="{ 'error': errors.email }"
              />
              <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
            </div>
            <div class="form-group">
              <label>Loại Đơn *</label>
              <select v-model="newInvoice.loaiDon" :class="{ 'error': errors.loaiDon }">
                <option :value="0">OFFLINE</option>
                <option :value="1">ONLINE</option>
              </select>
              <span class="error-message" v-if="errors.loaiDon">{{ errors.loaiDon }}</span>
            </div>
            <div class="form-group">
              <label>Tổng Tiền *</label>
              <input
                v-model.number="newInvoice.tongTien"
                type="number"
                min="0"
                placeholder="Nhập tổng tiền"
                :class="{ 'error': errors.tongTien }"
              />
              <span class="error-message" v-if="errors.tongTien">{{ errors.tongTien }}</span>
            </div>
            <div class="form-group">
              <label>Ngày Xác Nhận *</label>
              <input
                v-model="newInvoice.ngayXacNhan"
                type="date"
                :class="{ 'error': errors.ngayXacNhan }"
              />
              <span class="error-message" v-if="errors.ngayXacNhan">{{ errors.ngayXacNhan }}</span>
            </div>
            <div class="form-group">
              <label>Trạng Thái *</label>
              <select v-model="newInvoice.status" :class="{ 'error': errors.status }">
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Chờ giao</option>
                <option value="delivering">Đang giao</option>
                <option value="done">Hoàn thành</option>
                <option value="cancel">Đã hủy</option>
              </select>
              <span class="error-message" v-if="errors.status">{{ errors.status }}</span>
            </div>
          </div>
          <div class="actions">
            <button
              class="btn-primary"
              @click="handleSubmit"
              :disabled="isSubmitting"
            >
              <i class="fa fa-check"></i> {{ isSubmitting ? 'Đang lưu...' : 'Cập nhật' }}
            </button>
            <button
              class="btn-secondary"
              @click="closeModal"
              :disabled="isSubmitting"
            >
              <i class="fa fa-times"></i> Hủy
            </button>
          </div>
        </div>
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
      invoices: [],
      search: "",
      status: "",
      fromDate: "",
      toDate: "",
      tab: "all",
      showModal: false,
      isSubmitting: false,
      editIndex: null,
      newInvoice: {
        khachHangId: 0,
        voucherId: 0,
        diaChiId: 0,
        soDienThoai: "",
        hoTen: "",
        email: "",
        tongTienGoc: 0,
        tienGiam: 0,
        tongTien: 0,
        tienShip: 0,
        ngayXacNhan: "",
        ngayDuKien: "",
        ngayNhan: "",
        loaiDon: 0,
        ghiChu: "",
        maDon: "",
        status: "pending"
      },
      errors: {
        maDon: "",
        hoTen: "",
        soDienThoai: "",
        email: "",
        loaiDon: "",
        tongTien: "",
        ngayXacNhan: "",
        status: ""
      }
    };
  },
  computed: {
    filteredInvoices() {
      const keyword = this.search.toLowerCase();
      return this.invoices
        .filter(inv => {
          const matchSearch = this.search === '' ||
            (inv.hoTen && inv.hoTen.toLowerCase().includes(keyword)) ||
            (inv.soDienThoai && inv.soDienThoai.includes(keyword)) ||
            (inv.maDon && inv.maDon.toLowerCase().includes(keyword)) ||
            (inv.email && inv.email.toLowerCase().includes(keyword));
          const matchFrom = !this.fromDate || inv.ngayXacNhan >= this.fromDate;
          const matchTo = !this.toDate || inv.ngayXacNhan <= this.toDate;
          return matchSearch && matchFrom && matchTo;
        })
        .map(inv => ({
          ...inv,
          status: inv.status || 'pending',
          statusLabel: this.statusLabel(inv.status || 'pending'),
          statusClass: inv.status || 'pending'
        }));
    },
    tabInvoices() {
      if (this.tab === 'all') return this.filteredInvoices;
      return this.filteredInvoices.filter(inv => inv.status === this.tab);
    }
  },
  methods: {
    async fetchInvoices() {
      try {
        const res = await axios.get("http://localhost:8080/don-hang/hien-thi");
        this.invoices = Array.isArray(res.data) ? res.data : res.data.data || [];
        console.log('API Response:', this.invoices);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        toast.error('Không thể tải danh sách hóa đơn');
      }
    },
    async deleteInvoice(id) {
      if (confirm("Xác nhận xóa hóa đơn này?")) {
        try {
          await axios.delete(`http://localhost:8080/don-hang/delete/${id}`);
          this.invoices = this.invoices.filter(inv => inv.id !== id);
          toast.success("Xóa hóa đơn thành công!");
        } catch (err) {
          console.error('Error deleting invoice:', err);
          toast.error("Lỗi khi xóa hóa đơn!");
        }
      }
    },
    resetFilter() {
      this.search = "";
      this.status = "";
      this.fromDate = "";
      this.toDate = "";
      this.fetchInvoices();
    },
    countByStatus(status) {
      return this.filteredInvoices.filter(inv => inv.status === status).length;
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("vi-VN");
    },
    statusLabel(status) {
      switch (status) {
        case "pending": return "Chờ xác nhận";
        case "confirmed": return "Đã xác nhận";
        case "shipping": return "Chờ giao";
        case "delivering": return "Đang giao";
        case "done": return "Hoàn thành";
        case "cancel": return "Đã hủy";
        default: return "Không xác định";
      }
    },
    formatType(loaiDon) {
      return loaiDon === 0 ? "OFFLINE" : "ONLINE";
    },
    closeModal() {
      this.showModal = false;
      this.errors = {
        maDon: "",
        hoTen: "",
        soDienThoai: "",
        email: "",
        loaiDon: "",
        tongTien: "",
        ngayXacNhan: "",
        status: ""
      };
    },
    validateForm() {
      this.errors = {
        maDon: "",
        hoTen: "",
        soDienThoai: "",
        email: "",
        loaiDon: "",
        tongTien: "",
        ngayXacNhan: "",
        status: ""
      };
      let isValid = true;

      if (!this.newInvoice.maDon.trim()) {
        this.errors.maDon = "Mã đơn là bắt buộc.";
        isValid = false;
      }
      if (!this.newInvoice.hoTen.trim()) {
        this.errors.hoTen = "Tên khách hàng là bắt buộc.";
        isValid = false;
      }
      if (!this.newInvoice.soDienThoai.trim()) {
        this.errors.soDienThoai = "Số điện thoại là bắt buộc.";
        isValid = false;
      }
      if (this.newInvoice.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newInvoice.email)) {
        this.errors.email = "Email không hợp lệ.";
        isValid = false;
      }
      if (this.newInvoice.tongTien <= 0) {
        this.errors.tongTien = "Tổng tiền phải lớn hơn 0.";
        isValid = false;
      }
      if (!this.newInvoice.ngayXacNhan) {
        this.errors.ngayXacNhan = "Ngày xác nhận là bắt buộc.";
        isValid = false;
      }
      if (!this.newInvoice.status) {
        this.errors.status = "Trạng thái là bắt buộc.";
        isValid = false;
      }

      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      try {
        this.isSubmitting = true;
        const updatedInvoice = { ...this.newInvoice };
        await axios.put(`http://localhost:8080/don-hang/update/${updatedInvoice.id}`, updatedInvoice);
        this.invoices[this.editIndex] = updatedInvoice;
        toast.success("Cập nhật hóa đơn thành công!");
        this.closeModal();
      } catch (err) {
        console.error('Error updating invoice:', err);
        toast.error("Lỗi khi cập nhật hóa đơn!");
      } finally {
        this.isSubmitting = false;
      }
    },
    editInvoice(index) {
      this.editIndex = index;
      this.newInvoice = { ...this.invoices[index] };
      this.errors = {
        maDon: "",
        hoTen: "",
        soDienThoai: "",
        email: "",
        loaiDon: "",
        tongTien: "",
        ngayXacNhan: "",
        status: ""
      };
      this.showModal = true;
    }
  },
  mounted() {
    this.fetchInvoices();
  }
};
</script>

<style scoped>
.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  min-height: 100vh;
  padding: 40px 20px;
  overflow-y: auto;
  transition: opacity 0.3s ease;
}

.modal-overlay-enter-active, .modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.modal-overlay-enter-from, .modal-overlay-leave-to {
  opacity: 0;
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 32px;
  max-width: 720px;
  width: 100%;
  margin: auto;
  min-height: 400px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: translateY(0);
}

.form-card-enter-active, .form-card-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.form-card-enter-from, .form-card-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2a44;
  margin: 0;
}

.btn-back {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 10px 16px;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-back:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 15px;
  color: #444;
}

.form-group input,
.form-group select {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  background: #fafafa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  background: #ffffff;
}

.error {
  border-color: #e63946 !important;
}

.error-message {
  margin-top: 6px;
  font-size: 14px;
  color: #e63946;
  font-weight: 500;
}

.actions {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

button {
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #333;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.btn-secondary:disabled {
  background: #f3f4f6;
  color: #999;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 20px 10px;
  }

  .form-card {
    max-width: 95%;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .actions button {
    width: 100%;
  }
}
</style>